import jwt from 'jsonwebtoken';
import { LeaderboardUpdateJson } from '@alien-worlds/alienworlds-api-common';
import { PostRoute, RouteHandler, Request } from '@alien-worlds/api-core';
import { UpdateLeaderboardInput } from '../domain/models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from '../domain/models/update-leaderboard.output';
import { buildConfig } from '../../../config';

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
      authorization: request => {
        const config = buildConfig();

        if (!config.secretKey) {
          return true;
        }

        if (config.secretKey && !request.headers['authorization']) {
          return false;
        }

        const token = request.headers['authorization'].split(' ')[1];
        const decodedToken = jwt.verify(token, config.secretKey, {
          maxAge: config.expirationTime,
        });

        return !!decodedToken;
      },
      validators: {
        request: (request: Request<LeaderboardUpdateJson | LeaderboardUpdateJson[]>) => {
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
        post: (output: UpdateLeaderboardOutput) => output.toResponse(),
      },
    });
  }
}
