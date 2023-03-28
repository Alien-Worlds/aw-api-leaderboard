import { log, RedisSource, SortedCollectionRedisSource } from '@alien-worlds/api-core';
import { MiningLeaderboardSort } from '../../domain/mining-leaderboard.enums';
import { LeaderboardBaseDocument, LeaderboardDocument } from '../leaderboard.dtos';

/**
 * @class
 */
export class LeaderboardRedisSource {
  private collections = new Map<string, SortedCollectionRedisSource>();

  /**
   * @constructor
   * @param {RedisSource} redisSource
   */
  constructor(redisSource: RedisSource, private prefix: string) {
    this.collections.set(
      MiningLeaderboardSort.TlmGainsTotal,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_tlm_gains_total`)
    );
    this.collections.set(
      MiningLeaderboardSort.TotalNftPoints,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_total_nft_points`)
    );
    this.collections.set(
      MiningLeaderboardSort.UniqueToolsUsed,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_unique_tools_used`)
    );
    this.collections.set(
      MiningLeaderboardSort.AvgChargeTime,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_avg_charge_time`)
    );
    this.collections.set(
      MiningLeaderboardSort.AvgMiningPower,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_avg_mining_power`)
    );
    this.collections.set(
      MiningLeaderboardSort.AvgNftPower,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_avg_nft_power`)
    );
    this.collections.set(
      MiningLeaderboardSort.LandsMinedOn,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_lands_mined_on`)
    );
    this.collections.set(
      MiningLeaderboardSort.PlanetsMinedOn,
      new SortedCollectionRedisSource(redisSource, `${prefix}_daily_planets_mined_on`)
    );
  }

  public async update(leaderboards: LeaderboardDocument[]) {
    const tlmGainsTotal = [];
    const totalNftPoints = [];
    const uniqueToolsUsed = [];
    const avgChargeTime = [];
    const avgMiningPower = [];
    const avgNftPower = [];
    const landsMinedOn = [];
    const planetsMinedOn = [];

    for (const leaderboard of leaderboards) {
      const {
        wallet_id,
        tlm_gains_total,
        total_nft_points,
        unique_tools_used,
        avg_charge_time,
        avg_mining_power,
        avg_nft_power,
        lands_mined_on,
        planets_mined_on,
      } = leaderboard;
      tlmGainsTotal.push({ score: tlm_gains_total, value: wallet_id });
      totalNftPoints.push({ score: total_nft_points, value: wallet_id });
      uniqueToolsUsed.push({ score: unique_tools_used, value: wallet_id });
      avgChargeTime.push({ score: avg_charge_time, value: wallet_id });
      avgMiningPower.push({ score: avg_mining_power, value: wallet_id });
      avgNftPower.push({ score: avg_nft_power, value: wallet_id });
      landsMinedOn.push({ score: lands_mined_on, value: wallet_id });
      planetsMinedOn.push({ score: planets_mined_on, value: wallet_id });
    }

    this.collections.get(MiningLeaderboardSort.TlmGainsTotal).addMany(tlmGainsTotal);
    this.collections.get(MiningLeaderboardSort.TotalNftPoints).addMany(totalNftPoints);
    this.collections.get(MiningLeaderboardSort.UniqueToolsUsed).addMany(uniqueToolsUsed);
    this.collections.get(MiningLeaderboardSort.AvgChargeTime).addMany(avgChargeTime);
    this.collections.get(MiningLeaderboardSort.AvgMiningPower).addMany(avgMiningPower);
    this.collections.get(MiningLeaderboardSort.AvgNftPower).addMany(avgNftPower);
    this.collections.get(MiningLeaderboardSort.LandsMinedOn).addMany(landsMinedOn);
    this.collections.get(MiningLeaderboardSort.PlanetsMinedOn).addMany(planetsMinedOn);
  }

  public async getRank(walletId: string, key: MiningLeaderboardSort) {
    if (this.collections.has(key)) {
      return this.collections.get(key).getRank(walletId);
    }

    log(`Unknown key: ${key}`);
    return -1;
  }

  public async getScore(
    walletId: string,
    keys?: string[]
  ): Promise<LeaderboardBaseDocument> {
    const props = Array.isArray(keys) ? keys : Object.values(MiningLeaderboardSort);
    const result = {};
    for (const prop of props) {
      const value = await this.collections.get(prop).getScore(walletId);
      if (value) {
        result[prop] = value;
      }
    }

    return result;
  }

  public async clear(): Promise<boolean> {
    const props = Object.values(MiningLeaderboardSort);
    let success = true;

    for (const prop of props) {
      const result = await this.collections.get(prop).clear();
      if (result === false) {
        log(`The collection of ${prop} has not been cleared.`);
        success = false;
      }
    }

    return success;
  }
}
