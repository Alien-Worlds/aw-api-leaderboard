import { Broadcast, BroadcastClientCast, BroadcastMessage, BroadcastServer } from '@alien-worlds/api-core';
import { LeaderboardConfig } from './config/config.types';

export class LeaderboardBroadcast {
  private broadcast: BroadcastServer;

  constructor(private config: LeaderboardConfig) {}

  public async start() {
    const { config } = this;
    this.broadcast = await Broadcast.startServer(config.broadcast);

    this.broadcast.onClientMessage(
      async (socket: BroadcastClientCast, message: BroadcastMessage) => {
        
        //
      }
    );
  }
}
