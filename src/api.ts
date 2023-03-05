import { log } from '@alien-worlds/api-core';
import express, { Express } from 'express';
import { LeaderboardApiConfig } from './config/config.types';

export class LeaderboardApi {
  private app: Express;

  constructor(private config: LeaderboardApiConfig) {
    this.app = express();
  }

  public async start() {
    const {
      config: { port },
    } = this;
    this.app.listen(port, () => {
      log(`Server is running at http://localhost:${port}`);
    });
  }
}
