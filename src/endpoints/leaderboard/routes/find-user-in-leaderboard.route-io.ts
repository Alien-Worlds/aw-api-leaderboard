import { IO, Request, Response, RouteIO, log } from '@alien-worlds/aw-core';

import { FindUserInLeaderboardInput } from '../domain/models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardOutput } from '../domain/models/find-user-in-leaderboard.output';
import { FindUserInLeaderboardRequest } from '../data/leaderboard.dtos';
import { UserLeaderboardNotFoundError } from '../domain/errors/user-leaderboard-not-found.error';
import { parseLeaderboardToResult } from '../domain/leaderboard.utils';

/*imports*/

/**
 * @class
 */
export class FindUserInLeaderboardRouteIO implements RouteIO {
  toResponse(output: FindUserInLeaderboardOutput): Response {
    const { result, sort, tlmDecimalPrecision } = output;

    if (result.isFailure) {
      const {
        failure: { error },
      } = result;

      if (error instanceof UserLeaderboardNotFoundError) {
        return {
          status: 200,
          body: {
            results: [],
            total: 0,
          },
        };
      }

      log(error);

      return {
        status: 500,
        body: null,
      };
    }

    const results = [parseLeaderboardToResult(result.content, sort, tlmDecimalPrecision)];

    return {
      status: 200,
      body: {
        results,
        total: results.length,
      },
    };
  }

  public fromRequest(
    request: Request<
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest,
      FindUserInLeaderboardRequest
    >
  ): IO<unknown> {
    return FindUserInLeaderboardInput.create(
      request
    );
  }
}
