import { inject, injectable } from '@alien-worlds/aw-core';

import { HealthOutput } from './models/health.output';
import { CheckHealthUseCase } from './use-cases/check-health.use-case';

/*imports*/

/**
 * @class
 *
 *
 */
@injectable()
export class HealthController {
  public static Token = 'HEALTH_CONTROLLER';

  constructor(
    @inject(CheckHealthUseCase.Token)
    private checkHealthUseCase: CheckHealthUseCase /*injections*/
  ) { }

  /*methods*/

  /**
   *
   * @returns {Promise<HealthOutput>}
   */
  public async health(): Promise<HealthOutput> {
    const result = await this.checkHealthUseCase.execute();
    return HealthOutput.create(result);
  }
}
