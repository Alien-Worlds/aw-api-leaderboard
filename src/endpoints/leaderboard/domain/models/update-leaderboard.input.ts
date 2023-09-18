import { IO, Request } from '@alien-worlds/aw-core';
import { LeaderboardUpdate, LeaderboardUpdateJson } from '@alien-worlds/aw-api-common-leaderboard';

export class UpdateLeaderboardInput implements IO {
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

  private constructor(public readonly items: LeaderboardUpdate[]) { }
  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
}
