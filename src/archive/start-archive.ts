/* eslint-disable @typescript-eslint/no-unused-vars */
import cron from 'cron';
import { log } from '@alien-worlds/api-core';
import { LeaderboardTimeframe } from '@alien-worlds/leaderboard-api-common';
import { archiveLeaderboard } from './archive-leaderboard';
import { LeaderboardApiConfig } from '../config';

let inMaintenanceMode = false;

export const startArchive = async (config: LeaderboardApiConfig) => {
  log(`Leaderboard archive ... [starting]`);
  const { dailyArchiveCronTime, weeklyArchiveCronTime, monthlyArchiveCronTime } = config;

  if (dailyArchiveCronTime) {
    const dailyArchiveCronJob = new cron.CronJob(dailyArchiveCronTime, async () => {
      inMaintenanceMode = true;
      await archiveLeaderboard(config, LeaderboardTimeframe.Daily, () => {
        inMaintenanceMode = false;
      });
    });

    dailyArchiveCronJob.start();
    log(`[archive-daily-leaderboard] cron job added.`);
  }

  if (weeklyArchiveCronTime) {
    const weeklyArchiveCronJob = new cron.CronJob(weeklyArchiveCronTime, async () => {
      inMaintenanceMode = true;
      await archiveLeaderboard(config, LeaderboardTimeframe.Weekly, () => {
        inMaintenanceMode = false;
      });
    });

    weeklyArchiveCronJob.start();
    log(`[archive-weekly-leaderboard] cron job added.`);
  }

  if (monthlyArchiveCronTime) {
    const monthlyArchiveCronJob = new cron.CronJob(monthlyArchiveCronTime, async () => {
      inMaintenanceMode = true;
      await archiveLeaderboard(config, LeaderboardTimeframe.Monthly, () => {
        inMaintenanceMode = false;
      });
    });

    monthlyArchiveCronJob.start();
    log(`[archive-monthly-leaderboard] cron job added.`);
  }

  log(`Leaderboard archive ... [ready]`);
};
