import { GetRoute, RouteHandler } from '@alien-worlds/api-core';
import { PingOutput } from '../domain/models/ping.output';
import { LeaderboardApiConfig } from '../../../config';

export class GetPingRoute extends GetRoute {
  public static create(handler: RouteHandler, config: LeaderboardApiConfig) {
    return new GetPingRoute(handler, config);
  }

  private constructor(handler: RouteHandler, config: LeaderboardApiConfig) {
    super(`/${config.versions.leaderboardUrlVersion}/leaderboard/ping`, handler, {
      hooks: {
        post: (output: PingOutput) => output.toResponse(),
      },
    });
  }
}
