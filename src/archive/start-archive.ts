import { LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';
import { log } from '@alien-worlds/aw-core';
/* eslint-disable @typescript-eslint/no-unused-vars */
import cron from 'cron';

import { LeaderboardApiConfig } from '../config';
import { archiveLeaderboard } from './archive-leaderboard';

let inMaintenanceMode = false;

export const startArchive = async (config: LeaderboardApiConfig) => {
  log(`Leaderboard archive ... [starting]`);
  const { dailyArchiveCronTime, weeklyArchiveCronTime, monthlyArchiveCronTime } = config;

  if (dailyArchiveCronTime) {
    const dailyArchiveCronJob = new cron.CronJob(dailyArchiveCronTime, async () => {
      inMaintenanceMode = true;

      const resultDaily = await archiveLeaderboard(
        config,
        LeaderboardTimeframe.Daily,
        () => {
          inMaintenanceMode = false;
        }
      );

      if (resultDaily.isFailure) {
        log(
          `An error occured during daily leaderboard archival. `,
          resultDaily.failure.error
        );
      }
    });

    dailyArchiveCronJob.start();
    log(`[archive-daily-leaderboard] cron job added.`);
  }

  if (weeklyArchiveCronTime) {
    const weeklyArchiveCronJob = new cron.CronJob(weeklyArchiveCronTime, async () => {
      inMaintenanceMode = true;
      const resultWeekly = await archiveLeaderboard(
        config,
        LeaderboardTimeframe.Weekly,
        () => {
          inMaintenanceMode = false;
        }
      );

      if (resultWeekly.isFailure) {
        log(
          `An error occured during weekly leaderboard archival. `,
          resultWeekly.failure.error
        );
      }
    });

    weeklyArchiveCronJob.start();
    log(`[archive-weekly-leaderboard] cron job added.`);
  }

  if (monthlyArchiveCronTime) {
    const monthlyArchiveCronJob = new cron.CronJob(monthlyArchiveCronTime, async () => {
      inMaintenanceMode = true;
      const resultMonthly = await archiveLeaderboard(
        config,
        LeaderboardTimeframe.Monthly,
        () => {
          inMaintenanceMode = false;
        }
      );

      if (resultMonthly.isFailure) {
        log(
          `An error occured during weekly leaderboard archival. `,
          resultMonthly.failure.error
        );
      }
    });

    monthlyArchiveCronJob.start();
    log(`[archive-monthly-leaderboard] cron job added.`);
  }

  log(`Leaderboard archive ... [ready]`);
};
