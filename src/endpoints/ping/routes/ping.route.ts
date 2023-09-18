import { GetRoute, RouteHandler } from '@alien-worlds/aw-core';

import { LeaderboardApiConfig } from '../../../config';
import { PingRouteIO } from './ping.route-io';

export class GetPingRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new GetPingRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/ping`, handler, {
      io: new PingRouteIO(),
    });
  }
}
