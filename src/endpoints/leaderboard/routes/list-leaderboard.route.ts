import { GetRoute, RouteHandler } from '@alien-worlds/api-core';

import { ListLeaderboardInput } from '../domain/models/list-leaderboard.input';
import { ListLeaderboardOutput } from '../domain/models/list-leaderboard.output';

/*imports*/

/**
 * @class
 */
export class ListLeaderboardRoute extends GetRoute {
  public static create(handler: RouteHandler) {
    return new ListLeaderboardRoute(handler);
  }

  private constructor(handler: RouteHandler) {
    super('/v1/leaderboard/list', handler, {
      hooks: {
        pre: ListLeaderboardInput.fromRequest,
        post: (output: ListLeaderboardOutput) => output.toResponse(),
      },
    });
  }
}
