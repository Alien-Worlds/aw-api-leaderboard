import { Result } from '@alien-worlds/api-core';

export class PingOutput {

  private constructor(public readonly result: Result<string>) {}

  public static create(result: Result<string>): PingOutput {
    return new PingOutput(result);
  }

  public toResponse() {
    const { result } = this;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        return {
          status: 500,
          body: {
            status: 'FAIL',
            error: error.message,
          },
        };
      }
    }

    const { content } = result;

    return {
      status: 200,
      body: content,
    };
  }
}
