import { log, Result } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';

export class ListLeaderboardOutput {
  public static create(
    listResult: Result<Leaderboard[]>,
    countResult: Result<number>
  ): ListLeaderboardOutput {
    return new ListLeaderboardOutput(listResult, countResult);
  }

  private constructor(
    public readonly listResult: Result<Leaderboard[]>,
    public readonly countResult: Result<number>
  ) {}

  public toResponse() {
    const {
      listResult: { content: list, failure: listFailure },
      countResult: { content: total, failure: countFailure },
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
        results: list.map(leaderboard => leaderboard.toStruct()),
        total: total,
      },
    };
  }
}
