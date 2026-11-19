import http from 'http';
import https from 'https';

/**
 * Node 19 turned keep-alive on for the default HTTP agents (it was off in Node 17).
 * node-fetch 2, which the AtomicAssets API client uses, then reuses sockets that the
 * server has already closed, and the request fails with
 * "FetchError: ... reason: socket hang up". Turn it off again, as it was.
 *
 * Import this before anything makes an outgoing HTTP request. It changes the
 * existing global agents instead of replacing them, so the New Relic agent's
 * instrumentation stays in place.
 */

// The `keepAlive` property exists on Agent at runtime but is missing from @types/node.
type KeepAliveAgent = { keepAlive: boolean };

(http.globalAgent as unknown as KeepAliveAgent).keepAlive = false;
(https.globalAgent as unknown as KeepAliveAgent).keepAlive = false;
