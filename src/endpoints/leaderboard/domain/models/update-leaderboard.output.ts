import { Result } from '@alien-worlds/api-core';

export class UpdateLeaderboardOutput {
  public static create(result: Result<void>): UpdateLeaderboardOutput {
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        return {
          status: 500,
          body: false,
        };
      }
    }

    return {
      status: 200,
      body: true,
    };
  }

  private constructor(public readonly status: number, public readonly body: boolean) {}
}
