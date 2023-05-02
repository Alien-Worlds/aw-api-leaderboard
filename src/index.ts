import 'reflect-metadata';

import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints';
import { mountRoutes } from './routes';
import { buildConfig } from './config';

export const start = async () => {
  const config = buildConfig();
  const container = new Container();

  await setupDependencies(config, container);

  /*
   * API
   */
  const api = new LeaderboardApi(config);
  mountRoutes(api, container);
  api.start();
};

start();
