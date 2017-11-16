import {
  MAX_WALK_DISTANCE,
  SHOW_WALKING_PATH,
} from '../constants';
import Cell from '../game/cell';
import AStar from '../pathfinding/a-star';
import World from '../world';
import {
  ITask,
  IWorker,
} from './task';

export default class Walk implements ITask {
  public priority = 0;
  protected _isCompleted = false;
  private path: Cell[];
  private stepIndex: number;


  constructor(
    public pathfinding: AStar<Cell>,
    public destination: Cell,
  ) {}


  get isCompleted() {
    return this._isCompleted;
  }


  isValidWorker(worker: IWorker): number {
    // TODO: consider ramps, target should not move if he is on a ramp and target is empty cell above
    const distance = this.pathfinding.getDistance(world.get(worker.location), this.destination);
    if (distance === 0) return null;
    return (MAX_WALK_DISTANCE - distance) / MAX_WALK_DISTANCE;
  }

  assign(worker: IWorker): void {
    this.path = this.pathfinding.calculate(world.get(worker.location), this.destination);
    if (!this.path)
      throw new Error(`Can't find path for ${this}`);

    this.stepIndex = 0;

    if (SHOW_WALKING_PATH)
      for (const cell of this.path)
        cell.view.forceColor = 0x555555;
  }

  step(map: GameMap<Cell>, worker: IWorker): void {
    if (!this.path)
      throw new Error('Trying to execute walk.step() without assignation');

    if (this.isCompleted)
      return;

    const target = this.path[this.stepIndex];
    map.moveEntity(worker, target);
    this.stepIndex++;

    if (this.stepIndex === this.path.length) {
      this._isCompleted = true;

      if (SHOW_WALKING_PATH)
        for (const cell of this.path)
          cell.view.forceColor = null;
    }
  }

  toString(): string {
    return `Walk to ${this.destination}`;
  }
}
