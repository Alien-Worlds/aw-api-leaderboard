import { Container, MongoSource } from '@alien-worlds/api-core';
import { FindUserInLeaderboardUseCase } from './domain/use-cases/find-user-in-leaderboard.use-case';
import { LeaderboardApiConfig } from '../../config/config.types';
import { LeaderboardController } from './domain/leaderboard.controller';
import { ListLeaderboardUseCase } from './domain/use-cases/list-leaderboard.use-case';
import { CountLeaderboardUseCase } from './domain/use-cases/count-leaderboard.use-case';
import {
  setupAtomicAssets,
  setupLeaderboard,
} from '@alien-worlds/alienworlds-api-common';

export const setupDependencies = async (
  config: LeaderboardApiConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);

  await setupAtomicAssets(config.atomicassets, mongoSource, container);
  await setupLeaderboard(config, mongoSource, container);

  container
    .bind<CountLeaderboardUseCase>(CountLeaderboardUseCase.Token)
    .to(CountLeaderboardUseCase);
  container
    .bind<ListLeaderboardUseCase>(ListLeaderboardUseCase.Token)
    .to(ListLeaderboardUseCase);
  container
    .bind<FindUserInLeaderboardUseCase>(FindUserInLeaderboardUseCase.Token)
    .to(FindUserInLeaderboardUseCase);
  container
    .bind<LeaderboardController>(LeaderboardController.Token)
    .to(LeaderboardController);
};
