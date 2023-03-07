import { Result } from '@alien-worlds/api-core';
import { LeaderboardStruct } from '../../data/leaderboard.dtos';
import { Leaderboard } from '../entities/leaderboard';

export class ListLeaderboardOutput {
  public static create(result: Result<Leaderboard[]>): ListLeaderboardOutput {
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        console.log(error);
        return {
          status: 500,
          body: [],
        };
      }
    }

    return {
      status: 200,
      body: result.content.map(leaderboard => leaderboard.toStruct()),
    };
  }

  private constructor(
    public readonly status: number,
    public readonly body: LeaderboardStruct[]
  ) {}
}
