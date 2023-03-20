import { Container, MongoSource } from '@alien-worlds/api-core';

import { FindUserInLeaderboardUseCase } from './domain/use-cases/find-user-in-leaderboard.use-case';
import { LeaderboardApiConfig } from '../../config/config.types';
import { LeaderboardController } from './domain/leaderboard.controller';
import { LeaderboardMongoSource } from './data/data-sources/leaderboard.mongo.source';
import { LeaderboardRedisSource } from './data/data-sources/leaderboard.redis.source';
import { LeaderboardRepositoryImpl } from './data/repositories/leaderboard.repository-impl';
import { ListLeaderboardUseCase } from './domain/use-cases/list-leaderboard.use-case';
import { MiningDailyLeaderboardRepository } from './domain/repositories/mining-daily-leaderboard.repository';
import { MiningLeaderboardTimeframe } from './domain/mining-leaderboard.enums';
import { MiningMonthlyLeaderboardRepository } from './domain/repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from './domain/repositories/mining-weekly-leaderboard.repository';
import { PatchLeaderboardUseCase } from './domain/use-cases/patch-leaderboard.use-case';
import { RedisSource } from './data/data-sources/redis.source';
import { UpdateLeaderboardUseCase } from './domain/use-cases/update-leaderboard.use-case';
import { LeaderboardMapper } from './data/mappers/leaderboard.mapper';

export const setupDependencies = async (
  config: LeaderboardApiConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);
  const redisSource = await RedisSource.create(config.redis);

  const dailyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Daily),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Daily),
    new LeaderboardMapper()
  );
  container
    .bind<MiningDailyLeaderboardRepository>(MiningDailyLeaderboardRepository.Token)
    .toConstantValue(dailyLeaderboardRepository);

  const weeklyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Weekly),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Weekly),
    new LeaderboardMapper()
  );
  container
    .bind<MiningWeeklyLeaderboardRepository>(MiningWeeklyLeaderboardRepository.Token)
    .toConstantValue(weeklyLeaderboardRepository);

  const monthlyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Monthly),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Monthly),
    new LeaderboardMapper()
  );
  container
    .bind<MiningMonthlyLeaderboardRepository>(MiningMonthlyLeaderboardRepository.Token)
    .toConstantValue(monthlyLeaderboardRepository);

  container
    .bind<ListLeaderboardUseCase>(ListLeaderboardUseCase.Token)
    .to(ListLeaderboardUseCase);
  container
    .bind<UpdateLeaderboardUseCase>(UpdateLeaderboardUseCase.Token)
    .to(UpdateLeaderboardUseCase);
  container
    .bind<PatchLeaderboardUseCase>(PatchLeaderboardUseCase.Token)
    .to(PatchLeaderboardUseCase);
  container
    .bind<FindUserInLeaderboardUseCase>(FindUserInLeaderboardUseCase.Token)
    .to(FindUserInLeaderboardUseCase);
  container
    .bind<LeaderboardController>(LeaderboardController.Token)
    .to(LeaderboardController);
};
