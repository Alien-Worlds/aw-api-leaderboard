import {
  LeaderboardUpdate,
  LeaderboardUpdateJson,
} from '@alien-worlds/leaderboard-api-common';
import { Request } from '@alien-worlds/api-core';

export class UpdateLeaderboardInput {
  public static create(items: LeaderboardUpdateJson[]): UpdateLeaderboardInput {
    return new UpdateLeaderboardInput(items.map(LeaderboardUpdate.fromJson));
  }

  public static fromRequest(
    request: Request<LeaderboardUpdateJson[]>
  ): UpdateLeaderboardInput {
    if (Array.isArray(request.body)) {
      return UpdateLeaderboardInput.create(request.body);
    }

    return new UpdateLeaderboardInput([LeaderboardUpdate.fromJson(request.body)]);
  }

  private constructor(public readonly items: LeaderboardUpdate[]) {}
}
