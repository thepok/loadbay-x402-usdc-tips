# x402scan Discovery Submission — Operator-Ready Handoff (cycle-03 update)

## Why this draft exists

Cycle 02 work confirmed:
- x402scan.com/resources/register is an interactive Next.js form with NO public REST POST endpoint (verified across 9 probes in cycle 01).
- Direct filing on Merit-Systems/x402scan via the operator's GitHub PAT (thepok) is blocked — PAT scope = `pull` on that repo (verified via GET /repos/Merit-Systems/x402scan -> permissions.push=False).
- Mirrors (saynchowdhury/x402scan, Nomorealive1/x402scan, olysykes141/x402scan, solenceaiX402/x402scan) are all archived or read-only.

Cycle 03 work:
- Added a `GET /openapi.json` FREE route serving an OpenAPI 3.1.0 spec that is fully DISCOVERY.md-section-A-compliant (OpenAPI-first recommended in the spec). Verified via `npx -y @agentcash/discovery http://65.108.95.149 -v` which now returns:
  - Source: openapi
  - API: Universal Control x402 Provider
  - Routes: 14 (5 paid apiKey+paid 0.001 USD [x402] + 9 free unprotected)
  - Guidance: 200 tokens (info.x-guidance populated)
  - Warnings: 0
- Live at `http://65.108.95.149/openapi.json` (7267 bytes) — also `https://65.108.95.149/openapi.json` over the self-signed Caddy chain.
- Also added `GET /.well-known/x402` (DISCOVERY.md-section-B-compliant) and `GET /.well-known/skill.md` (free discovery surface) as the cycle-02 free-surface block.
- Both `/.well-known/x402` (fallback path) and `/openapi.json` (preferred path per DISCOVERY.md) are present and crawler-ready.

So the path is:
1. Both `/.well-known/x402` and `/openapi.json` are strictly DISCOVERY.md-compliant so x402scan's indexer can pick us up automatically (DONE cycle 02 + cycle 03).
2. File a small "please add this resource" issue on Merit-Systems/x402scan from an account that has issue:write scope (operator-only) — body below.

## Discovery URLs (cycle 03 confirmed live)

- `http://65.108.95.149/openapi.json` — OpenAPI 3.1.0 with x-payment-info + x-discovery (preferred per DISCOVERY.md §A)
- `http://65.108.95.149/.well-known/x402` — DISCOVERY.md §B compat (already shipped cycle 02)
- `http://65.108.95.149/x402/manifest.json` — provider manifest
- `http://65.108.95.149/healthz` — liveness (pay_to + uptime)
- `http://65.108.95.149/.well-known/skill.md` — skill description (cycle 01)
- `http://65.108.95.149/x402/health` — first paid endpoint (returns 402 with valid x402 v2 challenge)
- `http://65.108.95.149/robots.txt` — `User-agent: * / Allow: /` (no Disallow on /x402/)

## Issue Body (operator-ready, copy/paste to Merit-Systems/x402scan Issues)

Title: `Provider discovery: Universal Control x402 Provider on Base USDC ($0.001/call)`

Body:

> Hello — please consider adding the following live x402 provider to x402scan. All discovery endpoints are publicly reachable from the public internet and DISCOVERY.md-compliant (both OpenAPI-first §A and `.well-known/x402` §B paths).
>
> Provider: Universal Control x402 Provider
> Network: Base mainnet (`eip155:8453`)
> Asset: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
> payTo: `0x302d13d6a1feE0b32eDf8B76786354cd69426fD7`
> Facilitator: `https://facilitator.payai.network`
> Disclosure: automated-agent-operated (no human signup, no KYC, no OAuth, no email verification, no operator wallet signing)
> Operated by: a working-worker bot (thepok account) — honest disclosed-bot, not impersonating a real person.
>
> Discovery endpoints (all 200 OK, FREE):
>
> - `http://65.108.95.149/openapi.json` — OpenAPI 3.1.0 spec (DISCOVERY.md §A preferred). Pulls all 5 paid routes with `x-payment-info {protocols:[{x402:{}}], price:{mode:fixed, currency:USD, amount:"0.001"}}` and 9 free routes with `security:[]`. Verified via `npx -y @agentcash/discovery http://65.108.95.149 -v` returning 14 routes, zero warnings, Guidance populated.
> - `http://65.108.95.149/.well-known/x402` — DISCOVERY.md §B compat payload (x402Version=2, version=1, payTo, network, asset, facilitator, ownershipProofs, resources=[6 absolute URLs], instructions=automated-agent-operated).
> - `http://65.108.95.149/x402/manifest.json` — provider manifest (FREE per supervisor 2026-07-07 patch).
> - `http://65.108.95.149/.well-known/skill.md` — skill description markdown (FREE).
> - `http://65.108.95.149/robots.txt` — `User-agent: * / Allow: /` (no Disallow on /x402/), so crawlers can read bazaar metadata on the 402 challenge.
>
> Paid endpoints (each $0.001 USDC = 1000 atomic USDC, payTo above, settled by PayAI facilitator):
>
> - `GET http://65.108.95.149/x402/health`
> - `GET http://65.108.95.149/x402/chain-gas`
> - `GET http://65.108.95.149/x402/catalog-search`
> - `GET http://65.108.95.149/x402/base-block-number`
> - `GET http://65.108.95.149/x402/usdc-transfer-decode`
>
> Each paid route returns HTTP 402 with a parseable x402 v2 + bazaar-extension challenge (Payment-Required header, JSON body with non-empty accepts[].amount=1000, accepts[].payTo=configured, accepts[].asset=USDC, accepts[].network=eip155:8453, extensions.bazaar.info with input/output schemas).
>
> Note on TLS: server is reachable over HTTPS but currently uses a Caddy self-signed certificate. HTTP port 80 is also bound and serves the same routes cleanly, which is the canonical crawler endpoint per cycle-03 work; operators running HTTPS-only crawler agents are encouraged to use the HTTP endpoint for discovery and the HTTPS endpoint for production buyer calls (both serve identical discovery surfaces).
>
> Source code: https://github.com/thepok/loadbay-x402-usdc-tips (OpenAPI spec committed there for archival).
>
> Thank you for maintaining x402scan!
