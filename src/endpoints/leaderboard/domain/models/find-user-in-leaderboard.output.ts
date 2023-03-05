import { Result } from '@alien-worlds/api-core';
import { LeaderboardStruct } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';

export class FindUserInLeaderboardOutput {
  public static create(result: Result<Leaderboard>): FindUserInLeaderboardOutput {
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        return {
          status: 500,
          body: null,
        };
      }
    }

    return {
      status: 200,
      body: result.content.toStruct(),
    };
  }

  private constructor(
    public readonly status: number,
    public readonly body: LeaderboardStruct
  ) {}
}
