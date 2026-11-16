import { LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';
import { Result } from '@alien-worlds/aw-core';

import { UserLeaderboardNotFoundError } from '../errors/user-leaderboard-not-found.error';
import { FindUserInLeaderboardInput } from '../models/find-user-in-leaderboard.input';
import { FindUserInLeaderboardUseCase } from './find-user-in-leaderboard.use-case';

const makeRepo = (users: unknown[]) => ({
  findUsers: jest.fn().mockResolvedValue(Result.withContent(users)),
});

const makeInput = (timeframe: string) =>
  ({
    user: 'abc.wam',
    timeframe,
    sort: 'tlm_gains_total',
    fromDate: new Date('2024-03-01T00:00:00.000Z'),
    toDate: new Date('2024-03-02T00:00:00.000Z'),
  } as FindUserInLeaderboardInput);

describe('FindUserInLeaderboardUseCase', () => {
  const setup = () => {
    const daily = makeRepo([{ id: 'd1' }, { id: 'd2' }]);
    const weekly = makeRepo([{ id: 'w1' }]);
    const monthly = makeRepo([{ id: 'm1' }]);
    const useCase = new FindUserInLeaderboardUseCase(
      daily as never,
      weekly as never,
      monthly as never
    );
    return { daily, weekly, monthly, useCase };
  };

  it.each([
    [LeaderboardTimeframe.Daily, 'daily', 'd1'],
    [LeaderboardTimeframe.Weekly, 'weekly', 'w1'],
    [LeaderboardTimeframe.Monthly, 'monthly', 'm1'],
  ])('finds the user in the %s repository', async (timeframe, key, id) => {
    const repos = setup();
    const input = makeInput(timeframe);

    const result = await repos.useCase.execute(input);

    expect(result.content).toEqual({ id });
    expect(repos[key as 'daily'].findUsers).toHaveBeenCalledWith(
      ['abc.wam'],
      true,
      input.fromDate,
      input.toDate
    );
  });

  it('fails for an unhandled timeframe', async () => {
    const { daily, weekly, monthly, useCase } = setup();

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Season));

    expect(result.isFailure).toBe(true);
    expect(result.failure.error.message).toBe('Unhandled timeframe season');
    [daily, weekly, monthly].forEach(r => expect(r.findUsers).not.toHaveBeenCalled());
  });

  it('propagates the repository failure', async () => {
    const { daily, useCase } = setup();
    const failure = Result.withFailure('db down');
    daily.findUsers.mockResolvedValue(failure);

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Daily));

    expect(result.isFailure).toBe(true);
    expect(result.failure).toBe(failure.failure);
  });

  it('fails with UserLeaderboardNotFoundError when the user has no entry', async () => {
    const { daily, useCase } = setup();
    daily.findUsers.mockResolvedValue(Result.withContent([]));

    const result = await useCase.execute(makeInput(LeaderboardTimeframe.Daily));

    expect(result.isFailure).toBe(true);
    expect(result.failure.error).toBeInstanceOf(UserLeaderboardNotFoundError);
    expect(result.failure.error.message).toBe('User abc.wam not found in leaderboard');
  });
});
