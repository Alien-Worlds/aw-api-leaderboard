import { GetRoute, RouteHandler } from '@alien-worlds/api-core';

import { FindUserInLeaderboardInput } from '../domain/models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardOutput } from '../domain/models/find-user-in-leaderboard.output';
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
      hooks: {
        pre: FindUserInLeaderboardInput.fromRequest,
        post: (output: FindUserInLeaderboardOutput) => output.toResponse(),
      },
    });
  }
}
