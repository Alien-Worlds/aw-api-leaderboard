import { LeaderboardApiConfig } from './config/config.types';
import { Container, Route } from '@alien-worlds/api-core';
import {
  FindUserInLeaderboardRoute,
  LeaderboardController,
  ListLeaderboardRoute,
  UpdateLeaderboardRoute,
} from './endpoints';

import { LeaderboardApi } from './api';
import { HealthController } from './endpoints/health';
import { GetHealthRoute } from './endpoints/health/routes/health.route';

export const mountRoutes = (api: LeaderboardApi, container: Container) => {
  const config = container.get<LeaderboardApiConfig>('CONFIG');
  const leaderboardController = container.get<LeaderboardController>(
    LeaderboardController.Token
  );
  const healthController = container.get<HealthController>(HealthController.Token);

  Route.mount(
    api.framework,
    ListLeaderboardRoute.create(
      leaderboardController.list.bind(leaderboardController),
      config
    )
  );
  Route.mount(
    api.framework,
    UpdateLeaderboardRoute.create(
      leaderboardController.update.bind(leaderboardController),
      config
    )
  );
  Route.mount(
    api.framework,
    FindUserInLeaderboardRoute.create(
      leaderboardController.findUser.bind(leaderboardController),
      config
    )
  );
  Route.mount(
    api.framework,
    GetHealthRoute.create(healthController.health.bind(healthController), config)
  );
};
