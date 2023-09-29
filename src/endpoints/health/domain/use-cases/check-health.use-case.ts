import { DailyLeaderboardRepository } from '@alien-worlds/aw-api-common-leaderboard';
import { inject, injectable, Result, UseCase } from '@alien-worlds/aw-core';

import { LeaderboardApiConfig } from '../../../../config';
import { HealthJson } from '../../data/dtos/health.dto';

/*imports*/
/**
 * @class
 */
@injectable()
export class CheckHealthUseCase implements UseCase<HealthJson> {
  public static Token = 'CHECK_HEALTH_USE_CASE';

  constructor(
    /*injections*/
    @inject(DailyLeaderboardRepository.Token)
    private leaderboardRepository: DailyLeaderboardRepository,
    @inject('CONFIG')
    private config: LeaderboardApiConfig
  ) { }

  /**
   * @async
   * @returns {Promise<Result<HealthJson>>}
   */
  public async execute(): Promise<Result<HealthJson>> {
    const { config } = this;
    const currentCountResult = await this.leaderboardRepository.count();
    const archiveCountResult = await this.leaderboardRepository.count(
      new Date('2023-01-01T00:00:00.000Z'),
      new Date('2023-01-01T23:23:59.999Z')
    );

    const output: HealthJson = {
      // api
      status: 'OK',
      version: process.env.npm_package_version,

      // server
      timestamp: new Date(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,

      dependencies: [
        {
          name: '@alien-worlds/aw-core',
          version: config.versions.apiCore,
        },
        {
          name: '@alien-worlds/aw-api-common-atomicassets',
          version: config.versions.atomicassetsApiCommon,
        },
        {
          name: '@alien-worlds/aw-api-common-leaderboard',
          version: config.versions.leaderboardApiCommon,
        },
      ],

      databases: [
        {
          name: 'mongo',
          status: archiveCountResult.isFailure ? 'ERROR' : 'OK',
        },
        {
          name: 'redis',
          status: currentCountResult.isFailure ? 'ERROR' : 'OK',
        },
      ],
    };

    return Result.withContent(output);
  }

  /*methods*/
}
