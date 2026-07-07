// x402 USDC tips widget (Loadbay-style)
// Pure browser-side; uses window.ethereum if present, otherwise shows the
// 402 challenge in the status div so the user can pay from any x402-aware
// wallet (PayAI, Bankr, thirdweb, etc.).
//
// Configuration is read from data-* attributes on the root .x402-tips div.
// Defaults below match the live universal-control-x402-provider on Base.

(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    baseUrl: 'https://65.108.95.149',
    endpoint: '/x402/health',
    amountUsdc: '0.001',
    payTo: '0x302d13d6a1feE0b32eDf8B76786354cd69426fD7',
    network: 'eip155:8453',
    asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    facilitator: 'https://facilitator.payai.network'
  };

  function readConfig(root) {
    var cfg = Object.assign({}, DEFAULT_CONFIG);
    for (var k in DEFAULT_CONFIG) {
      var ds = root.getAttribute('data-' + camel(k));
      if (ds != null && ds !== '') cfg[k] = ds;
    }
    return cfg;
  }

  function camel(s) {
    return s.replace(/[-_]([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }

  function setStatus(root, msg) {
    var s = root.querySelector('.x402-status');
    if (s) s.textContent = msg;
  }

  function attach(root) {
    var btn = root.querySelector('button');
    if (!btn) return;
    var cfg = readConfig(root);
    btn.addEventListener('click', function () {
      btn.disabled = true;
      setStatus(root, 'Requesting ' + cfg.endpoint + ' ...');
      var url = cfg.baseUrl.replace(/\/+$/, '') + cfg.endpoint;
      fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit' })
        .then(function (resp) {
          if (resp.status === 200) {
            return resp.json().then(function (body) {
              setStatus(root, 'Free response: ' + JSON.stringify(body).slice(0, 80));
            });
          }
          if (resp.status === 402) {
            return resp.json().then(function (body) {
              var accept = (body && body.accepts && body.accepts[0]) || {};
              var payTo = accept.payTo || cfg.payTo;
              var amount = accept.maxAmountRequired || accept.amount || cfg.amountUsdc;
              var network = accept.network || cfg.network;
              var asset = accept.asset || cfg.asset;
              var facilitator = body.facilitator || cfg.facilitator;
              setStatus(
                root,
                '402 Payment Required. payTo=' + payTo +
                ' amount=' + amount + ' (' + network + '). ' +
                'Settle via ' + facilitator + ' or any x402 wallet.'
              );
              // Real settlement requires a wallet; the widget surfaces the
              // 402 challenge so the user can pay from PayAI / Bankr /
              // thirdweb / a self-custody browser wallet that speaks x402.
              if (window.ethereum && window.ethereum.request) {
                setStatus(root, 'Wallet detected. Use your x402-aware wallet to pay 0.001 USDC to ' + payTo + ' on Base.');
              }
            });
          }
          setStatus(root, 'HTTP ' + resp.status + ' (unexpected).');
        })
        .catch(function (err) {
          setStatus(root, 'Network error: ' + (err && err.message ? err.message : 'unknown'));
        })
        .then(function () { btn.disabled = false; });
    });
  }

  function init() {
    var roots = document.querySelectorAll('.x402-tips');
    for (var i = 0; i < roots.length; i++) attach(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
