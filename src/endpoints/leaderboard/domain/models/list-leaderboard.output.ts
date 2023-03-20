import { Result } from '@alien-worlds/api-core';
import {
  LeaderboardStruct,
  ListLeaderboardControllerOutput,
} from '../../data/leaderboard.dtos';

export class ListLeaderboardOutput {
  public static create(
    result: Result<ListLeaderboardControllerOutput>
  ): ListLeaderboardOutput {
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        console.log(error);
        return {
          status: 500,
          body: null,
        };
      }
    }

    const output = {
      results: result.content.results.map(leaderboard => leaderboard.toStruct()),
      total: result.content.total,
    };

    return {
      status: 200,
      body: output,
    };
  }

  private constructor(
    public readonly status: number,
    public readonly body: { results: LeaderboardStruct[]; total: number }
  ) {}
}
