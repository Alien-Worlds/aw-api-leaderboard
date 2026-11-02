import { OperationStatus, Result } from '@alien-worlds/aw-core';

import { LeaderboardController } from './leaderboard.controller';
import { UpdateLeaderboardInput } from './models/update-leaderboard.input';

const makeInput = (items: unknown[]) => ({ items } as UpdateLeaderboardInput);

describe('LeaderboardController.update', () => {
  const setup = () => {
    const updateLeaderboardUseCase = {
      execute: jest.fn().mockResolvedValue(Result.withContent(OperationStatus.Success)),
    };
    const getAtomicAssetsUseCase = {
      execute: jest.fn().mockResolvedValue(Result.withContent([{ asset_id: '1' }])),
    };
    const controller = new LeaderboardController(
      {} as never,
      {} as never,
      updateLeaderboardUseCase as never,
      {} as never,
      getAtomicAssetsUseCase as never,
      { tlmDecimalPrecision: 4 } as never
    );
    return { controller, updateLeaderboardUseCase, getAtomicAssetsUseCase };
  };

  it('flattens bag items of all updates and fetches their assets', async () => {
    const { controller, getAtomicAssetsUseCase } = setup();

    await controller.update(
      makeInput([{ bagItems: ['1', '2'] }, { bagItems: undefined }, { bagItems: ['3'] }])
    );

    expect(getAtomicAssetsUseCase.execute).toHaveBeenCalledWith(['1', '2', '3'], 10);
  });

  it('passes updates and fetched assets to the update use case', async () => {
    const { controller, updateLeaderboardUseCase } = setup();
    const updates = [{ bagItems: ['1'] }];

    const output = await controller.update(makeInput(updates));

    expect(updateLeaderboardUseCase.execute).toHaveBeenCalledWith(updates, [
      { asset_id: '1' },
    ]);
    expect(output.result.content).toBe(OperationStatus.Success);
    expect(output.toResponse()).toEqual({ status: 200, body: true });
  });

  it('short-circuits with a Failure status when there are no updates', async () => {
    const { controller, getAtomicAssetsUseCase, updateLeaderboardUseCase } = setup();

    const output = await controller.update(makeInput([]));

    expect(output.result.content).toBe(OperationStatus.Failure);
    expect(getAtomicAssetsUseCase.execute).not.toHaveBeenCalled();
    expect(updateLeaderboardUseCase.execute).not.toHaveBeenCalled();
  });

  it('[known bug] an empty update should not be reported as HTTP 200 success', async () => {
    // the Failure status is wrapped in Result.withContent, so toResponse() sees no failure
    const { controller } = setup();

    const output = await controller.update(makeInput([]));

    expect(() => expect(output.toResponse().status).not.toBe(200)).toThrow();
  });

  it('returns the failure and skips the update when assets cannot be fetched', async () => {
    const { controller, getAtomicAssetsUseCase, updateLeaderboardUseCase } = setup();
    getAtomicAssetsUseCase.execute.mockResolvedValue(Result.withFailure('atomic down'));

    const output = await controller.update(makeInput([{ bagItems: ['1'] }]));

    expect(output.result.isFailure).toBe(true);
    expect(updateLeaderboardUseCase.execute).not.toHaveBeenCalled();
    expect(output.toResponse().status).toBe(500);
  });
});
