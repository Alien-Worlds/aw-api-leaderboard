import { log, Result } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';
import { UserLeaderboardNotFoundError } from './../errors/user-leaderboard-not-found.error';

export class FindUserInLeaderboardOutput {
  public static create(result: Result<Leaderboard>): FindUserInLeaderboardOutput {
    return new FindUserInLeaderboardOutput(result);
  }

  private constructor(public readonly result: Result<Leaderboard>) { }

  public toResponse() {
    const { result } = this;

    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      log(error);

      return {
        status: error instanceof UserLeaderboardNotFoundError ? 204 : 500,
        body: null,
      };
    }

    const results = [result.content.toStruct()];

    return {
      status: 200,
      body: {
        results,
        total: results.length,
      },
    };
  }
}
