import { Result } from '@alien-worlds/api-core';

export class PatchLeaderboardOutput {
  public static create(result: Result<void>): PatchLeaderboardOutput {
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        console.log(error);
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

  private constructor(public readonly status: number, public readonly body: boolean) { }
}
