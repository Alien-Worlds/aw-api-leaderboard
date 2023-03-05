import { RedisConfig } from './config/config.types';

export class RedisUtils {
  public static buildRedisUrl(config: RedisConfig) {
    const { user, password, iana, database } = config;
    let url = iana ? 'rediss://' : 'redis://';

    if (user && password) {
      url += `${user}:${password}@`;
    }
    const hosts = config.hosts || ['localhost'];
    const ports = config.ports || ['6379'];
    const hostsPortsDiff = hosts.length - ports.length;
    const defaultPort = ports[0];
    while (hostsPortsDiff > 0) {
      ports.push(defaultPort);
    }

    const hostsAndPorts = hosts.map((host, i) => {
      return `${host}:${ports[i]}`;
    });

    url += hostsAndPorts.join(',');

    if (database) {
      url += `/${database}`;
    }

    return url;
  }
}
