import GameMap, {
  ICell,
  IEntity,
} from '../map';
import {
  ITask,
  IWorker,
} from '../tasks/task';
import Cell from './cell';
import TaskManager from './task-manager';


export default class Gnome implements IWorker, IEntity<Cell> {
  protected workingOn: ITask;
  public location: Cell;
  public view: any;


  get isIdle(): boolean {
    return !this.workingOn;
  }


  assignTask(task: ITask): void {
    this.workingOn = task;
  }

  update(map: GameMap<Cell>, tasks: TaskManager): void {
    if (this.isIdle) {
      tasks.addIdle(this);
      return;
    }

    this.workingOn.step(map, this);

    if (this.workingOn.isCompleted)
      this.workingOn = null;
  }
}
