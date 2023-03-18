import 'reflect-metadata';

import cron from 'cron';
import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints/leaderboard';
import { mountRoutes } from './routes';
import { buildConfig } from './config';
import { LeaderboardBroadcast } from './broadcast';
import { checkAndUpdateLeaderboard } from './cron';

export const start = async () => {
  const config = buildConfig();
  const { updatesBatchSize, cronTime } = config;
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
   * CRON
   */
  if (updatesBatchSize && cronTime) {
    cron.schedule(cronTime, () => checkAndUpdateLeaderboard(container));
  }
};

start();
