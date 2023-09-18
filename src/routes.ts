import { Container, Route } from '@alien-worlds/aw-core';

import { LeaderboardApi } from './api';
import { LeaderboardApiConfig } from './config/config.types';
import { FindUserInLeaderboardRoute, LeaderboardController, ListLeaderboardRoute, PingController, UpdateLeaderboardRoute } from './endpoints';
import { HealthController } from './endpoints/health';
import { GetHealthRoute } from './endpoints/health/routes/health.route';
import { GetPingRoute } from './endpoints/ping/routes/ping.route';

export const mountRoutes = (api: LeaderboardApi, container: Container) => {
  const config = container.get<LeaderboardApiConfig>('CONFIG');
  const leaderboardController = container.get<LeaderboardController>(
    LeaderboardController.Token
  );
  const healthController = container.get<HealthController>(HealthController.Token);
  const pingController = container.get<PingController>(PingController.Token);

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
  Route.mount(
    api.framework,
    GetPingRoute.create(pingController.ping.bind(pingController), config)
  );
};
