import {
  Abi,
  LeaderboardUpdateMessage,
  LeaderboardUpdateStruct,
} from '@alien-worlds/alienworlds-api-common';
import { BroadcastMessage, Request, parseToBigInt } from '@alien-worlds/api-core';
import { floatToPreciseInt, getEndDateByTimeframe, getStartDateByTimeframe } from './model.utils';

import { MiningLeaderboardTimeframe } from '../mining-leaderboard.enums';
import { nanoid } from 'nanoid';

export class LeaderboardUpdate {
  public static fromStruct(struct: LeaderboardUpdateStruct): LeaderboardUpdate {
    const {
      wallet_id,
      username,
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

    let bounty = struct.bounty;

    // check if is abi asset string
    if (typeof bounty === 'string' && /^[0-9.]+\s[a-zA-Z]+$/.test(bounty)) {
      const asset = Abi.Asset.fromStruct(bounty);
      bounty = asset.value;
    }

    return new LeaderboardUpdate(
      fromDayStart,
      toDayEnd,
      fromWeekStart,
      toWeekEnd,
      fromMonthStart,
      toMonthEnd,
      wallet_id,
      username,
      bounty ? floatToPreciseInt(bounty) : 0,
      points ? floatToPreciseInt(points) : 0,
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
    public readonly points: number,
    public readonly landId: bigint,
    public readonly planetName: string,
    public readonly bagItems: bigint[],
    public readonly id = nanoid()
  ) { }
}

export class UpdateLeaderboardInput {
  public static create(items: LeaderboardUpdateStruct[]): UpdateLeaderboardInput {
    return new UpdateLeaderboardInput(items.map(LeaderboardUpdate.fromStruct));
  }

  public static fromMessage(
    message: BroadcastMessage<LeaderboardUpdateMessage>
  ): UpdateLeaderboardInput {
    const {
      content: {
        data: { block_number, block_timestamp, addpoints, logmine, settag },
      },
    } = message;

    let data: LeaderboardUpdateStruct;

    if (addpoints) {
      data = {
        wallet_id: addpoints.user,
        points: addpoints.points,
        block_number,
        block_timestamp,
      };
    } else if (logmine) {
      const { miner, ...rest } = logmine;
      data = {
        wallet_id: miner,
        block_number,
        block_timestamp,
        ...rest,
      };
    } else if (settag) {
      data = {
        wallet_id: settag.account,
        username: settag.tag,
        block_number,
        block_timestamp,
      };
    }

    return new UpdateLeaderboardInput([LeaderboardUpdate.fromStruct(data)]);
  }

  public static fromRequest(
    request: Request<LeaderboardUpdateStruct[]>
  ): UpdateLeaderboardInput {
    if (Array.isArray(request.body)) {
      return UpdateLeaderboardInput.create(request.body);
    }

    return new UpdateLeaderboardInput([LeaderboardUpdate.fromStruct(request.body)]);
  }

  private constructor(public readonly items: LeaderboardUpdate[]) { }
}
