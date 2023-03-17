import 'reflect-metadata';

import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints/leaderboard';
import { mountRoutes } from './routes';
import { buildConfig } from './config';
import { LeaderboardBroadcast } from './broadcast';

export const start = async () => {
  const config = buildConfig();
  const container = new Container();
  await setupDependencies(config, container);

  const api = new LeaderboardApi(config);
  const broadcast = new LeaderboardBroadcast(config, container);

  mountRoutes(api, container);

  api.start();
  broadcast.start();
};

start();
