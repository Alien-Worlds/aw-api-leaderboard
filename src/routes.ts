import { Container, Route } from '@alien-worlds/api-core';
import { FindUserInLeaderboardRoute, LeaderboardController, ListLeaderboardRoute, UpdateLeaderboardRoute } from './endpoints/leaderboard';

import { LeaderboardApi } from './api';
import { PatchLeaderboardRoute } from './endpoints/leaderboard/routes/patch-leaderboard.route';

export const mountRoutes = (api: LeaderboardApi, container: Container) => {
  const leaderboardController = container.get<LeaderboardController>(
    LeaderboardController.Token
  );

  Route.mount(
    api.framework,
    ListLeaderboardRoute.create(leaderboardController.list.bind(leaderboardController))
  );
  Route.mount(
    api.framework,
    UpdateLeaderboardRoute.create(
      leaderboardController.update.bind(leaderboardController)
    )
  );
  Route.mount(
    api.framework,
    FindUserInLeaderboardRoute.create(
      leaderboardController.findUser.bind(leaderboardController)
    )
  );
  Route.mount(
    api.framework,
    PatchLeaderboardRoute.create(
      leaderboardController.patch.bind(leaderboardController)
    )
  );
};
