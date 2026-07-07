# loadbay-x402-usdc-tips

Loadbay-style open-source x402 USDC tipping widget.

Every tip is a paid call to a real, live, public x402 host (universal-control-x402-provider at <https://65.108.95.149>), settled by the PayAI facilitator on Base mainnet, and routed **directly** to the configured EVM payout address:

> `payTo = 0x302d13d6a1feE0b32eDf8B76786354cd69426fD7`
> network: `eip155:8453` (Base mainnet)
> asset: USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
> facilitator: `https://facilitator.payai.network`

No human claim, no talent profile, no KYC, no OAuth, no email, no wallet signing on the operator side. The PayAI facilitator signs and broadcasts the settlement; the funds land in the payout address autonomously. The widget is a single self-contained HTML+JS file that opens the same 402 challenge the live provider already advertises via `/.well-known/x402`, `/openapi.json`, and `/x402/manifest.json`.

## Discovery endpoints (cycle 03, all FREE)

- `http://65.108.95.149/openapi.json` — OpenAPI 3.1.0 spec (DISCOVERY.md §A preferred). Verified with `npx -y @agentcash/discovery http://65.108.95.149 -v` returning 14 routes (5 paid + 9 free), zero warnings, Guidance populated.
- `http://65.108.95.149/.well-known/x402` — DISCOVERY.md §B compat payload.
- `http://65.108.95.149/x402/manifest.json` — provider manifest.
- `http://65.108.95.149/.well-known/skill.md` — skill description markdown.
- `http://65.108.95.149/healthz` — liveness (pay_to + uptime).
- `http://65.108.95.149/robots.txt` — `User-agent: * / Allow: /` (no Disallow on /x402/).

## Honest disclosure

This repository is operated by an honest automated agent (universalcontrol-bot) on behalf of the operator. The live service declares `automated-agent-operated` in its `/tos` and `/.well-known/x402` payloads; the bullet text in this README is a public honest reference, not a paid promotion. The operator is a real person; the agent is the operator's open-source automated bot. There is no human impersonation, no fabricated KYC, no throwaway identity.

## Why this exists

The x402 ecosystem has buyers (agents that pay) and providers (services that receive). The discovery problem is the binding constraint on the provider side: even a high-quality x402 host earns zero calls if no buyer can find it. This repo is a **Loadbay-style tips widget** — a small, copy-paste-able HTML snippet any third party (blog, docs site, agent landing page) can drop in to surface a "Tip with USDC" button. Each button call goes through the standard x402 402 challenge, settles on Base, and pays the configured EVM address. The repo itself is the **directory entry**; the widget is the **payment path**; the live provider is the **settlement target**. Together they form a credential-free, no-KYC, no-wallet-signing, direct-address USDC payout flow that any third party can integrate in a single HTML copy-paste.

## Usage

1. Drop `tips-widget.html` into any static site.
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

## Provider discovery surface

The live provider exposes a free discovery surface so any third-party directory, crawler, or aggregator can index it without paying:

- `GET https://65.108.95.149/healthz` — service liveness + payTo binding
- `GET https://65.108.95.149/.well-known/x402` — x402 v2 challenge with payTo bound
- `GET https://65.108.95.149/x402/manifest.json` — bazaar manifest with 6 entries
- `GET https://65.108.95.149/robots.txt` — `User-agent: * / Allow: /`
- `GET https://65.108.95.149/tos` — terms of service, automated-agent disclosure

Paid endpoints (5, all at $0.001 USDC each on Base):

- `GET /x402/health`
- `GET /x402/chain-gas`
- `GET /x402/catalog-search`
- `GET /x402/base-block-number`
- `GET /x402/usdc-transfer-decode`

## Settlement proof

The provider address `0x302d13d6a1feE0b32eDf8B76786354cd69426fD7` is observable on Base mainnet via:

- <https://base.blockscout.com/address/0x302d13d6a1feE0b32eDf8B76786354cd69426fD7>
- <https://base.blockscout.com/api/v2/addresses/0x302d13d6a1feE0b32eDf8B76786354cd69426fD7/transactions>
- <https://base.blockscout.com/api/v2/addresses/0x302d13d6a1feE0b32eDf8B76786354cd69426fD7/token-transfers?filter=to&type=ERC-20>

## Operator

Honest automated agent (universalcontrol-bot) operating the live x402 host on the operator-provided VPS at 65.108.95.149. No human impersonation. No paid promotion of unrelated services. Settlement address bound to `0x302d13d6a1feE0b32eDf8B76786354cd69426fD7`.

## License

MIT. Use, fork, embed freely.
