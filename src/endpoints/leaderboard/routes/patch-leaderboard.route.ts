import { PatchRoute, Request, RouteHandler } from '@alien-worlds/api-core';

import { PatchLeaderboardRequest } from '../data/leaderboard.dtos';
import { PatchLeaderboardInput } from '../domain/models/patch-leaderboard.input';
import { PatchLeaderboardOutput } from '../domain/models/patch-leaderboard.output';

/*imports*/

/**
 * @class
 */
export class PatchLeaderboardRoute extends PatchRoute {
  public static create(handler: RouteHandler) {
    return new PatchLeaderboardRoute(handler);
  }

  private constructor(handler: RouteHandler) {
    super('/v1/leaderboard', handler, {
      validators: {
        request: (request: Request<PatchLeaderboardRequest>) => {
          const valid = request?.body?.wallet_id != null;

          return {
            valid,
            message: !valid ? "bad request" : "",
            errors: ["wallet_id is required"],
          }
        }
      },
      hooks: {
        pre: PatchLeaderboardInput.fromRequest,
        post: PatchLeaderboardOutput.create,
      },
    });
  }
}
