import { log, Result } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';
import { parseLeaderboardToResult } from './model.utils';

export class ListLeaderboardOutput {
  public static create(
    listResult: Result<Leaderboard[]>,
    countResult: Result<number>,
    sort: string,
  ): ListLeaderboardOutput {
    return new ListLeaderboardOutput(listResult, countResult, sort);
  }

  private constructor(
    public readonly listResult: Result<Leaderboard[]>,
    public readonly countResult: Result<number>,
    public readonly sort: string
  ) {}

  public toResponse() {
    const {
      listResult: { content: list, failure: listFailure },
      countResult: { content: total, failure: countFailure },
      sort,
    } = this;
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
        results: list.map(leaderboard => parseLeaderboardToResult(leaderboard, sort)),
        total: total,
      },
    };
  }
}
