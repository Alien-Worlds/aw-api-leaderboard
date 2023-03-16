import { log } from '@alien-worlds/api-core';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import cors from 'cors';
import { LeaderboardConfig } from './config/config.types';

export class LeaderboardApi {
  private app: Express;

  constructor(private config: LeaderboardConfig) {
    this.app = express();
    this.app.use(
      cors({
        origin: '*',
      })
    );
    this.app.use(bodyParser.json());
  }

  public async start() {
    const {
      config: {
        api: { port },
      },
    } = this;
    this.app.listen(port, () => {
      log(`Server is running at http://localhost:${port}`);
    });
  }

  public get framework(): Express {
    return this.app;
  }
}
