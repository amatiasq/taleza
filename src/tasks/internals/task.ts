import { Cell, TaskManager } from '../../game';
import { AStar } from '../../pathfinding';
import World, { IEntity } from '../../world';
import { IWorker } from './worker';

export interface ITask {
  priority: number;
  readonly isCompleted: boolean;
  // new (pathfinding: AStar<Cell>, destination: Cell): ITask;

  // Should return a value between 1 and 0.
  // 1 means the best worker for the job
  // 0 means he can't do it
  isValidWorker(worker: IWorker): number;

  assign(worker: IWorker): void;
  step(map: World<Cell>, worker: IWorker): void;
}
