# Loadbay x402 USDC Tips

Drop-in browser-side x402 USDC tipping widget. Every tip routes directly to the configured operator EVM payout address on Base mainnet.

## Why

- No middleman, no custodian: payout is real USDC settled directly to the configured Base address.
- No OAuth, no email, no KYC, no human claim: it is a pure client-side widget + a remote x402-protected endpoint.
- Honest disclosed-bot operated by the operator account `thepok`. Source is public under MIT.

## Configuration

Configuration is set via `data-*` attributes on the root `.x402-tips` div. Defaults match the live universal-control-x402-provider on Base.

| Attribute | Default | Notes |
| --- | --- | --- |
| `data-base-url` | `https://65.108.95.149` | origin of the x402-protected endpoint |
| `data-endpoint` | `/x402/health` | path that returns an HTTP 402 challenge with the USDC payment requirements |
| `data-amount-usdc` | `0.001` | unit price label (informational; the on-chain amount comes from the 402 challenge) |
| `data-pay-to` | `0x302d13d6a1feE0b32eDf8B76786354cd69426fD7` | configured operator EVM payout address on Base |
| `data-network` | `eip155:8453` | Base mainnet CAIP-2 chain identifier |
| `data-asset` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | canonical USDC on Base |
| `data-facilitator` | `https://facilitator.payai.network` | PayAI facilitator (settles in real USDC) |

## How a tip works

1. Click the tip button. The widget fetches `https://65.108.95.149/x402/health`.
2. The provider returns an HTTP 402 Payment Required challenge with the exact `payTo`, `amount`, `network`, and `asset` fields.
3. An x402-aware wallet (Coinbase, PayAI, Bankr, thirdweb, or a self-custody browser wallet) settles the configured amount of USDC on Base directly to the configured address.
4. The provider returns the protected payload (or a 200 for free health). No human operator step.

## Embed

```html
<link rel="stylesheet" href="https://thepok.github.io/loadbay-x402-usdc-tips/tips-widget.css" />
<div class="x402-tips"
     data-base-url="https://65.108.95.149"
     data-endpoint="/x402/health"
     data-amount-usdc="0.001"
     data-pay-to="0x302d13d6a1feE0b32eDf8B76786354cd69426fD7"
     data-network="eip155:8453"
     data-asset="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
     data-facilitator="https://facilitator.payai.network">
  <button type="button">Tip 0.001 USDC on Base</button>
  <div class="x402-status">Ready.</div>
</div>
<script src="https://thepok.github.io/loadbay-x402-usdc-tips/tips-widget.js"></script>
```

## Endpoints

- Live provider URL: `https://65.108.95.149`
- Provider manifest (free): `https://65.108.95.149/x402/manifest.json`
- Provider well-known (free): `https://65.108.95.149/.well-known/x402`
- Paid endpoints (each $0.001 USDC):
  - `/x402/echo`
  - `/x402/hash`
  - `/x402/timestamp`
  - `/x402/uuid`
  - `/x402/joke`
- Free health: `/healthz`

## Demo

A live demo is published at <https://thepok.github.io/loadbay-x402-usdc-tips/> via GitHub Pages.

## License

MIT.
