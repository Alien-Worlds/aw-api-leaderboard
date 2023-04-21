import {
  LeaderboardDocument,
  LeaderboardStruct,
  MinigToolData,
} from '../../data/leaderboard.dtos';
import {
  MongoDB,
  parseToBigInt,
  removeUndefinedProperties,
} from '@alien-worlds/api-core';

import { AtomicAsset } from '@alien-worlds/alienworlds-api-common';
import { LeaderboardNumbers } from './../../data/leaderboard.dtos';
import { LeaderboardUpdate } from '../models/update-leaderboard.input';

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
      last_update_hash,
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
      unique_tools_used,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands,
      lands_mined_on,
      planets,
      planets_mined_on,
      rankings,
      ...rest
    } = document;

    const rankingsMap = new Map<string, number>();

    if (rankings) {
      const keys = Object.keys(rankings);
      for (const key of keys) {
        rankingsMap.set(key, rankings[key]);
      }
    }

    return new Leaderboard(
      new Date(start_timestamp),
      new Date(end_timestamp),
      wallet_id,
      username,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      tools_used ? tools_used.map(id => parseToBigInt(id)) : [],
      unique_tools_used,
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands ? lands.map(id => parseToBigInt(id)) : [],
      lands_mined_on,
      planets,
      planets_mined_on,
      last_update_timestamp ? new Date(last_update_timestamp) : new Date(),
      last_update_hash,
      rankingsMap,
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
      planets,
      lands,
      tools_used,
      unique_tools_used,
      last_update_timestamp,
      last_update_hash,
      rankings,
      ...rest
    } = struct;

    const rankingsMap = new Map<string, number>();

    if (rankings) {
      const keys = Object.keys(rankings);
      for (const key of keys) {
        rankingsMap.set(key, rankings[key]);
      }
    }

    return new Leaderboard(
      new Date(start_timestamp),
      new Date(end_timestamp),
      wallet_id,
      username,
      tlm_gains_total,
      tlm_gains_highest,
      total_nft_points,
      tools_used ? tools_used.map(tool => parseToBigInt(tool)) : [],
      unique_tools_used,
      total_charge_time,
      avg_charge_time,
      total_mining_power,
      avg_mining_power,
      total_nft_power,
      avg_nft_power,
      lands ? lands.map(land => parseToBigInt(land)) : [],
      lands_mined_on,
      planets,
      planets_mined_on,
      last_update_timestamp ? new Date(last_update_timestamp) : new Date(),
      last_update_hash,
      rankingsMap,
      '',
      rest
    );
  }

  public static cloneAndUpdate(
    leaderboard: Leaderboard,
    updates: LeaderboardUpdate,
    assets: AtomicAsset<MinigToolData>[]
  ): Leaderboard {
    const {
      startTimestamp,
      endTimestamp,
      walletId,
      tlmGainsTotal,
      tlmGainsHighest,
      totalNftPoints,
      toolsUsed,
      id,
      rest,
    } = leaderboard;
    const { landId, planetName } = updates;
    const points = updates.points || 0;
    const bounty = updates.bounty || 0;
    let totalChargeTime = leaderboard.totalChargeTime;
    let totalMiningPower = leaderboard.totalMiningPower;
    let totalNftPower = leaderboard.totalNftPower;

    assets.forEach(asset => {
      const {
        assetId,
        data: { ease, delay, difficulty },
      } = asset;

      if (toolsUsed.indexOf(assetId) === -1) {
        toolsUsed.push(assetId);
        totalChargeTime += delay;
        totalMiningPower += ease;
        totalNftPower += difficulty;
      }
    });

    const toolsCount = toolsUsed.length;
    const avgChargeTime = toolsCount
      ? totalChargeTime / toolsCount
      : leaderboard.avgChargeTime;
    const avgMiningPower = toolsCount
      ? totalMiningPower / toolsCount
      : leaderboard.avgMiningPower;
    const avgNftPower = toolsCount ? totalNftPower / toolsCount : leaderboard.avgNftPower;
    const username = leaderboard.username || updates.username;
    const lands = leaderboard.lands;
    let landsMinedOn = leaderboard.landsMinedOn;
    const planets = leaderboard.planets;
    let planetsMinedOn = leaderboard.planetsMinedOn;

    if (landId && lands.indexOf(landId) === -1) {
      lands.push(landId);
      landsMinedOn += 1;
    }

    if (planetName && planets?.indexOf(planetName) === -1) {
      planets.push(planetName);
      planetsMinedOn += 1;
    }

    return new Leaderboard(
      startTimestamp,
      endTimestamp,
      walletId,
      username,
      tlmGainsTotal + bounty,
      tlmGainsHighest < bounty ? bounty : tlmGainsHighest,
      totalNftPoints + points,
      toolsUsed,
      toolsCount,
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
      new Date(),
      updates.id,
      leaderboard.rankings,
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
    points: number,
    landId: bigint,
    planetName: string,
    assets: AtomicAsset<MinigToolData>[],
    rankings?: LeaderboardNumbers,
    lastUpdateHash?: string
  ): Leaderboard {
    const toolsUsed = [];
    let totalChargeTime = 0;
    let totalMiningPower = 0;
    let totalNftPower = 0;
    let avgChargeTime = 0;
    let avgMiningPower = 0;
    let avgNftPower = 0;

    assets.forEach(asset => {
      const {
        assetId,
        data: { ease, delay, difficulty },
      } = asset;
      toolsUsed.push(assetId);
      totalChargeTime += delay || 0;
      totalMiningPower += ease || 0;
      totalNftPower += difficulty || 0;
    });
    const toolsCount = toolsUsed.length;

    if (toolsCount > 0) {
      avgChargeTime = totalChargeTime / toolsCount;
      avgMiningPower = totalMiningPower / toolsCount;
      avgNftPower = totalNftPower / toolsCount;
    }

    const lands = landId ? [landId] : [];
    const planets = planetName ? [planetName] : [];
    const rankingsMap = new Map<string, number>();

    if (rankings) {
      const keys = Object.keys(rankings);
      for (const key of keys) {
        rankingsMap.set(key, rankings[key]);
      }
    }

    return new Leaderboard(
      fromDate,
      toDate,
      walletId,
      username,
      Number(bounty) || 0,
      Number(bounty) || 0,
      Number(points) || 0,
      toolsUsed,
      toolsCount,
      totalChargeTime,
      avgChargeTime,
      totalMiningPower,
      avgMiningPower,
      totalNftPower,
      avgNftPower,
      lands,
      lands.length,
      planets,
      planets.length,
      new Date(),
      lastUpdateHash,
      rankingsMap,
      '',
      {}
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
    public readonly uniqueToolsUsed: number,
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
    public readonly lastUpdateTimestamp: Date,
    public readonly lastUpdateHash: string,
    public readonly rankings: Map<string, number>,
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
      uniqueToolsUsed,
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
      lastUpdateHash,
      rankings,
    } = this;

    const document: LeaderboardDocument = {
      last_update_timestamp: lastUpdateTimestamp,
      last_update_hash: lastUpdateHash,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp,
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
      unique_tools_used: uniqueToolsUsed,
      tools_used: toolsUsed.map(id => MongoDB.Long.fromBigInt(id)),
      lands: lands.map(land => MongoDB.Long.fromBigInt(land)),
      planets,
    };

    if (rankings.size > 0) {
      document.rankings = {};
      rankings.forEach((value, key) => {
        document.rankings[key] = value;
      });
    }

    if (id && MongoDB.ObjectId.isValid(id)) {
      document._id = new MongoDB.ObjectId(id);
    }

    return removeUndefinedProperties<LeaderboardDocument>(document);
  }

  public toStruct(): LeaderboardStruct {
    const {
      lastUpdateTimestamp,
      lastUpdateHash,
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
      uniqueToolsUsed,
      rankings,
      planets,
      lands,
    } = this;

    const struct: LeaderboardStruct = {
      last_update_timestamp: lastUpdateTimestamp.toISOString(),
      last_update_hash: lastUpdateHash,
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
      unique_tools_used: uniqueToolsUsed,
      planets,
      lands: lands.map(land => land.toString()),
    };

    if (rankings.size > 0) {
      struct.rankings = {};
      rankings.forEach((value, key) => {
        struct.rankings[key] = value;
      });
    }

    return removeUndefinedProperties<LeaderboardStruct>(struct);
  }
}
