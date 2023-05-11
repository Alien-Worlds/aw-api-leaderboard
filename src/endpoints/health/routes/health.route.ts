import { GetRoute, RouteHandler } from '@alien-worlds/api-core';

import { HealthOutput } from '../domain/models/health.output';
import { LeaderboardApiConfig } from '../../../config';

/*imports*/

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
      hooks: {
        post: (output: HealthOutput) => output.toResponse(),
      },
    });
  }
}
