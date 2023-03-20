import { LeaderboardUpdateMessage } from '@alien-worlds/alienworlds-api-common';
import {
  Broadcast,
  BroadcastClient,
  BroadcastMessage,
  Container,
  log,
} from '@alien-worlds/api-core';
import { LeaderboardConfig } from '../config/config.types';
import { LeaderboardController, UpdateLeaderboardInput } from '../endpoints/leaderboard';
import { BroadcastChannel } from './broadcast.enums';

export class LeaderboardBroadcast {
  private broadcast: BroadcastClient;
  private leaderboardController: LeaderboardController;

  constructor(private config: LeaderboardConfig, private container: Container) {
    this.leaderboardController = container.get<LeaderboardController>(
      LeaderboardController.Token
    );
  }

  public async start() {
    const {
      config: { historyToolsBroadcast },
    } = this;

    if (!historyToolsBroadcast) {
      log(
        `Unable to establish socket connection with the history tools. Required variables are not provided.`
      );
      return;
    }
    this.broadcast = await Broadcast.createClient(historyToolsBroadcast);

    this.broadcast.onMessage(
      BroadcastChannel.LeaderboardUpdate,
      async (message: BroadcastMessage<LeaderboardUpdateMessage>) => {
        const input = UpdateLeaderboardInput.fromMessage(message);
        const updateResult = await this.leaderboardController.update(input);

        if (updateResult.isFailure) {
          //
        }
      }
    );

    this.broadcast.connect();
  }
}
