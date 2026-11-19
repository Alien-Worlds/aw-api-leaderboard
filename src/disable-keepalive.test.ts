import http from 'http';
import https from 'https';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';
import './disable-keepalive';

type KeepAliveAgent = { keepAlive: boolean };

describe('disable-keepalive', () => {
  it('turns keep-alive off on the default http and https agents', () => {
    expect((http.globalAgent as unknown as KeepAliveAgent).keepAlive).toBe(false);
    expect((https.globalAgent as unknown as KeepAliveAgent).keepAlive).toBe(false);
  });

  it('survives a server that drops a socket it has already served', async () => {
    // Like an endpoint that closed an idle keep-alive connection: a second request
    // on the same connection gets no answer. With keep-alive on, node-fetch 2 reuses
    // the socket and fails with "socket hang up".
    const server = http.createServer((req, res) => {
      const socket = req.socket as typeof req.socket & { served?: boolean };
      if (socket.served) {
        socket.destroy();
        return;
      }
      socket.served = true;
      res.end('ok');
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
    try {
      for (let i = 0; i < 3; i++) {
        const res = await fetch(url);
        expect(await res.text()).toBe('ok');
      }
    } finally {
      server.close();
    }
  });
});
