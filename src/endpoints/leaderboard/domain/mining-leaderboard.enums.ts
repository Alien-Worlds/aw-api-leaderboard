export enum MiningLeaderboardTimeframe {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Season = 'season',
}

export enum MiningLeaderboardSort {
  TlmGainsTotal = 'tlm_gains_total',
  TotalNftPoints = 'total_nft_points',
  AvgChargeTime = 'avg_charge_time',
  AvgMiningPower = 'avg_mining_power',
  AvgNftPower = 'avg_nft_power',
  LandsMinedOn = 'lands_mined_on',
  PlanetsMinedOn = 'planets_mined_on',
  UniqueToolsUsed = 'unique_tools_used',
}

export enum MiningLeaderboardOrder {
  Asc = 1,
  Desc = -1,
}
