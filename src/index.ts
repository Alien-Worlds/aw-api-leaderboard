import { archiveDailyLeaderboard } from './cron/archive-daily-leaderboard';
import 'reflect-metadata';

import cron from 'cron';
import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints';
import { mountRoutes } from './routes';
import { buildConfig } from './config';
import { LeaderboardBroadcast } from './broadcast';
import {
  archiveMonthlyLeaderboard,
  archiveWeeklyLeaderboard,
  checkAndUpdateLeaderboard,
} from './cron';

export const start = async () => {
  const config = buildConfig();
  const {
    checkAndUpdateCronTime,
    dailyArchiveCronTime,
    weeklyArchiveCronTime,
    monthlyArchiveCronTime,
  } = config;
  const container = new Container();

  await setupDependencies(config, container);

  /*
   * API
   */
  const api = new LeaderboardApi(config);
  mountRoutes(api, container);
  api.start();

  /*
   * SOCKET CLIENT
   */
  const broadcast = new LeaderboardBroadcast(config, container);
  broadcast.start();

  /*
   * CRON JOBS
   */
  if (checkAndUpdateCronTime) {
    const leaderboardCronJob = new cron.CronJob(checkAndUpdateCronTime, () =>
      checkAndUpdateLeaderboard(container)
    );

    leaderboardCronJob.start();
  }

  if (dailyArchiveCronTime) {
    const dailyArchiveCronJob = new cron.CronJob(dailyArchiveCronTime, () =>
      archiveDailyLeaderboard(container)
    );

    dailyArchiveCronJob.start();
  }

  if (weeklyArchiveCronTime) {
    const weeklyArchiveCronJob = new cron.CronJob(weeklyArchiveCronTime, () =>
      archiveWeeklyLeaderboard(container)
    );

    weeklyArchiveCronJob.start();
  }

  if (monthlyArchiveCronTime) {
    const monthlyArchiveCronJob = new cron.CronJob(monthlyArchiveCronTime, () =>
      archiveMonthlyLeaderboard(container)
    );

    monthlyArchiveCronJob.start();
  }
};

start();
