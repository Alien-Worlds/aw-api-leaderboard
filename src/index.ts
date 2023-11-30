import 'reflect-metadata';

import { Container } from '@alien-worlds/aw-core';
import { join } from 'path';

import { LeaderboardApi } from './api';
import { buildConfig } from './config';
import { setupDependencies } from './endpoints';
import { mountRoutes } from './routes';

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
