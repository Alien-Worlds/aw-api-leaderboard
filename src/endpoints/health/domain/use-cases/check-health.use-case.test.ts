import { Result } from '@alien-worlds/aw-core';

import { CheckHealthUseCase } from './check-health.use-case';

const config = {
  versions: {
    apiCore: '1.0.0',
    atomicassetsApiCommon: '2.0.0',
    leaderboardApiCommon: '3.0.0',
  },
};

describe('CheckHealthUseCase', () => {
  const setup = (current: Result<number>, archive: Result<number>) => {
    const repo = {
      count: jest.fn().mockResolvedValueOnce(current).mockResolvedValueOnce(archive),
    };
    const useCase = new CheckHealthUseCase(repo as never, config as never);
    return { repo, useCase };
  };

  const statusOf = (databases: { name: string; status: string }[], name: string) =>
    databases.find(db => db.name === name).status;

  it('reports OK for both databases when both counts succeed', async () => {
    const { repo, useCase } = setup(Result.withContent(1), Result.withContent(2));

    const result = await useCase.execute();

    expect(repo.count).toHaveBeenCalledTimes(2);
    expect(result.content.status).toBe('OK');
    expect(statusOf(result.content.databases, 'mongo')).toBe('OK');
    expect(statusOf(result.content.databases, 'redis')).toBe('OK');
  });

  it('reports redis ERROR when the current count fails', async () => {
    const { useCase } = setup(Result.withFailure('redis down'), Result.withContent(2));

    const { content } = await useCase.execute();

    expect(statusOf(content.databases, 'redis')).toBe('ERROR');
    expect(statusOf(content.databases, 'mongo')).toBe('OK');
  });

  it('reports mongo ERROR when the archive count fails', async () => {
    const { useCase } = setup(Result.withContent(1), Result.withFailure('mongo down'));

    const { content } = await useCase.execute();

    expect(statusOf(content.databases, 'mongo')).toBe('ERROR');
    expect(statusOf(content.databases, 'redis')).toBe('OK');
  });

  it('includes dependency versions from config and runtime info', async () => {
    const { useCase } = setup(Result.withContent(1), Result.withContent(2));

    const { content } = await useCase.execute();

    expect(content.dependencies).toEqual([
      { name: '@alien-worlds/aw-core', version: '1.0.0' },
      { name: '@alien-worlds/aw-api-common-atomicassets', version: '2.0.0' },
      { name: '@alien-worlds/aw-api-common-leaderboard', version: '3.0.0' },
    ]);
    expect(content.nodeVersion).toBe(process.version);
    expect(content.timestamp).toBeInstanceOf(Date);
  });
});
