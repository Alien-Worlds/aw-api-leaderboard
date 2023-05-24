import 'reflect-metadata';

import { Container } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import { setupDependencies } from './endpoints';
import { mountRoutes } from './routes';
import { buildConfig } from './config';
import { join } from 'path';

export const start = async () => {
  const config = buildConfig(join(__dirname, '../package.json'));
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
