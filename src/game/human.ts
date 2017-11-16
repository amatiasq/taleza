import { ITask, IWorker } from '../tasks/task';
import World, { IEntity } from '../world';
import Cell from './cell';
import TaskManager from './task-manager';

export default class Human implements IWorker, IEntity<Cell> {
  protected workingOn: ITask;
  public location: Cell;
  public view: any;


  get isIdle(): boolean {
    return !this.workingOn;
  }


  assignTask(task: ITask): void {
    this.workingOn = task;
  }

  update(map: World<Cell>, tasks: TaskManager): void {
    if (this.isIdle) {
      tasks.addIdle(this);
      return;
    }

    this.workingOn.step(map, this);

    if (this.workingOn.isCompleted)
      this.workingOn = null;
  }
}
