import { Container, log } from '@alien-worlds/api-core';
import {
  ArchiveLeaderboardUseCase,
  LeaderboardTimeframe,
} from '@alien-worlds/alienworlds-api-common';

let archiveMonthlyLeaderboardBusy = false;

export const archiveMonthlyLeaderboard = async (container: Container) => {
  if (archiveMonthlyLeaderboardBusy) {
    log(`[archive-monthly-leaderboard] cron job is already running...`);
    return;
  }
  archiveMonthlyLeaderboardBusy = true;

  log(`[archive-monthly-leaderboard] cron job launched...`);

  const result = await container
    .get<ArchiveLeaderboardUseCase>(ArchiveLeaderboardUseCase.Token)
    .execute(LeaderboardTimeframe.Monthly);

  if (result.isFailure) {
    log(
      `[archive-monthly-leaderboard] cron job completed with failure.`,
      result.failure.error.message
    );
  } else {
    log(`[archive-monthly-leaderboard] cron job completed successfully`);
  }

  archiveMonthlyLeaderboardBusy = false;
};
