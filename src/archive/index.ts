import { ConfigVars, buildBroadcastConfig, log } from '@alien-worlds/api-core';
import { Command } from 'commander';
import { startArchive } from './start-archive';
import { buildConfig } from '../config';
import { join } from 'path';

const program = new Command();

const start = async () => {
  const vars = new ConfigVars();
  const config = buildConfig(join(__dirname, '../../package.json'));
  const broadcastConfig = buildBroadcastConfig(vars, 'ARCHIVE_');

  startArchive(config, broadcastConfig).catch(log);
};

program.version('1.0', '-v, --version').parse(process.argv);

start().catch(log);
