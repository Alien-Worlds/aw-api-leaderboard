import { Result } from '@alien-worlds/aw-core';

export class PingOutput {

  private constructor(public readonly result: Result<string>) { }

  public static create(result: Result<string>): PingOutput {
    return new PingOutput(result);
  }
}
