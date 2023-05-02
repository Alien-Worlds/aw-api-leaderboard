import { log, Result } from '@alien-worlds/api-core';

import { parseLeaderboardToResult } from '../leaderboard.utils';
import { Leaderboard } from '@alien-worlds/alienworlds-api-common';
import { UserLeaderboardNotFoundError } from '../errors/user-leaderboard-not-found.error';

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
