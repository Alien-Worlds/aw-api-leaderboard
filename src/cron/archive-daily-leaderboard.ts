import { Container } from '@alien-worlds/api-core';
import { MiningLeaderboardTimeframe } from '../endpoints/leaderboard/domain/mining-leaderboard.enums';
import { ArchiveLeaderboardUseCase } from '../endpoints/leaderboard/domain/use-cases/archive-leaderboard.use-case';

export const archiveDailyLeaderboard = async (container: Container) => {
  container
    .get<ArchiveLeaderboardUseCase>(ArchiveLeaderboardUseCase.Token)
    .execute(MiningLeaderboardTimeframe.Daily);
};
