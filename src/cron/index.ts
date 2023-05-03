import 'reflect-metadata';

import cron from 'cron';
import { Container, log } from '@alien-worlds/api-core';
import { buildConfig } from '../config';
import { setupDependencies } from '../endpoints';
import { archiveDailyLeaderboard } from './archive-daily-leaderboard';
import { archiveWeeklyLeaderboard } from './archive-weekly-leaderboard';
import { archiveMonthlyLeaderboard } from './archive-monthly-leaderboard';

export const start = async () => {
  log(`Leaderboard API Cron jobs:`);
  const config = buildConfig();
  const { dailyArchiveCronTime, weeklyArchiveCronTime, monthlyArchiveCronTime } = config;
  const container = new Container();

  await setupDependencies(config, container);

  /*
   * CRON JOBS
   */

  if (dailyArchiveCronTime) {
    const dailyArchiveCronJob = new cron.CronJob(dailyArchiveCronTime, () =>
      archiveDailyLeaderboard(container)
    );

    dailyArchiveCronJob.start();
    log(`[archive-daily-leaderboard] cron job added.`);
  }

  if (weeklyArchiveCronTime) {
    const weeklyArchiveCronJob = new cron.CronJob(weeklyArchiveCronTime, () =>
      archiveWeeklyLeaderboard(container)
    );

    weeklyArchiveCronJob.start();
    log(`[archive-weekly-leaderboard] cron job added.`);
  }

  if (monthlyArchiveCronTime) {
    const monthlyArchiveCronJob = new cron.CronJob(monthlyArchiveCronTime, () =>
      archiveMonthlyLeaderboard(container)
    );

    monthlyArchiveCronJob.start();
    log(`[archive-monthly-leaderboard] cron job added.`);
  }
};

start();
