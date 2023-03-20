import { LeaderboardUpdateStruct } from '@alien-worlds/alienworlds-api-common';
import { PostRoute, RouteHandler, Request } from '@alien-worlds/api-core';
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
        request: (
          request: Request<LeaderboardUpdateStruct | LeaderboardUpdateStruct[]>
        ) => {
          let valid = true;
          if (Array.isArray(request?.body)) {
            request?.body.forEach(item => {
              if (!item.wallet_id) {
                valid = false;
              }
            });
          } else {
            valid = request?.body?.wallet_id != null;
          }

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
