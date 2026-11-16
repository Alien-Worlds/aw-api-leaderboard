import { LeaderboardOrder, LeaderboardSort, LeaderboardTimeframe } from '@alien-worlds/aw-api-common-leaderboard';

import { ListLeaderboardInput } from './list-leaderboard.input';

const create = (query: Record<string, unknown>) =>
  ListLeaderboardInput.create({ query } as never);

describe('ListLeaderboardInput.create', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));
  });

  afterEach(() => jest.useRealTimers());

  it('applies defaults for an empty query', () => {
    const input = create({});

    expect(input.timeframe).toBe(LeaderboardTimeframe.Daily);
    expect(input.sort).toBe(LeaderboardSort.TlmGainsTotal);
    expect(input.order).toBe(LeaderboardOrder.Desc);
    expect(input.offset).toBe(0);
    expect(input.limit).toBe(10);
    expect(input.fromDate).toBeInstanceOf(Date);
    expect(input.toDate).toBeInstanceOf(Date);
  });

  it('passes explicit values through', () => {
    const input = create({
      timeframe: LeaderboardTimeframe.Weekly,
      sort: LeaderboardSort.TotalNftPoints,
      offset: 30,
      limit: 50,
    });

    expect(input.timeframe).toBe(LeaderboardTimeframe.Weekly);
    expect(input.sort).toBe(LeaderboardSort.TotalNftPoints);
    expect(input.offset).toBe(30);
    expect(input.limit).toBe(50);
  });

  it.each([
    ['1', LeaderboardOrder.Asc],
    ['-1', LeaderboardOrder.Desc],
    [1, LeaderboardOrder.Asc],
    ['0', LeaderboardOrder.Desc],
    ['abc', LeaderboardOrder.Desc],
  ])('maps order %p to %p', (order, expected) => {
    expect(create({ order }).order).toBe(expected);
  });

  it('builds the time range from the query', () => {
    const input = create({ fromDate: '2024-03-01T05:06:07.000Z' });

    expect(input.fromDate.toISOString()).toBe('2024-03-01T05:06:07.000Z');
  });
});
