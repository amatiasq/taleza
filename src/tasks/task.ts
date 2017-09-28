import Cell from '../game/cell';
import TaskManager from '../game/task-manager';
import GameMap, { IEntity } from '../map';
import AStar from '../pathfinding/a-star';

export interface ITask {
  priority: number;
  readonly isCompleted: boolean;
  // new (pathfinding: AStar<Cell>, destination: Cell): ITask;

  // Should return a value between 1 and 0.
  // 1 means the best worker for the job
  // 0 means he can't do it
  isValidWorker(worker: IWorker): number;

  assign(worker: IWorker): void;
  step(map: GameMap<Cell>, worker: IWorker): void;
}


export interface IWorker extends IEntity<Cell> {
  assignTask(task: ITask): void;
  update(map: GameMap<Cell>, tasks: TaskManager): void;
}