import { HealthJson } from '../../data/dtos/health.dto';
import { Result } from '@alien-worlds/aw-core';

/**
 * Represents HealthOutput data entity.
 * @class
 */
export class HealthOutput {
  /**
   * @private
   * @constructor
   */
  private constructor(public readonly result: Result<HealthJson>) { }

  public static create(result: Result<HealthJson>): HealthOutput {
    return new HealthOutput(result);
  }

}
