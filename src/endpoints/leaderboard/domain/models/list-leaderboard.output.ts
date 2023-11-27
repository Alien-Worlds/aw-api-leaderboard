import { Leaderboard } from '@alien-worlds/aw-api-common-leaderboard';
import { IO, Result } from '@alien-worlds/aw-core';

export class ListLeaderboardOutput implements IO {
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
  ) { }

  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
}
