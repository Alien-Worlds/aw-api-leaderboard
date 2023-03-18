import { Request, parseToBigInt } from '@alien-worlds/api-core';
import { UpdateLeaderboardStruct } from '../../data/leaderboard.dtos';
import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { getEndDateByTimeframe, getStartDateByTimeframe } from './query-model.utils';

export class LeaderboardEntry {
  public static fromStruct(struct: UpdateLeaderboardStruct): LeaderboardEntry {
    const {
      wallet_id,
      username,
      bounty,
      block_number,
      block_timestamp,
      points,
      land_id,
      planet_name,
      bag_items,
    } = struct;
    const now = block_timestamp ? new Date(block_timestamp) : new Date();
    const fromDayStart = getStartDateByTimeframe(now, MiningLeaderboardTimeframe.Daily);
    const toDayEnd = getEndDateByTimeframe(now, MiningLeaderboardTimeframe.Daily);
    const fromWeekStart = getStartDateByTimeframe(now, MiningLeaderboardTimeframe.Weekly);
    const toWeekEnd = getEndDateByTimeframe(now, MiningLeaderboardTimeframe.Weekly);
    const fromMonthStart = getStartDateByTimeframe(
      now,
      MiningLeaderboardTimeframe.Monthly
    );
    const toMonthEnd = getEndDateByTimeframe(now, MiningLeaderboardTimeframe.Monthly);

    return new LeaderboardEntry(
      fromDayStart,
      toDayEnd,
      fromWeekStart,
      toWeekEnd,
      fromMonthStart,
      toMonthEnd,
      wallet_id,
      username,
      bounty ? Number(bounty) : 0,
      parseToBigInt(block_number),
      new Date(block_timestamp),
      Number(points),
      land_id ? parseToBigInt(land_id) : null,
      planet_name,
      bag_items ? bag_items.map(item => parseToBigInt(item)) : []
    );
  }

  private constructor(
    public readonly fromDayStart: Date,
    public readonly toDayEnd: Date,
    public readonly fromWeekStart: Date,
    public readonly toWeekEnd: Date,
    public readonly fromMonthStart: Date,
    public readonly toMonthEnd: Date,
    public readonly walletId: string,
    public readonly username: string,
    public readonly bounty: number,
    public readonly blockNumber: bigint,
    public readonly blockTimestamp: Date,
    public readonly points: number,
    public readonly landId: bigint,
    public readonly planetName: string,
    public readonly bagItems: bigint[]
  ) {}
}

export class UpdateLeaderboardInput {
  public static create(items: UpdateLeaderboardStruct[]): UpdateLeaderboardInput {
    return new UpdateLeaderboardInput(items.map(LeaderboardEntry.fromStruct));
  }

  public static fromRequest(
    request: Request<UpdateLeaderboardStruct[]>
  ): UpdateLeaderboardInput {
    if (Array.isArray(request.body)) {
      return UpdateLeaderboardInput.create(request.body);
    }

    return new UpdateLeaderboardInput([LeaderboardEntry.fromStruct(request.body)]);
  }

  private constructor(public readonly items: LeaderboardEntry[]) {}
}
