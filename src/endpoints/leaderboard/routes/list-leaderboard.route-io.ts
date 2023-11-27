import { IO, Request, Response, RouteIO, log } from '@alien-worlds/aw-core';

import { ListLeaderboardInput } from '../domain/models/list-leaderboard.input';
import { ListLeaderboardOutput } from '../domain/models/list-leaderboard.output';
import { ListLeaderboardRequestQueryParams } from '../data/leaderboard.dtos';
import { parseLeaderboardToResult } from '../domain/leaderboard.utils';

/**
 * @class
 */
export class ListLeaderboardRouteIO implements RouteIO {
  toResponse(output: ListLeaderboardOutput): Response {
    const {
      listResult: { content: list, failure: listFailure },
      countResult: { content: total, failure: countFailure },
      sort,
      order,
      tlmDecimalPrecision,
    } = output;
    if (listFailure || countFailure) {
      const { error } = listFailure || countFailure;

      log(error);
      return {
        status: 500,
        body: null,
      };
    }

    return {
      status: 200,
      body: {
        results: list
          .map(leaderboard =>
            parseLeaderboardToResult(leaderboard, sort, tlmDecimalPrecision)
          )
          .sort((a, b) => (a.position < b.position ? order : -order)),
        total: total,
      },
    };
  }

  public fromRequest(
    request: Request<
      unknown,
      unknown,
      ListLeaderboardRequestQueryParams
    >
  ): IO<unknown> {
    return ListLeaderboardInput.create(request);
  }
}
