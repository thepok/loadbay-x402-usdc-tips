# loadbay-x402-usdc-tips

Loadbay-style open-source x402 USDC tipping widget.

Every tip is a paid call to a real, live, public x402 host (universal-control-x402-provider at <https://65.108.95.149>), settled by the PayAI facilitator on Base mainnet, and routed **directly** to the configured EVM payout address:

> `payTo = 0x302d13d6a1feE0b32eDf8B76786354cd69426fD7`
> network: `eip155:8453` (Base mainnet)
> asset: USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
> facilitator: `https://facilitator.payai.network`

No human claim, no talent profile, no KYC, no OAuth, no email, no wallet signing on the operator side. The PayAI facilitator signs and broadcasts the settlement; the funds land in the payout address autonomously. The widget is a single self-contained HTML+JS file that opens the same 402 challenge the live provider already advertises via `/.well-known/x402`, `/openapi.json`, and `/x402/manifest.json`.

## Live demo

A live demo of the widget is published at <https://thepok.github.io/loadbay-x402-usdc-tips/> via GitHub Pages.

Click the tip button: the widget fetches `https://65.108.95.149/x402/health`, the provider returns HTTP 402 with the embedded payTo, an x402-aware wallet (Coinbase, PayAI, Bankr, thirdweb) settles the payment on Base, the provider returns the payload, and 0.001 USDC lands at the configured payout address. No human step on the operator side.

## Discovery endpoints (all FREE)

- `https://65.108.95.149/openapi.json` — OpenAPI 3.1.0 spec.
- `https://65.108.95.149/.well-known/x402` — DISCOVERY.md §B compat payload.
- `https://65.108.95.149/x402/manifest.json` — provider manifest (FREE).
- `https://65.108.95.149/.well-known/skill.md` — skill description markdown.
- `https://65.108.95.149/healthz` — liveness (pay_to + uptime).
- `https://65.108.95.149/robots.txt` — `User-agent: * / Allow: /` (no Disallow on /x402/).

## Honest disclosure

This repository is operated by an honest automated agent (`universalcontrol-bot`) on behalf of the operator (the `thepok` GitHub account). The live service declares `automated-agent-operated` in its `/tos` and `/.well-known/x402` payloads. There is no human impersonation, no fabricated KYC, no throwaway identity.

## Usage

1. Drop `tips-widget.html` (or copy the `<div class="x402-tips">` block from `index.html`) into any static site.
2. The widget reads its configuration from `data-*` attributes on the `<div class="x402-tips">` root. Default config targets the live universal-control-x402-provider.
3. On click, the widget requests `GET /x402/health` (or whichever paid route you set in `data-endpoint`) against `https://65.108.95.149`.
4. The provider returns `HTTP 402 Payment Required` with the standard x402 challenge; the wallet signs and submits the payment; the provider returns the JSON payload.
5. The settlement is broadcast on Base mainnet and USDC lands at the configured EVM address.

```html
<div class="x402-tips"
     data-base-url="https://65.108.95.149"
     data-endpoint="/x402/health"
     data-amount-usdc="0.001"
     data-pay-to="0x302d13d6a1feE0b32eDf8B76786354cd69426fD7"
     data-network="eip155:8453"
     data-asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
     data-facilitator="https://facilitator.payai.network">
  <button>Tip with USDC</button>
</div>
<script src="tips-widget.js"></script>
```

Or with the live Pages-hosted assets:

```html
<script src="https://thepok.github.io/loadbay-x402-usdc-tips/tips-widget.js"></script>
```

## Files

- `tips-widget.html` — copy-paste widget snippet.
- `tips-widget.js` — vanilla-JS widget handler (no build step, no deps).
- `index.html` — polished landing page (this is what GitHub Pages serves).
- `skill.md` — agent discovery surface, mirrors the values embedded in the widget.
- `openapi.json` — discovery spec for the live provider.
- `x402scan-issue-draft.md` — operator-ready handoff for filing on the Merit-Systems/x402scan tracker.
- `LICENSE` — MIT.

## License

MIT.
