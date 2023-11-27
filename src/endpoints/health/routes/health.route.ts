import { GetRoute, RouteHandler } from '@alien-worlds/aw-core';

import { GetHealthRouteIO } from './health.route-io';
import { LeaderboardApiConfig } from '../../../config';

/**
 * @class
 *
 *
 */
export class GetHealthRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new GetHealthRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/health`, handler, {
      io: new GetHealthRouteIO(),
    });
  }
}
