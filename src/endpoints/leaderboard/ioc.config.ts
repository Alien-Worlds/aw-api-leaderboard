import { Container, MongoSource, RedisSource } from '@alien-worlds/api-core';

import { FindUserInLeaderboardUseCase } from './domain/use-cases/find-user-in-leaderboard.use-case';
import { LeaderboardConfig } from '../../config/config.types';
import { LeaderboardController } from './domain/leaderboard.controller';
import { LeaderboardMongoSource } from './data/data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from './data/data-sources/leaderboard.redis.source';
import { LeaderboardRepositoryImpl } from './data/repositories/leaderboard.repository-impl';
import { ListLeaderboardUseCase } from './domain/use-cases/list-leaderboard.use-case';
import { MiningDailyLeaderboardRepository } from './domain/repositories/mining-daily-leaderboard.repository';
import { MiningLeaderboardTimeframe } from './domain/mining-leaderboard.enums';
import { MiningMonthlyLeaderboardRepository } from './domain/repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from './domain/repositories/mining-weekly-leaderboard.repository';
import { UpdateLeaderboardUseCase } from './domain/use-cases/update-leaderboard.use-case';
import { setupAtomicAssetRepository } from '@alien-worlds/alienworlds-api-common';
import { UpdateDailyLeaderboardUseCase } from './domain/use-cases/update-daily-leaderboard.use-case';
import { UpdateWeeklyLeaderboardUseCase } from './domain/use-cases/update-weekly-leaderboard.use-case';
import { UpdateMonthlyLeaderboardUseCase } from './domain/use-cases/update-monthly-leaderboard.use-case';
import { LeaderboardInputRepositoryImpl } from './data/repositories/leaderboard-input.repository-impl';
import { LeaderboardInputRepository } from './domain/repositories/leaderboard-input.repository';
import { CacheOrSendLeaderboardUseCase } from './domain/use-cases/cache-or-send-leaderboard.use-case';
import { SendCachedLeaderboardUseCase } from './domain/use-cases/send-cached-leaderboard.use-case';
import { CountLeaderboardUseCase } from './domain/use-cases/count-leaderboard.use-case';

export const setupDependencies = async (
  config: LeaderboardConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);
  const redisSource = await RedisSource.create(config.redis);

  await setupAtomicAssetRepository(config.atomicassets, mongoSource, container);

  const leaderboardInputRepository = new LeaderboardInputRepositoryImpl();
  container
    .bind<LeaderboardInputRepository>(LeaderboardInputRepository.Token)
    .toConstantValue(leaderboardInputRepository);

  const dailyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Daily),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Daily)
  );
  container
    .bind<MiningDailyLeaderboardRepository>(MiningDailyLeaderboardRepository.Token)
    .toConstantValue(dailyLeaderboardRepository);

  const weeklyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Weekly),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Weekly)
  );
  container
    .bind<MiningWeeklyLeaderboardRepository>(MiningWeeklyLeaderboardRepository.Token)
    .toConstantValue(weeklyLeaderboardRepository);

  const monthlyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Monthly),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Monthly)
  );
  container
    .bind<MiningMonthlyLeaderboardRepository>(MiningMonthlyLeaderboardRepository.Token)
    .toConstantValue(monthlyLeaderboardRepository);

  container
    .bind<CountLeaderboardUseCase>(CountLeaderboardUseCase.Token)
    .to(CountLeaderboardUseCase);
  container
    .bind<ListLeaderboardUseCase>(ListLeaderboardUseCase.Token)
    .to(ListLeaderboardUseCase);
  container
    .bind<UpdateDailyLeaderboardUseCase>(UpdateDailyLeaderboardUseCase.Token)
    .to(UpdateDailyLeaderboardUseCase);
  container
    .bind<UpdateWeeklyLeaderboardUseCase>(UpdateWeeklyLeaderboardUseCase.Token)
    .to(UpdateWeeklyLeaderboardUseCase);
  container
    .bind<UpdateMonthlyLeaderboardUseCase>(UpdateMonthlyLeaderboardUseCase.Token)
    .to(UpdateMonthlyLeaderboardUseCase);
  container
    .bind<UpdateLeaderboardUseCase>(UpdateLeaderboardUseCase.Token)
    .to(UpdateLeaderboardUseCase);
  container
    .bind<SendCachedLeaderboardUseCase>(SendCachedLeaderboardUseCase.Token)
    .to(SendCachedLeaderboardUseCase);
  container
    .bind<CacheOrSendLeaderboardUseCase>(CacheOrSendLeaderboardUseCase.Token)
    .to(CacheOrSendLeaderboardUseCase);
  container
    .bind<FindUserInLeaderboardUseCase>(FindUserInLeaderboardUseCase.Token)
    .to(FindUserInLeaderboardUseCase);
  container
    .bind<LeaderboardController>(LeaderboardController.Token)
    .to(LeaderboardController);
};
