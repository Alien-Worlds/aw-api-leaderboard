import 'reflect-metadata';

import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints/leaderboard';
import { mountRoutes } from './routes';
import { buildConfig } from './config/config';

export const startApi = async () => {
  const config = buildConfig();
  const container = new Container();
  await setupDependencies(config, container);

  const api = new LeaderboardApi(config);

  mountRoutes(api, container);

  return api.start();
};

startApi();
