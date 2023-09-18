import { GetRoute, RouteHandler } from '@alien-worlds/aw-core';

import { LeaderboardApiConfig } from '../../../config';
import { ListLeaderboardRouteIO } from './list-leaderboard.route-io';

/**
 * @class
 */
export class ListLeaderboardRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new ListLeaderboardRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/list`, handler, {
      io: new ListLeaderboardRouteIO(),
    });
  }
}
