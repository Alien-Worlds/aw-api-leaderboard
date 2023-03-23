import { Result } from '@alien-worlds/api-core';
import { LeaderboardUpdateBackupRepository } from '../../domain/repositories/leaderboard-update-backup.repository';
import { LeaderboardUpdate } from '../../domain/models/update-leaderboard.input';

export class LeaderboardUpdateBackupRepositoryImpl
  implements LeaderboardUpdateBackupRepository
{
  private items: LeaderboardUpdate[] = [];

  public async addMany(items: LeaderboardUpdate[]): Promise<Result<void, Error>> {
    this.items.push(...items);
    return Result.withoutContent();
  }

  public async extractAll(): Promise<Result<LeaderboardUpdate[], Error>> {
    const all = [...this.items];
    this.items = [];
    return Result.withContent(all);
  }

  public async count(): Promise<Result<number, Error>> {
    return Result.withContent(this.items.length);
  }
}
