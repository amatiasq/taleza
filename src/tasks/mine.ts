import Cell from '../game/cell';
import World from '../world';
import AStar from '../pathfinding/a-star';
import {
  ITask,
  IWorker,
} from './task';
import Walk from './walk';

export default class Mine implements ITask {
  public priority = 0;
  protected _isCompleted = false;
  protected route: Walk;
  protected target: Cell;


  constructor(
    public pathfinding: AStar<Cell>,
    public destination: Cell,
  ) {
    this.route = new Walk(pathfinding, destination);
    this.target = destination;
  }


  get isCompleted() {
    return this._isCompleted;
  }

  isValidWorker(worker: IWorker): number {
    const walking = this.route.isValidWorker(worker);
    return walking === null ? 1 : walking;
  }

  assign(worker: IWorker): void {
    this.route.isValidWorker(worker)

    this.route.assign(worker);
  }

  step(map: World<Cell>, worker: IWorker): void {
    if (this.isCompleted)
      return;

    if (!this.route.isCompleted)
      return this.route.step(map, worker);

    this.target.floor = null;
    map.checkEntity(worker);
    this._isCompleted = true;
  }
}