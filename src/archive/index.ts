import 'reflect-metadata';

import { log } from '@alien-worlds/aw-core';
import { Command } from 'commander';
import { join } from 'path';

import { buildConfig } from '../config';
import { startArchive } from './start-archive';

const program = new Command();

const start = async () => {
  const config = buildConfig(join(__dirname, '../../package.json'));

  startArchive(config).catch(log);
};

program.version('1.0', '-v, --version').parse(process.argv);

start().catch(log);
