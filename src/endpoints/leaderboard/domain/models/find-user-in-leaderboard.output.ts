import { log, Result } from '@alien-worlds/api-core';

import { Leaderboard } from '../entities/leaderboard';
import { UserLeaderboardNotFoundError } from '../errors/user-leaderboard-not-found.error';
import { parseLeaderboardToResult } from './model.utils';

export class FindUserInLeaderboardOutput {
  public static create(
    result: Result<Leaderboard>,
    sort: string
  ): FindUserInLeaderboardOutput {
    return new FindUserInLeaderboardOutput(result, sort);
  }

  private constructor(
    public readonly result: Result<Leaderboard>,
    private readonly sort: string
  ) {}

  public toResponse() {
    const { result, sort } = this;

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

    const results = [parseLeaderboardToResult(result.content, sort)];

    return {
      status: 200,
      body: {
        results,
        total: results.length,
      },
    };
  }
}
