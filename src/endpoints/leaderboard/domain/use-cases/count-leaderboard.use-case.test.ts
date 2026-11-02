import { LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';
import { Result } from '@alien-worlds/aw-core';

import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import { CountLeaderboardUseCase } from './count-leaderboard.use-case';

const makeRepo = (count: number) => ({
  count: jest.fn().mockResolvedValue(Result.withContent(count)),
});

const makeInput = (timeframe: string) =>
  ({
    timeframe,
    fromDate: new Date('2024-03-01T00:00:00.000Z'),
    toDate: new Date('2024-03-02T00:00:00.000Z'),
  } as ListLeaderboardInput);

describe('CountLeaderboardUseCase', () => {
  const setup = () => {
    const daily = makeRepo(1);
    const weekly = makeRepo(2);
    const monthly = makeRepo(3);
    const useCase = new CountLeaderboardUseCase(
      daily as never,
      weekly as never,
      monthly as never
    );
    return { daily, weekly, monthly, useCase };
  };

  it.each([
    [LeaderboardTimeframe.Daily, 'daily', 1],
    [LeaderboardTimeframe.Weekly, 'weekly', 2],
    [LeaderboardTimeframe.Monthly, 'monthly', 3],
  ])('counts using the %s repository only', async (timeframe, key, count) => {
    const repos = setup();
    const input = makeInput(timeframe);

    const result = await repos.useCase.execute(input);

    expect(result.content).toBe(count);
    expect(repos[key as 'daily'].count).toHaveBeenCalledWith(
      input.fromDate,
      input.toDate
    );
    const others = ['daily', 'weekly', 'monthly'].filter(k => k !== key);
    others.forEach(k => expect(repos[k as 'daily'].count).not.toHaveBeenCalled());
  });

  it('fails for an unhandled timeframe', async () => {
    const { useCase } = setup();

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Season));

    expect(result.isFailure).toBe(true);
    expect(result.failure.error.message).toBe('Unhandled timeframe season');
  });
});
