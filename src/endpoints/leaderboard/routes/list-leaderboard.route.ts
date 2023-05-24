import { GetRoute, RouteHandler } from '@alien-worlds/api-core';

import { ListLeaderboardInput } from '../domain/models/list-leaderboard.input';
import { ListLeaderboardOutput } from '../domain/models/list-leaderboard.output';
import { LeaderboardApiConfig } from '../../../config';

/*imports*/

/**
 * @class
 */
export class ListLeaderboardRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new ListLeaderboardRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/list`, handler, {
      hooks: {
        pre: ListLeaderboardInput.fromRequest,
        post: (output: ListLeaderboardOutput) => output.toResponse(),
      },
    });
  }
}
