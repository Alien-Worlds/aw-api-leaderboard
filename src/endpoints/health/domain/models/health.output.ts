import { Result } from '@alien-worlds/api-core';
import { HealthJson } from '../../data/dtos/health.dto';

/*imports*/

/**
 * Represents HealthOutput data entity.
 * @class
 */
export class HealthOutput {
  /**
   * @private
   * @constructor
   */
  private constructor(public readonly result: Result<HealthJson>) {}

  public static create(result: Result<HealthJson>): HealthOutput {
    return new HealthOutput(result);
  }

  public toResponse() {
    const { result } = this;
    if (result.isFailure) {
      const {
        failure: { error },
      } = result;
      if (error) {
        return {
          status: 500,
          body: {
            status: 'FAIL',
            error: error.message,
          },
        };
      }
    }

    const { content } = result;
    const { status, version, timestamp, uptimeSeconds, nodeVersion, dependencies } =
      content;

    const dependenciesOutput = {};
    dependencies.forEach(dep => {
      dependenciesOutput[dep.name] = dep.version;
    });

    const databases = content.databases.reduce((out, { name, status }) => {
      out[name] = status;
      return out;
    }, {});

    const body = {
      status,
      version,
      timestamp: timestamp.getTime(),
      uptimeSeconds,
      nodeVersion,
      dependencies: dependenciesOutput,
      databases,
    };

    return {
      status: 200,
      body,
    };
  }
}
