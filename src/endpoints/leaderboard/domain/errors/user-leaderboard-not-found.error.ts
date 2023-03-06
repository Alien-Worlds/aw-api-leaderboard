export class UserLeaderboardNotFoundError extends Error {
  constructor(user: string) {
    super(`User ${user} not found in leaderboard`);
  }
}
