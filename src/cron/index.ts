import { Container } from '@alien-worlds/api-core';
import { SendCachedLeaderboardUseCase } from '../endpoints/leaderboard/domain/use-cases/send-cached-leaderboard.use-case';

export const checkAndUpdateLeaderboard = async (container: Container) => {
  const useCase = container.get<SendCachedLeaderboardUseCase>(
    SendCachedLeaderboardUseCase.Token
  );

  await useCase.execute();
};
