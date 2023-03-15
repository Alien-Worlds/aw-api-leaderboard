import {
  removeUndefinedProperties,
  MongoDB,
  parseToBigInt,
} from '@alien-worlds/api-core';
import e from 'express';
import { LeaderboardDocument, LeaderboardStruct } from '../../data/leaderboard.dtos';
import { UpdateLeaderboardInput, UsedTool } from '../models/update-leaderboard.input';

/**
 * @class
 */
export class Leaderboard {
  /**
   *
   * @static
   * @param {LeaderboardDocument} document
   * @param {number} position - calculated externally using offset
   * @returns {Leaderboard}
   */
  public static fromDocument(
    document: LeaderboardDocument,
    position?: number
  ): Leaderboard {
    const {
      _id,
      block_number,
      block_timesamp,
      last_update_timestamp,
      start_timestamp,
      end_timestamp,
      username,
      wallet_id,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      tools_used,
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands,
      lands_mined_on,
      planets,
      planets_mined_on,
      mine_rating,
      ...rest
    } = document;

    const now = new Date();

    return new Leaderboard(
      parseToBigInt(block_number),
      block_timesamp,
      start_timestamp ? new Date(start_timestamp) : now,
      end_timestamp ? new Date(end_timestamp) : now,
      wallet_id,
      username,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      tools_used.map(id => parseToBigInt(id)),
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands.map(id => parseToBigInt(id)),
      lands_mined_on,
      planets,
      planets_mined_on,
      mine_rating,
      position,
      last_update_timestamp ? new Date(last_update_timestamp) : now,
      _id instanceof MongoDB.ObjectId ? _id.toString() : '',
      rest
    );
  }

  public static fromStruct(struct: LeaderboardStruct): Leaderboard {
    const {
      block_number,
      block_timesamp,
      start_timestamp,
      end_timestamp,
      wallet_id,
      username,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands_mined_on,
      planets_mined_on,
      mine_rating,
      planets,
      lands,
      tools_used,
      last_update_timestamp,
      ...rest
    } = struct;

    const now = new Date();

    return new Leaderboard(
      parseToBigInt(block_number),
      new Date(block_timesamp),
      start_timestamp ? new Date(start_timestamp) : now,
      end_timestamp ? new Date(end_timestamp) : now,
      wallet_id,
      username,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      tools_used.map(tool => parseToBigInt(tool)),
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands.map(land => parseToBigInt(land)),
      lands_mined_on,
      planets,
      planets_mined_on,
      mine_rating,
      -1,
      last_update_timestamp ? new Date(last_update_timestamp) : now,
      '',
      rest
    );
  }

  public static cloneAndUpdate(
    leaderboard: Leaderboard,
    updates: UpdateLeaderboardInput
  ): Leaderboard {
    const {
      startTimestamp,
      endTimestamp,
      walletId,
      username,
      tlmGainsTotal,
      tlmGainsHighest,
      totalNftPoints,
      toolsUsed,
      id,
      rest,
    } = leaderboard;

    const { tools, bounty, points, landId, planetName } = updates;

    let totalChargeTime = leaderboard.totalChargeTime;
    let totalMiningPower = leaderboard.totalMiningPower;
    let totalNftPower = leaderboard.totalNftPower;

    tools.forEach(tool => {
      const { assetId, ease, delay, difficulty } = tool;

      if (toolsUsed.indexOf(assetId) === -1) {
        toolsUsed.push(assetId);
        totalChargeTime += delay;
        totalMiningPower += ease;
        totalNftPower += difficulty;
      }
    });

    const toolsCount = toolsUsed.length;
    const avgChargeTime = totalChargeTime / toolsCount;
    const avgMiningPower = totalMiningPower / toolsCount;
    const avgNftPower = totalNftPower / toolsCount;

    const lands = leaderboard.lands;
    let landsMinedOn = leaderboard.landsMinedOn;
    const planets = leaderboard.planets;
    let planetsMinedOn = leaderboard.planetsMinedOn;

    if (lands.indexOf(landId) === -1) {
      lands.push(landId);
      landsMinedOn += 1;
    }

    if (planets.indexOf(planetName) === -1) {
      planets.push(planetName);
      planetsMinedOn += 1;
    }

    return new Leaderboard(
      updates.blockNumber,
      updates.blockTimestamp,
      startTimestamp,
      endTimestamp,
      walletId,
      username,
      tlmGainsTotal + bounty,
      tlmGainsHighest < bounty ? bounty : tlmGainsHighest,
      totalNftPoints + points,
      toolsUsed,
      totalChargeTime,
      avgChargeTime,
      totalMiningPower,
      avgMiningPower,
      totalNftPower,
      avgNftPower,
      lands,
      landsMinedOn,
      planets,
      planetsMinedOn,
      0,
      -1,
      new Date(),
      id,
      rest
    );
  }

  public static create(
    fromDate: Date,
    toDate: Date,
    walletId: string,
    username: string,
    bounty: number,
    blockNumber: bigint,
    blockTimestamp: Date,
    points: number,
    landId: bigint,
    planetName: string,
    tools: UsedTool[]
  ): Leaderboard {
    const toolsUsed = [];
    let totalChargeTime = 0;
    let totalMiningPower = 0;
    let totalNftPower = 0;

    tools.forEach(tool => {
      const { assetId, ease, delay, difficulty } = tool;
      toolsUsed.push(assetId);
      totalChargeTime += delay;
      totalMiningPower += ease;
      totalNftPower += difficulty;
    });
    const toolsCount = toolsUsed.length;
    const avgChargeTime = totalChargeTime / toolsCount;
    const avgMiningPower = totalMiningPower / toolsCount;
    const avgNftPower = totalNftPower / toolsCount;

    return new Leaderboard(
      blockNumber,
      blockTimestamp,
      fromDate,
      toDate,
      walletId,
      username,
      Number(bounty),
      Number(bounty),
      Number(points),
      toolsUsed,
      totalChargeTime,
      avgChargeTime,
      totalMiningPower,
      avgMiningPower,
      totalNftPower,
      avgNftPower,
      [landId],
      1,
      [planetName],
      1,
      0,
      -1,
      new Date(),
      '',
      {}
    );
  }

  /**
   * @constructor
   */
  protected constructor(
    public readonly blockNumber: bigint,
    public readonly blockTimestamp: Date,
    public readonly startTimestamp: Date,
    public readonly endTimestamp: Date,
    public readonly walletId: string,
    public readonly username: string,
    public readonly tlmGainsTotal: number,
    public readonly tlmGainsHighest: number,
    public readonly totalNftPoints: number,
    public readonly toolsUsed: bigint[],
    public readonly totalChargeTime: number,
    public readonly avgChargeTime: number,
    public readonly totalMiningPower: number,
    public readonly avgMiningPower: number,
    public readonly totalNftPower: number,
    public readonly avgNftPower: number,
    public readonly lands: bigint[],
    public readonly landsMinedOn: number,
    public readonly planets: string[],
    public readonly planetsMinedOn: number,
    public readonly mineRating: number,
    public readonly position: number,
    public readonly lastUpdateTimestamp: Date,
    public readonly id: string,
    public readonly rest: object
  ) {}

  /**
   *
   * @returns {LeaderboardDocument}
   */
  public toDocument(): LeaderboardDocument {
    const {
      id,
      blockNumber,
      blockTimestamp,
      lastUpdateTimestamp,
      startTimestamp,
      endTimestamp,
      walletId,
      username,
      tlmGainsTotal,
      tlmGainsHighest,
      totalNftPoints,
      toolsUsed,
      totalChargeTime,
      avgChargeTime,
      totalMiningPower,
      avgMiningPower,
      totalNftPower,
      avgNftPower,
      lands,
      landsMinedOn,
      planets,
      planetsMinedOn,
      mineRating,
    } = this;

    const document: LeaderboardDocument = {
      block_number: MongoDB.Long.fromBigInt(blockNumber),
      block_timesamp: blockTimestamp,
      last_update_timestamp: lastUpdateTimestamp,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp,
      username,
      wallet_id: walletId,
      tlm_gains_total: tlmGainsTotal,
      tlm_gains_highest: tlmGainsHighest,
      total_nft_points: totalNftPoints,
      tools_used: toolsUsed.map(id => MongoDB.Long.fromBigInt(id)),
      total_charge_time: totalChargeTime,
      avg_charge_time: avgChargeTime,
      total_mining_power: totalMiningPower,
      avg_mining_power: avgMiningPower,
      total_nft_power: totalNftPower,
      avg_nft_power: avgNftPower,
      lands: lands.map(land => MongoDB.Long.fromBigInt(land)),
      lands_mined_on: landsMinedOn,
      planets,
      planets_mined_on: planetsMinedOn,
      mine_rating: mineRating,
    };

    /**
     * Do not add "position" to the document!
     * It shouldn't be stored in the leaderboard collection.
     * This value is dynamic and should be calculated only
     * in the aggregation pipeline.
     */

    if (id && MongoDB.ObjectId.isValid(id)) {
      document._id = new MongoDB.ObjectId(id);
    }

    return removeUndefinedProperties<LeaderboardDocument>(document);
  }

  public toStruct(): LeaderboardStruct {
    const {
      lastUpdateTimestamp,
      startTimestamp,
      endTimestamp,
      walletId,
      username,
      tlmGainsTotal,
      tlmGainsHighest,
      totalNftPoints,
      totalChargeTime,
      avgChargeTime,
      totalMiningPower,
      avgMiningPower,
      totalNftPower,
      avgNftPower,
      landsMinedOn,
      planetsMinedOn,
      mineRating,
      blockNumber,
      blockTimestamp,
      position,
    } = this;

    const struct: LeaderboardStruct = {
      block_number: blockNumber.toString(),
      block_timesamp: blockTimestamp.toISOString(),
      last_update_timestamp: lastUpdateTimestamp.toISOString(),
      start_timestamp: startTimestamp.toISOString(),
      end_timestamp: endTimestamp.toISOString(),
      username,
      wallet_id: walletId,
      tlm_gains_total: tlmGainsTotal,
      tlm_gains_highest: tlmGainsHighest,
      total_nft_points: totalNftPoints,
      total_charge_time: totalChargeTime,
      avg_charge_time: avgChargeTime,
      total_mining_power: totalMiningPower,
      avg_mining_power: avgMiningPower,
      total_nft_power: totalNftPower,
      avg_nft_power: avgNftPower,
      lands_mined_on: landsMinedOn,
      planets_mined_on: planetsMinedOn,
      mine_rating: mineRating,
      position: position,
    };

    return removeUndefinedProperties<LeaderboardStruct>(struct);
  }
}
