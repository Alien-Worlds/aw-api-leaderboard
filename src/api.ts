import { log } from '@alien-worlds/aw-core';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { LeaderboardApiConfig } from './config/config.types';

export class LeaderboardApi {
  private app: Express;

  constructor(private config: LeaderboardApiConfig) {
    this.app = express();
    this.app.use(
      cors({
        origin: '*',
      })
    );
    this.app.use(bodyParser.json());

    const file = readFileSync(
      join(__dirname, '../docs/leaderboard-api-oas.yaml'),
      'utf8'
    );
    const swaggerDocument = YAML.parse(file);
    this.app.use(
      `/${config.versions.leaderboardUrlVersion}/leaderboard/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  public async start() {
    const {
      config: { port },
    } = this;
    this.app.listen(port, () => {
      log(`Server is running at http://localhost:${port}`);
    });
  }

  public get framework(): Express {
    return this.app;
  }
}
