import { LeaderboardController } from './domain/leaderboard.controller';
import { ListLeaderboardUseCase } from './domain/use-cases/list-leaderboard.use-case';
import { LeaderboardRepositoryImpl } from './data/repositories/leaderboard.repository-impl';
import { MongoSource, Container } from '@alien-worlds/api-core';
import { RedisSource } from './data/data-sources/redis.source';
import { LeaderboardMongoSource } from './data/data-sources/leaderboard.mongo.source';
import { MiningLeaderboardTimeframe } from './domain/mining-leaderboard.enums';
import { LeaderboardRedisSource } from './data/data-sources/leaderboard.redis.source';
import { MiningDailyLeaderboardRepository } from './domain/repositories/mining-daily-leaderboard.repository';
import { MiningMonthlyLeaderboardRepository } from './domain/repositories/mining-monthly-leaderboard.repository';
import { MiningWeeklyLeaderboardRepository } from './domain/repositories/mining-weekly-leaderboard.repository';
import { UpdateLeaderboardUseCase } from './domain/use-cases/update-leaderboard.use-case';
import { FindUserInLeaderboardUseCase } from './domain/use-cases/find-user-in-leaderboard.use-case';
import { LeaderboardApiConfig } from '../../config/config.types';

export const setupDependencies = async (
  config: LeaderboardApiConfig,
  container: Container
) => {
  const mongoSource = await MongoSource.create(config.mongo);
  const redisSource = await RedisSource.create(config.redis);

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
    .bind<MiningWeeklyLeaderboardRepository>(MiningDailyLeaderboardRepository.Token)
    .toConstantValue(weeklyLeaderboardRepository);

  const monthlyLeaderboardRepository = new LeaderboardRepositoryImpl(
    new LeaderboardMongoSource(mongoSource, MiningLeaderboardTimeframe.Monthly),
    new LeaderboardRedisSource(redisSource, MiningLeaderboardTimeframe.Monthly)
  );
  container
    .bind<MiningMonthlyLeaderboardRepository>(MiningDailyLeaderboardRepository.Token)
    .toConstantValue(monthlyLeaderboardRepository);

  container
    .bind<ListLeaderboardUseCase>(ListLeaderboardUseCase.Token)
    .to(ListLeaderboardUseCase);
  container
    .bind<UpdateLeaderboardUseCase>(UpdateLeaderboardUseCase.Token)
    .to(UpdateLeaderboardUseCase);
  container
    .bind<FindUserInLeaderboardUseCase>(FindUserInLeaderboardUseCase.Token)
    .to(FindUserInLeaderboardUseCase);
  container
    .bind<LeaderboardController>(LeaderboardController.Token)
    .to(LeaderboardController);
};
