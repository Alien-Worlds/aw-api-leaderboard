import { Container, MongoSource } from '@alien-worlds/api-core';
import { FindUserInLeaderboardUseCase } from './leaderboard/domain/use-cases/find-user-in-leaderboard.use-case';
import { LeaderboardApiConfig } from '../config/config.types';
import { LeaderboardController } from './leaderboard/domain/leaderboard.controller';
import { ListLeaderboardUseCase } from './leaderboard/domain/use-cases/list-leaderboard.use-case';
import { CountLeaderboardUseCase } from './leaderboard/domain/use-cases/count-leaderboard.use-case';
import {
  setupAtomicAssets,
  setupLeaderboard,
} from '@alien-worlds/alienworlds-api-common';
import { CheckHealthUseCase, HealthController } from './health';
import { PingController } from './ping';

export const setupDependencies = async (
  config: LeaderboardApiConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);

  await setupAtomicAssets(config.atomicassets, mongoSource, container);
  await setupLeaderboard(config, mongoSource, container);

  container.bind<LeaderboardApiConfig>('CONFIG').toConstantValue(config);

  // leaderboard
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

  // health
  container.bind<CheckHealthUseCase>(CheckHealthUseCase.Token).to(CheckHealthUseCase);
  container.bind<HealthController>(HealthController.Token).to(HealthController);

  // ping
  container.bind<PingController>(PingController.Token).to(PingController);
};
