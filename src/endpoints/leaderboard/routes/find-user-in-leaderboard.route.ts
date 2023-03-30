import { GetRoute, RouteHandler } from '@alien-worlds/api-core';

import { FindUserInLeaderboardInput } from '../domain/models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardOutput } from '../domain/models/find-user-in-leaderboard.output';

/*imports*/

/**
 * @class
 */
export class FindUserInLeaderboardRoute extends GetRoute {
  public static create(handler: RouteHandler) {
    return new FindUserInLeaderboardRoute(handler);
  }

  private constructor(handler: RouteHandler) {
    super('/v1/leaderboard/find', handler, {
      hooks: {
        pre: FindUserInLeaderboardInput.fromRequest,
        post: (output: FindUserInLeaderboardOutput) => output.toResponse(),
      },
    });
  }
}
