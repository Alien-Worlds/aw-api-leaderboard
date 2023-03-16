import { PostRoute, RouteHandler, Request } from '@alien-worlds/api-core';
import { UpdateLeaderboardRequest } from '../data/leaderboard.dtos';
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
    super('/v1/leaderboard', handler, {
      validators: {
        request: (request: Request<UpdateLeaderboardRequest>) => {
          const valid = request?.body?.wallet_id != null;

          return {
            valid,
            message: !valid ? 'bad request' : '',
            errors: ['wallet_id is required'],
          };
        },
      },
      hooks: {
        pre: UpdateLeaderboardInput.fromRequest,
        post: UpdateLeaderboardOutput.create,
      },
    });
  }
}
