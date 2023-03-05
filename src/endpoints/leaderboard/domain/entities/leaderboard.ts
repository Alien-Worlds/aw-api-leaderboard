import {
  removeUndefinedProperties,
  MongoDB,
  parseToBigInt,
} from '@alien-worlds/api-core';
import { LeaderboardDocument, LeaderboardStruct } from '../../data/leaderboard.dtos';

/**
 * @class
 */
export class Leaderboard {
  /**
   *
   * @static
   * @param {LeaderboardDocument} document
   * @returns {Leaderboard}
   */
  public static fromDocument(document: LeaderboardDocument): Leaderboard {
    const {
      _id,
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
      position,
      ...rest
    } = document;

    return new Leaderboard(
      new Date(start_timestamp),
      new Date(end_timestamp),
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
      new Date(last_update_timestamp),
      _id instanceof MongoDB.ObjectId ? _id.toString() : '',
      rest
    );
  }

  public static fromStruct(struct: LeaderboardStruct): Leaderboard {
    const {
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
    return new Leaderboard(
      new Date(start_timestamp),
      new Date(end_timestamp),
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
      new Date(last_update_timestamp),
      '',
      rest
    );
  }

  /**
   * @constructor
   */
  protected constructor(
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
     * It shouldn't be stored in the leaderboard colelction.
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
    } = this;

    const struct: LeaderboardStruct = {
      last_update_timestamp: lastUpdateTimestamp.toUTCString(),
      start_timestamp: startTimestamp.toUTCString(),
      end_timestamp: endTimestamp.toUTCString(),
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
    };

    return removeUndefinedProperties<LeaderboardStruct>(struct);
  }
}
