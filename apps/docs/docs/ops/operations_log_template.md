# Operations Log Template — On-chain Anchoring Runs

> Use this template to record metrics from outbox anchoring runs. One section
> per run/window.

## Run metadata

- Date/time window (UTC):
- Environment: dev | test | prod
- Anchor chain: solana | ethereum | avalanche-subnet | other
- Commitment/finality target: processed | confirmed | finalized | other
- Outbox batch settings: attempts=&lt;n&gt;, batch_limit=&lt;n&gt;,
  interval_sec=&lt;n&gt;

## Metrics summary

- Total outbox items processed: &lt;n&gt;
- Anchor attempts: &lt;n&gt;
- Anchor successes: &lt;n&gt;
- Anchor failures (permanent): &lt;n&gt;
- Transient retries triggered: &lt;n&gt;
- Average latency (submit→signature): &lt;ms&gt;
- P50 / P95 / P99 latency: &lt;ms&gt; / &lt;ms&gt; / &lt;ms&gt;
- Average fee per tx (native units): &lt;value&gt;
- Estimated cost per tx (ZAR): &lt;value&gt;

## RPC and reliability

- Primary RPC endpoint:
- Failover RPC used: yes | no
- Observed RPC errors (top 3):
  - &lt;message / code&gt;
  - &lt;message / code&gt;
  - &lt;message / code&gt;

## Operational notes

- Rate limiting encountered: yes | no (details)
- Blockhash or preflight errors observed: yes | no (details)
- Any manual interventions: yes | no (details)

## Sample records

- Example digest(s):
  - sha256: <hex>, txSig: <signature>, status: success | failed
  - sha256: <hex>, txSig: <signature>, status: success | failed

## Follow-ups and actions

- Tuning (retry/backoff/interval) to adjust:
- RPC provider changes:
- Security review items (keys, env handling, logging):
- Decision impacts (ADRs to update/reference):
