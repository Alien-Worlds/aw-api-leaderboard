import { Response, RouteIO, } from '@alien-worlds/aw-core';

import { HealthOutput } from '../domain/models/health.output';

/**
 * @class
 */
export class GetHealthRouteIO implements RouteIO {
  toResponse(output: HealthOutput): Response {
    const { result } = output;
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
