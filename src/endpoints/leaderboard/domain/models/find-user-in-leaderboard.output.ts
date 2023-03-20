import { log, Result } from '@alien-worlds/api-core';
import { Leaderboard } from '../entities/leaderboard';

export class FindUserInLeaderboardOutput {
  public static create(result: Result<Leaderboard>): FindUserInLeaderboardOutput {
    return new FindUserInLeaderboardOutput(result);
  }

  private constructor(public readonly result: Result<Leaderboard>) {}

  public toResponse() {
    const { result } = this;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      log(error);
      return {
        status: 500,
        body: null,
      };
    }

    return {
      status: 200,
      body: result.content.toStruct(),
    };
  }
}
