import { Container, Route } from '@alien-worlds/api-core';
import { LeaderboardApi } from './api';
import {
  FindUserInLeaderboardRoute,
  LeaderboardController,
  ListLeaderboardRoute,
  UpdateLeaderboardRoute,
} from './endpoints/leaderboard';

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
};
