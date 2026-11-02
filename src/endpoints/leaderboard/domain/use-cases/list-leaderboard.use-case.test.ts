import { LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';
import { Result } from '@alien-worlds/aw-core';

import { ListLeaderboardInput } from '../models/list-leaderboard.input';
import { ListLeaderboardUseCase } from './list-leaderboard.use-case';

const makeRepo = (items: unknown[]) => ({
  list: jest.fn().mockResolvedValue(Result.withContent(items)),
});

const makeInput = (timeframe: string) =>
  ({
    timeframe,
    sort: 'tlm_gains_total',
    order: -1,
    offset: 5,
    limit: 20,
    fromDate: new Date('2024-03-01T00:00:00.000Z'),
    toDate: new Date('2024-03-02T00:00:00.000Z'),
  } as ListLeaderboardInput);

describe('ListLeaderboardUseCase', () => {
  const setup = () => {
    const daily = makeRepo(['d']);
    const weekly = makeRepo(['w']);
    const monthly = makeRepo(['m']);
    const useCase = new ListLeaderboardUseCase(
      daily as never,
      weekly as never,
      monthly as never
    );
    return { daily, weekly, monthly, useCase };
  };

  it.each([
    [LeaderboardTimeframe.Daily, 'daily', 'd'],
    [LeaderboardTimeframe.Weekly, 'weekly', 'w'],
    [LeaderboardTimeframe.Monthly, 'monthly', 'm'],
  ])('lists from the %s repository only', async (timeframe, key, item) => {
    const repos = setup();
    const input = makeInput(timeframe);

    const result = await repos.useCase.execute(input);

    expect(result.content).toEqual([item]);
    expect(repos[key as 'daily'].list).toHaveBeenCalledWith(
      input.sort,
      input.offset,
      input.limit,
      input.order,
      input.fromDate,
      input.toDate
    );
    const others = ['daily', 'weekly', 'monthly'].filter(k => k !== key);
    others.forEach(k => expect(repos[k as 'daily'].list).not.toHaveBeenCalled());
  });

  it('fails for an unhandled timeframe without touching any repository', async () => {
    const { daily, weekly, monthly, useCase } = setup();

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Season));

    expect(result.isFailure).toBe(true);
    expect(result.failure.error.message).toBe('Unhandled timeframe season');
    [daily, weekly, monthly].forEach(r => expect(r.list).not.toHaveBeenCalled());
  });

  it('returns the repository failure unchanged', async () => {
    const { daily, useCase } = setup();
    const failure = Result.withFailure('db down');
    daily.list.mockResolvedValue(failure);

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Daily));

    expect(result).toBe(failure);
  });
});
