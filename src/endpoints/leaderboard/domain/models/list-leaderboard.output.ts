import { log, Result } from '@alien-worlds/api-core';
import { parseLeaderboardToResult } from '../leaderboard.utils';
import { Leaderboard } from '@alien-worlds/alienworlds-api-common';

export class ListLeaderboardOutput {
  public static create(
    listResult: Result<Leaderboard[]>,
    countResult: Result<number>,
    sort: string,
    order: number,
    tlmDecimalPrecision: number
  ): ListLeaderboardOutput {
    return new ListLeaderboardOutput(
      listResult,
      countResult,
      sort,
      order,
      tlmDecimalPrecision
    );
  }

  private constructor(
    public readonly listResult: Result<Leaderboard[]>,
    public readonly countResult: Result<number>,
    public readonly sort: string,
    public readonly order: number,
    public readonly tlmDecimalPrecision: number
  ) {}

  public toResponse() {
    const {
      listResult: { content: list, failure: listFailure },
      countResult: { content: total, failure: countFailure },
      sort,
      order,
      tlmDecimalPrecision,
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
        results: list
          .map(leaderboard =>
            parseLeaderboardToResult(leaderboard, sort, tlmDecimalPrecision)
          )
          .sort((a, b) => (a.position < b.position ? order : -order)),
        total: total,
      },
    };
  }
}
