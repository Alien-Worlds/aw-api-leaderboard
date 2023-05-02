import { Container } from '@alien-worlds/api-core';
import { ArchiveLeaderboardUseCase, LeaderboardTimeframe } from '@alien-worlds/alienworlds-api-common';

export const archiveWeeklyLeaderboard = async (container: Container) => {
  container
    .get<ArchiveLeaderboardUseCase>(ArchiveLeaderboardUseCase.Token)
    .execute(LeaderboardTimeframe.Weekly);
};
