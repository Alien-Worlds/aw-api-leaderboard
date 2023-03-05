import { Request, parseToBigInt } from '@alien-worlds/api-core';
import { UpdateLeaderboardRequest } from '../../data/leaderboard.dtos';

export class UpdateLeaderboardInput {
  public static fromRequest(
    request: Request<UpdateLeaderboardRequest>
  ): UpdateLeaderboardInput {
    const {
      body: {
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
      },
    } = request;

    return new UpdateLeaderboardInput(
      new Date(start_timestamp),
      new Date(end_timestamp),
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
      lands.map(land => parseToBigInt(land)),
      tools_used.map(tool => parseToBigInt(tool))
    );
  }

  private constructor(
    public readonly startTimestamp: Date,
    public readonly endTimestamp: Date,
    public readonly walletId: string,
    public readonly username: string,
    public readonly tlmGainsTotal: number,
    public readonly tlmGainsHighest: number,
    public readonly totalNftPoints: number,
    public readonly totalChargeTime: number,
    public readonly avgChargeTime: number,
    public readonly totalMiningPower: number,
    public readonly avgMiningPower: number,
    public readonly totalNftPower: number,
    public readonly avgNftPower: number,
    public readonly landsMinedOn: number,
    public readonly planetsMinedOn: number,
    public readonly mineRating: number,
    public readonly planets: string[],
    public readonly lands: bigint[],
    public readonly toolsUsed: bigint[]
  ) {}
}
