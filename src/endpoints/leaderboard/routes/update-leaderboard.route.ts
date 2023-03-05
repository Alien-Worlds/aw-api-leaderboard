import { PostRoute, RouteHandler } from '@alien-worlds/api-core';
import { UpdateLeaderboardInput } from '../domain/models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from '../domain/models/update-leaderboard.output';

/*imports*/

/**
 * @class
 */
export class UpdateLeaderboardRoute extends PostRoute {
  public static create(handler: RouteHandler) {
    return new UpdateLeaderboardRoute(handler);
  }

  private constructor(handler: RouteHandler) {
    super('leaderboard', handler, {
      hooks: {
        pre: UpdateLeaderboardInput.fromRequest,
        post: UpdateLeaderboardOutput.create,
      },
    });
  }
}
