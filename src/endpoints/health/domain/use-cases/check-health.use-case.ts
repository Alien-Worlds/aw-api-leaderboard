import { inject, injectable, Result, UseCase } from '@alien-worlds/api-core';

import { HealthJson } from '../../data/dtos/health.dto';
import { DailyLeaderboardRepository } from '@alien-worlds/alienworlds-api-common';
import { LeaderboardApiConfig } from '../../../../config';

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
  ) {}

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
          name: '@alien-worlds/api-core',
          version: config.versions.apiCore,
        },
        {
          name: '@alien-worlds/dao-api-common',
          version: config.versions.alienworldsApiCommon,
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
