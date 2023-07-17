import { Result, injectable } from '@alien-worlds/api-core';
import { PingOutput } from './models/ping.output';

@injectable()
export class PingController {
  public static Token = 'PING_CONTROLLER';

  public async ping(): Promise<PingOutput> {
    return PingOutput.create(Result.withContent('pong'));
  }
}
