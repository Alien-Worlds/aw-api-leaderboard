import { LeaderboardDocument, PatchLeaderboardControllerInput } from '../../data/leaderboard.dtos';

import { Request } from '@alien-worlds/api-core';

export class PatchLeaderboardInput {
  public static fromRequest(
    request: Request<Partial<LeaderboardDocument>>
  ): PatchLeaderboardControllerInput {
    return request.body;
  }
}
