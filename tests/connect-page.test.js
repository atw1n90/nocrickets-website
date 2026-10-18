const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const nginxFile = path.join(repoRoot, 'coolify-nginx-website.conf');
const pages = [
  {
    lang: 'en',
    file: path.join(repoRoot, 'website', 'connect', 'index.html'),
    sdkLocale: 'en_US',
    heading: 'Connect your WhatsApp',
    button: 'Connect WhatsApp',
    otherHref: '/es/connect/',
    success: 'WhatsApp connected!',
    cancelled: 'cancelled',
    currentStep: 'Current step',
    genericError: 'Something went wrong. Please send us a screenshot of this page.',
    httpStatus: 'HTTP status',
    sessionId: 'Session ID',
    metaLoading: "Meta couldn't load. If this keeps happening, turn off your ad blocker or open this page in Chrome."
  },
  {
    lang: 'es',
    file: path.join(repoRoot, 'website', 'es', 'connect', 'index.html'),
    sdkLocale: 'es_LA',
    heading: 'Conecta tu WhatsApp',
    button: 'Conectar WhatsApp',
    otherHref: '/connect/',
    success: '¡WhatsApp está conectado!',
    cancelled: 'cancelada',
    currentStep: 'Paso actual',
    genericError: 'Algo salió mal. Envíanos una captura de pantalla de esta página.',
    httpStatus: 'Estado HTTP',
    sessionId: 'ID de sesión',
    metaLoading: 'Meta no pudo cargar. Si esto sigue ocurriendo, desactiva tu bloqueador de anuncios o abre esta página en Chrome.'
  }
];

function readPage(page) {
  return fs.readFileSync(page.file, 'utf8');
}

function createElement() {
  const listeners = new Map();
  return {
    disabled: false,
    textContent: '',
    className: '',
    setAttribute() {},
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    dispatch(type) {
      const handler = listeners.get(type);
      assert.ok(handler, `missing ${type} handler`);
      return handler({ preventDefault() {} });
    }
  };
}

function createHarness(page, fetchResult = { ok: true, status: 200 }) {
  const html = readPage(page);
  const scriptMatch = html.match(/<script id="wa-connect-script">([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, `${page.lang} page is missing its connection script`);

  const button = createElement();
  const status = createElement();
  const windowListeners = new Map();
  const timers = new Map();
  const fetchCalls = [];
  let nextTimerId = 1;
  const loginCallbacks = [];
  let loginOptions;
  let initOptions;

  const FB = {
    init(options) {
      initOptions = options;
    },
    login(callback, options) {
      loginCallbacks.push(callback);
      loginOptions = options;
    }
  };

  const windowObject = {
    FB,
    addEventListener(type, handler) {
      windowListeners.set(type, handler);
    }
  };

  const context = vm.createContext({
    window: windowObject,
    document: {
      getElementById(id) {
        if (id === 'connect-button') return button;
        if (id === 'connect-status') return status;
        return null;
      }
    },
    FB,
    URL,
    JSON,
    Promise,
    AbortController,
    console,
    setTimeout(handler, milliseconds) {
      const id = nextTimerId++;
      timers.set(id, { handler, milliseconds });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    async fetch(url, options) {
      fetchCalls.push({ url, options });
      if (fetchResult instanceof Error) throw fetchResult;
      if (typeof fetchResult === 'function') return fetchResult(url, options);
      return fetchResult;
    }
  });

  vm.runInContext(scriptMatch[1], context, { filename: page.file });

  return {
    html,
    button,
    status,
    fetchCalls,
    init() {
      assert.equal(typeof windowObject.fbAsyncInit, 'function');
      windowObject.fbAsyncInit();
      return initOptions;
    },
    click() {
      button.dispatch('click');
      assert.equal(typeof loginCallbacks.at(-1), 'function');
      return loginOptions;
    },
    respondWithCode(code, callbackIndex = loginCallbacks.length - 1) {
      const callback = loginCallbacks[callbackIndex];
      assert.equal(typeof callback, 'function', `missing login callback ${callbackIndex}`);
      callback(code ? { authResponse: { code } } : {});
    },
    message(origin, data) {
      const handler = windowListeners.get('message');
      assert.ok(handler, 'message listener was not registered on page load');
      handler({ origin, data });
    },
    runTimer(milliseconds) {
      const timer = [...timers.entries()].find(([, value]) => value.milliseconds === milliseconds);
      assert.ok(timer, `missing ${milliseconds}ms timer`);
      timers.delete(timer[0]);
      timer[1].handler();
    },
    timerCount() {
      return timers.size;
    }
  };
}

function sessionMessage(eventName, data = {}) {
  return JSON.stringify({ type: 'WA_EMBEDDED_SIGNUP', event: eventName, data });
}

async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}

test('connect routes allow only the required Meta services in their CSP', () => {
  const nginx = fs.readFileSync(nginxFile, 'utf8');
  const location = nginx.match(/location ~ \^\/\(connect\|es\/connect\)\/\(index\\\.html\)\?\$ \{([\s\S]*?)\n    \}/);
  assert.ok(location, 'missing route-specific Connect location');

  const policyMatch = location[1].match(/add_header Content-Security-Policy "([^"]+)" always;/);
  assert.ok(policyMatch, 'missing Connect CSP response header');
  const directives = Object.fromEntries(policyMatch[1].split(';').map((part) => {
    const [name, ...sources] = part.trim().split(/\s+/);
    return [name, sources];
  }));

  assert.deepEqual(Object.keys(directives), [
    'frame-ancestors',
    'base-uri',
    'object-src',
    'script-src',
    'frame-src',
    'connect-src',
    'img-src'
  ]);
  assert.deepEqual(directives['frame-ancestors'], ["'self'"]);
  assert.deepEqual(directives['base-uri'], ["'self'"]);
  assert.deepEqual(directives['object-src'], ["'none'"]);
  assert.deepEqual(directives['script-src'], ["'self'", "'unsafe-inline'", 'https://connect.facebook.net']);
  assert.deepEqual(directives['frame-src'], ["'self'", 'https://*.facebook.com', 'https://*.fbcdn.net']);
  assert.deepEqual(directives['connect-src'], ["'self'", 'https://n8n.nocrickets.co', 'https://*.facebook.com', 'https://graph.facebook.com']);
  assert.deepEqual(directives['img-src'], ["'self'", 'data:', 'https://*.facebook.com', 'https://*.fbcdn.net']);
  const allSources = Object.values(directives).flat();
  assert.ok(!allSources.includes('*'), 'CSP must not contain a broad wildcard source');
  assert.ok(!allSources.includes('https:'), 'CSP must not allow every HTTPS origin');
  assert.equal((nginx.match(/add_header Content-Security-Policy/g) || []).length, 1, 'CSP must stay limited to the Connect location');
});

for (const page of pages) {
  test(`${page.lang} page is private, localized, and links to the other language`, () => {
    const html = readPage(page);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, new RegExp(`<html lang="${page.lang}">`));
    assert.ok(html.includes(page.heading));
    assert.ok(html.includes(page.button));
    assert.ok(html.includes(`href="${page.otherHref}"`));
    assert.ok(html.includes(`https://connect.facebook.net/${page.sdkLocale}/sdk.js`));
    assert.doesNotMatch(html, /<!--\s*TODO|\bplaceholder\s*=|>\s*placeholder\s*</i);
  });

  test(`${page.lang} page initializes and launches the required Meta configuration`, () => {
    const harness = createHarness(page);
    assert.deepEqual(JSON.parse(JSON.stringify(harness.init())), {
      appId: '1074122095611027',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v26.0'
    });
    assert.deepEqual(JSON.parse(JSON.stringify(harness.click())), {
      config_id: '1725275718536891',
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        version: 'v4',
        sessionInfoVersion: '3',
        featureType: 'whatsapp_business_app_onboarding'
      }
    });
    assert.equal(harness.button.disabled, true);
  });

  test(`${page.lang} page reports an SDK load failure after 10 seconds`, () => {
    const harness = createHarness(page);
    harness.runTimer(10000);
    assert.equal(harness.status.textContent, page.metaLoading);
    assert.equal(harness.status.className, 'status is-error');
  });

  test(`${page.lang} page sends FINISH data once when the code arrives first`, async () => {
    const harness = createHarness(page);
    harness.click();
    harness.respondWithCode('code-first');
    assert.equal(harness.fetchCalls.length, 0);
    harness.message('https://business.facebook.com', sessionMessage('FINISH', {
      waba_id: 'waba-1',
      phone_number_id: 'phone-1',
      business_id: 'business-1'
    }));
    await settle();

    assert.equal(harness.fetchCalls.length, 1);
    assert.equal(harness.fetchCalls[0].url, 'https://n8n.nocrickets.co/webhook/wa-signup-js');
    assert.equal(harness.fetchCalls[0].options.method, 'POST');
    assert.equal(harness.fetchCalls[0].options.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(harness.fetchCalls[0].options.body), {
      code: 'code-first',
      waba_id: 'waba-1',
      phone_number_id: 'phone-1',
      business_id: 'business-1',
      event: 'FINISH',
      lang: page.lang
    });
    assert.ok(harness.status.textContent.includes(page.success));
    assert.equal(harness.timerCount(), 0);

    harness.message('https://www.facebook.com', sessionMessage('FINISH', { waba_id: 'duplicate' }));
    await settle();
    assert.equal(harness.fetchCalls.length, 1);
  });

  test(`${page.lang} page sends Coexistence data when the session arrives first`, async () => {
    const harness = createHarness(page);
    harness.click();
    harness.message('https://facebook.com', sessionMessage('FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING', {
      waba_id: 'waba-2',
      business_id: 'business-2'
    }));
    assert.equal(harness.fetchCalls.length, 0);
    harness.respondWithCode('session-first');
    await settle();

    assert.deepEqual(JSON.parse(harness.fetchCalls[0].options.body), {
      code: 'session-first',
      waba_id: 'waba-2',
      phone_number_id: null,
      business_id: 'business-2',
      event: 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING',
      lang: page.lang
    });
  });

  test(`${page.lang} page sends null session fields after the 30-second fallback`, async () => {
    const harness = createHarness(page);
    harness.click();
    harness.respondWithCode('timeout-code');
    harness.runTimer(30000);
    await settle();

    assert.deepEqual(JSON.parse(harness.fetchCalls[0].options.body), {
      code: 'timeout-code',
      waba_id: null,
      phone_number_id: null,
      business_id: null,
      event: null,
      lang: page.lang
    });
  });

  test(`${page.lang} page ignores malformed, unrelated, and lookalike-origin messages`, async () => {
    const harness = createHarness(page);
    harness.click();
    harness.respondWithCode('safe-code');
    harness.message('not a URL', sessionMessage('FINISH', { waba_id: 'bad-1' }));
    harness.message('https://evilfacebook.com', sessionMessage('FINISH', { waba_id: 'bad-2' }));
    harness.message('https://facebook.com.evil.example', sessionMessage('FINISH', { waba_id: 'bad-3' }));
    harness.message('https://www.facebook.com', 'not json');
    harness.message('https://www.facebook.com', JSON.stringify({ type: 'OTHER_EVENT', event: 'FINISH' }));
    await settle();
    assert.equal(harness.fetchCalls.length, 0);

    harness.message('https://subdomain.facebook.com', sessionMessage('FINISH', { waba_id: 'good' }));
    await settle();
    assert.equal(harness.fetchCalls.length, 1);
  });

  test(`${page.lang} page reports cancellation with the current step and allows retry`, () => {
    const harness = createHarness(page);
    harness.click();
    harness.message('https://www.facebook.com', sessionMessage('CANCEL', { current_step: 'business_profile' }));
    assert.ok(harness.status.textContent.toLowerCase().includes(page.cancelled.toLowerCase()));
    assert.ok(harness.status.textContent.includes(`${page.currentStep}: business_profile`));
    assert.equal(harness.button.disabled, false);
    assert.equal(harness.fetchCalls.length, 0);
  });

  test(`${page.lang} page reports Meta errors with the session ID and allows retry`, () => {
    const harness = createHarness(page);
    harness.click();
    harness.message('https://www.facebook.com', sessionMessage('ERROR', {
      error_message: 'Meta test error',
      session_id: 'session-123'
    }));
    assert.ok(harness.status.textContent.includes('Meta test error'));
    assert.ok(harness.status.textContent.includes(`${page.sessionId}: session-123`));
    assert.equal(harness.button.disabled, false);
  });

  test(`${page.lang} page treats a missing authorization code as cancelled`, () => {
    const harness = createHarness(page);
    harness.click();
    harness.respondWithCode(null);
    assert.ok(harness.status.textContent.toLowerCase().includes(page.cancelled.toLowerCase()));
    assert.equal(harness.button.disabled, false);
  });

  test(`${page.lang} page shows only safe HTTP failure details and allows retry`, async () => {
    const harness = createHarness(page, { ok: false, status: 503, raw: 'must not appear' });
    harness.click();
    harness.respondWithCode('http-failure');
    harness.message('https://www.facebook.com', sessionMessage('FINISH', {
      waba_id: 'waba-3',
      session_id: 'session-503'
    }));
    await settle();

    assert.ok(harness.status.textContent.includes(page.genericError));
    assert.ok(harness.status.textContent.includes(`${page.httpStatus}: 503`));
    assert.ok(harness.status.textContent.includes(`${page.sessionId}: session-503`));
    assert.ok(!harness.status.textContent.includes('must not appear'));
    assert.equal(harness.button.disabled, false);
  });

  test(`${page.lang} page handles network failures without leaking details`, async () => {
    const harness = createHarness(page, new Error('private network detail'));
    harness.click();
    harness.respondWithCode('network-failure');
    harness.message('https://www.facebook.com', sessionMessage('FINISH', { waba_id: 'waba-4' }));
    await settle();

    assert.ok(harness.status.textContent.includes(page.genericError));
    assert.ok(!harness.status.textContent.includes('private network detail'));
    assert.equal(harness.button.disabled, false);
  });

  test(`${page.lang} page ignores a delayed callback from a cancelled attempt`, async () => {
    const harness = createHarness(page);
    harness.click();
    harness.message('https://www.facebook.com', sessionMessage('CANCEL', { current_step: 'business_profile' }));

    harness.click();
    harness.respondWithCode('stale-code', 0);
    harness.message('https://www.facebook.com', sessionMessage('FINISH', {
      waba_id: 'retry-waba',
      phone_number_id: 'retry-phone'
    }));
    assert.equal(harness.fetchCalls.length, 0);

    harness.respondWithCode('fresh-code', 1);
    await settle();
    assert.equal(harness.fetchCalls.length, 1);
    assert.equal(JSON.parse(harness.fetchCalls[0].options.body).code, 'fresh-code');
  });

  test(`${page.lang} page aborts a stalled webhook request and allows retry`, async () => {
    const neverResponds = (url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    });
    const harness = createHarness(page, neverResponds);
    harness.click();
    harness.respondWithCode('stalled-request');
    harness.message('https://www.facebook.com', sessionMessage('FINISH', { waba_id: 'stalled-waba' }));
    harness.runTimer(60000);
    await settle();

    assert.ok(harness.status.textContent.includes(page.genericError));
    assert.equal(harness.button.disabled, false);
  });
}
