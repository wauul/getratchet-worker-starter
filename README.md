# GetRatchet worker starter

A customer-owned worker for GetRatchet. You own the code, destination credentials, Railway account and compute bill. GetRatchet does not host customer code.

## Deploy

Fork this repository, then deploy it as a Railway service using the Dockerfile builder. Use one replica initially, healthcheck `/health`, and restart on failure (maximum ten retries).

Set these variables privately:

- `RATCHET_WORKER_KEY`: a WORKER key scoped to your GetRatchet project and environment. Allow `getratchet_echo@1` for this example; never use an ingest or owner credential.
- `RATCHET_WORKER_ID`: a stable unique identifier, at least eight characters, unique per replica.
- `RATCHET_BASE_URL`: defaults to `https://getratchet.waelfz.com`.
- `PORT`: Railway provides this automatically; local default is 8080.

The `getratchet_echo@1` handler returns its input. Replace it with your own handler and matching key allowlist. Durable execution is at least once: a crash or expired lease can cause duplicate side effects. Use destination-side idempotency for every external write.

Never commit `.env` files or destination credentials. Railway compute can incur charges; review your plan and usage before deploying. New Railway services should use dashboard settings; `railway.json` documents equivalent settings for legacy Config as Code.

[Worker deployment guide](https://getratchet.waelfz.com/docs/worker-deployment)
