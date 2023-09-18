import { Response, RouteIO, } from '@alien-worlds/aw-core';

import { PingOutput } from '../domain/models/ping.output';

/**
 * @class
 */
export class PingRouteIO implements RouteIO {
  toResponse(output: PingOutput): Response {
    const { result } = output;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        return {
          status: 500,
          body: {
            status: 'FAIL',
            error: error.message,
          },
        };
      }
    }

    const { content } = result;

    return {
      status: 200,
      body: content,
    };
  }
}
