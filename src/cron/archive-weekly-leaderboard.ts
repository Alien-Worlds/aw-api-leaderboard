import { Container, log } from '@alien-worlds/api-core';
import {
  ArchiveLeaderboardUseCase,
  LeaderboardTimeframe,
} from '@alien-worlds/alienworlds-api-common';

let archiveWeeklyLeaderboardBusy = false;

export const archiveWeeklyLeaderboard = async (container: Container) => {
  if (archiveWeeklyLeaderboardBusy) {
    log(`[archive-weekly-leaderboard] cron job is already running...`);
    return;
  }
  archiveWeeklyLeaderboardBusy = true;

  log(`[archive-weekly-leaderboard] cron job launched...`);

  const result = await container
    .get<ArchiveLeaderboardUseCase>(ArchiveLeaderboardUseCase.Token)
    .execute(LeaderboardTimeframe.Weekly);

  if (result.isFailure) {
    log(
      `[archive-weekly-leaderboard] cron job completed with failure.`,
      result.failure.error.message
    );
  } else {
    log(`[archive-weekly-leaderboard] cron job completed successfully`);
  }

  archiveWeeklyLeaderboardBusy = false;
};
