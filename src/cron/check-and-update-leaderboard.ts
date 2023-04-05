import { Container } from '@alien-worlds/api-core';
import { SendCachedLeaderboardUseCase } from '../endpoints/leaderboard/domain/use-cases/send-cached-leaderboard.use-case';

export const checkAndUpdateLeaderboard = async (container: Container) => {
  container
    .get<SendCachedLeaderboardUseCase>(SendCachedLeaderboardUseCase.Token)
    .execute();
};
