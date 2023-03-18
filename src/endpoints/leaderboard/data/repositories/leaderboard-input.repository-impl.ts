import { Result } from '@alien-worlds/api-core';
import { LeaderboardInputRepository } from '../../domain/repositories/leaderboard-input.repository';
import { LeaderboardEntry } from './../../domain/models/update-leaderboard.input';

export class LeaderboardInputRepositoryImpl implements LeaderboardInputRepository {
  private items: LeaderboardEntry[] = [];

  public async addMany(items: LeaderboardEntry[]): Promise<Result<void, Error>> {
    this.items.push(...items);
    return Result.withoutContent();
  }

  public async extractAll(): Promise<Result<LeaderboardEntry[], Error>> {
    const all = [...this.items];
    this.items = [];
    return Result.withContent(all);
  }

  public async count(): Promise<Result<number, Error>> {
    return Result.withContent(this.items.length);
  }
}
