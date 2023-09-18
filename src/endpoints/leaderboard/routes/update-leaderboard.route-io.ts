import { LeaderboardUpdate, LeaderboardUpdateJson } from '@alien-worlds/aw-api-common-leaderboard';
import { IO, log, Request, Response, RouteIO } from '@alien-worlds/aw-core';

import { UpdateLeaderboardInput } from '../domain/models/update-leaderboard.input';
import { UpdateLeaderboardOutput } from '../domain/models/update-leaderboard.output';

/**
 * @class
 */
export class UpdateLeaderboardRouteIO implements RouteIO {
  toResponse(output: UpdateLeaderboardOutput): Response {
    const { result } = output;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      log(error);
      return {
        status: 500,
        body: false,
      };
    }

    return {
      status: 200,
      body: true,
    };
  }


  public fromRequest(
    request: Request<LeaderboardUpdateJson | LeaderboardUpdateJson[]>
  ): IO<unknown> {
    if (Array.isArray(request.body)) {
      return UpdateLeaderboardInput.create(request.body);
    }

    return UpdateLeaderboardInput.create([request.body]);
  }
}
