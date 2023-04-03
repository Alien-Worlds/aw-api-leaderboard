import { log, Result } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';
import { UserLeaderboardNotFoundError } from '../errors/user-leaderboard-not-found.error';
import { parseLeaderboardToResult } from './query-model.utils';

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

      if (error instanceof UserLeaderboardNotFoundError) {
        return {
          status: 200,
          body: {
            results: [],
            total: 0,
          },
        };
      }

      log(error);

      return {
        status: 500,
        body: null,
      };
    }

    const results = [parseLeaderboardToResult(result.content)];

    return {
      status: 200,
      body: {
        results,
        total: results.length,
      },
    };
  }
}
