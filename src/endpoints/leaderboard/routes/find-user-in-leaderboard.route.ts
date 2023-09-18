import { GetRoute, RouteHandler } from '@alien-worlds/aw-core';

import { FindUserInLeaderboardRouteIO } from './find-user-in-leaderboard.route-io';
import { LeaderboardApiConfig } from '../../../config';

/*imports*/

/**
 * @class
 */
export class FindUserInLeaderboardRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new FindUserInLeaderboardRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/find`, handler, {
      io: new FindUserInLeaderboardRouteIO(),
    });
  }
}
