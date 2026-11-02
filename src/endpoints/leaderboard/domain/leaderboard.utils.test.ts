import { Leaderboard } from '@alien-worlds/aw-api-common-leaderboard';

import {
  createTimeRange,
  isIsoDateFormat,
  parseLeaderboardToResult,
} from './leaderboard.utils';

/**
 * Emulates `it.failing` (not available in jest 27): passes while the bug exists
 * and fails once it is fixed, as a prompt to turn it into a regular `it`.
 */
const itKnownBug = (name: string, fn: () => void) =>
  it(`[known bug] ${name}`, () => {
    expect(fn).toThrow();
  });

describe('isIsoDateFormat', () => {
  it('accepts a full ISO string', () => {
    expect(isIsoDateFormat('2024-03-15T10:20:30.000Z')).toBe(true);
  });

  it('rejects a date-only string', () => {
    expect(isIsoDateFormat('2024-03-15')).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isIsoDateFormat(new Date())).toBe(false);
    expect(isIsoDateFormat(undefined)).toBe(false);
    expect(isIsoDateFormat(123)).toBe(false);
  });

  itKnownBug('rejects strings with leading or trailing junk', () => {
    expect(isIsoDateFormat('xx2024-03-15T10:20:30.000Zyy')).toBe(false);
  });
});

describe('createTimeRange', () => {
  const originalTz = process.env.TZ;

  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env.TZ = originalTz;
  });

  it('defaults to the whole current day', () => {
    process.env.TZ = 'UTC';
    const { fromDate, toDate } = createTimeRange({});
    expect(fromDate.toISOString()).toBe('2024-03-15T00:00:00.000Z');
    expect(toDate.toISOString()).toBe('2024-03-15T23:59:59.000Z');
  });

  it('uses the whole day of `date`, ignoring fromDate and toDate', () => {
    process.env.TZ = 'UTC';
    const { fromDate, toDate } = createTimeRange({
      date: '2024-02-10T08:00:00.000Z',
      fromDate: '2020-01-01T00:00:00.000Z',
      toDate: '2020-01-02T00:00:00.000Z',
    });
    expect(fromDate.toISOString()).toBe('2024-02-10T00:00:00.000Z');
    expect(toDate.toISOString()).toBe('2024-02-10T23:59:59.000Z');
  });

  it('accepts `date` as a Date', () => {
    process.env.TZ = 'UTC';
    const { fromDate, toDate } = createTimeRange({
      date: new Date('2024-02-10T08:00:00.000Z'),
    });
    expect(fromDate.toISOString()).toBe('2024-02-10T00:00:00.000Z');
    expect(toDate.toISOString()).toBe('2024-02-10T23:59:59.000Z');
  });

  it('keeps an ISO fromDate exactly', () => {
    const { fromDate, toDate } = createTimeRange({
      fromDate: '2024-03-01T05:06:07.000Z',
    });
    expect(fromDate.toISOString()).toBe('2024-03-01T05:06:07.000Z');
    // toDate untouched: end of the current day
    expect(toDate.toISOString()).toBe('2024-03-15T23:59:59.000Z');
  });

  it('snaps a date-only fromDate to the start of that day', () => {
    process.env.TZ = 'UTC';
    const { fromDate } = createTimeRange({ fromDate: '2024-03-01' });
    expect(fromDate.toISOString()).toBe('2024-03-01T00:00:00.000Z');
  });

  it('snaps a date-only toDate to the end of that day', () => {
    process.env.TZ = 'UTC';
    const { toDate } = createTimeRange({ toDate: '2024-03-20' });
    expect(toDate.toISOString()).toBe('2024-03-20T23:59:59.000Z');
  });

  it('zero-pads single digit months and days', () => {
    process.env.TZ = 'UTC';
    const { fromDate, toDate } = createTimeRange({ date: '2024-01-05T10:00:00.000Z' });
    expect(fromDate.toISOString()).toBe('2024-01-05T00:00:00.000Z');
    expect(toDate.toISOString()).toBe('2024-01-05T23:59:59.000Z');
  });

  itKnownBug('keeps an ISO toDate exactly when fromDate is not given', () => {
    // the toDate branch tests isIsoDateFormat(options.fromDate) instead of toDate
    const { toDate } = createTimeRange({ toDate: '2024-03-20T10:00:00.000Z' });
    expect(toDate.toISOString()).toBe('2024-03-20T10:00:00.000Z');
  });

  itKnownBug('picks the UTC day of `date` on a non-UTC host', () => {
    // local getDate()/getMonth() are used, then 'Z' is appended
    process.env.TZ = 'Australia/Sydney';
    const { fromDate } = createTimeRange({ date: '2024-03-14T23:30:00.000Z' });
    expect(fromDate.toISOString()).toBe('2024-03-14T00:00:00.000Z');
  });
});

describe('parseLeaderboardToResult', () => {
  const fakeLeaderboard = (json: Record<string, unknown>) =>
    ({ toJson: () => json } as unknown as Leaderboard);

  const base = {
    wallet_id: 'abc.wam',
    username: 'abc',
    tlm_gains_total: 123456,
    tlm_gains_highest: 5000,
    total_nft_points: 7,
    total_charge_time: '100',
    avg_charge_time: 1.23456,
    total_mining_power: '50',
    avg_mining_power: 2.5,
    total_nft_power: '9',
    avg_nft_power: 0.333333,
    avg_tool_mining_power: 4,
    avg_tool_nft_power: 1,
    lands_mined_on: '3',
    planets_mined_on: '2',
    unique_tools_used: '6',
    rankings: { tlm_gains_total: 4 },
  };

  it('converts integer TLM values using the decimal precision', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard(base),
      'tlm_gains_total',
      4
    );
    expect(result.tlm_gains_total).toBe(12.3456);
    expect(result.tlm_gains_highest).toBe(0.5);
  });

  it('coerces numeric strings and rounds averages to the precision', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard(base),
      'tlm_gains_total',
      2
    );
    expect(result.total_charge_time).toBe(100);
    expect(result.avg_charge_time).toBe(1.23);
    expect(result.avg_nft_power).toBe(0.33);
    expect(result.lands_mined_on).toBe(3);
    expect(result.planets_mined_on).toBe(2);
    expect(result.unique_tools_used).toBe(6);
  });

  it('takes the position from the ranking of the requested sort', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard(base),
      'tlm_gains_total',
      4
    );
    expect(result.position).toBe(4);
  });

  it('uses -1 when there is no ranking for the sort', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard(base),
      'avg_mining_power',
      4
    );
    expect(result.position).toBe(-1);
  });

  it('falls back to 0 for missing TLM gains and averages', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard({
        ...base,
        tlm_gains_total: undefined,
        tlm_gains_highest: null,
        avg_charge_time: undefined,
        rankings: undefined,
      }),
      'tlm_gains_total',
      4
    );
    expect(result.tlm_gains_total).toBe(0);
    expect(result.tlm_gains_highest).toBe(0);
    expect(result.avg_charge_time).toBe(0);
    expect(result.position).toBe(-1);
  });

  it('drops undefined properties from the result', () => {
    const result = parseLeaderboardToResult(
      fakeLeaderboard({ ...base, username: undefined }),
      'tlm_gains_total',
      4
    );
    expect('username' in result).toBe(false);
  });
});
