import { PostRoute, Request, RouteHandler } from '@alien-worlds/aw-core';

import { LeaderboardApiConfig } from '../../../config';
import { LeaderboardUpdateJson } from '@alien-worlds/aw-api-common-leaderboard';
import { UpdateLeaderboardInput } from '../domain/models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from '../domain/models/update-leaderboard.output';
import { UpdateLeaderboardRouteIO } from './update-leaderboard.route-io';
import jwt from 'jsonwebtoken';

/*imports*/

/**
 * @class
 */
export class UpdateLeaderboardRoute extends PostRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new UpdateLeaderboardRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard`, handler, {
      authorization: request => {
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
      io: new UpdateLeaderboardRouteIO(),
    });
  }
}
