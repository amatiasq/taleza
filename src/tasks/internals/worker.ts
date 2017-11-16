import { Cell, TaskManager } from '../../game';
import World, { IEntity } from '../../world';
import {ITask} from './task';

export interface IWorker extends IEntity<Cell> {
  assignTask(task: ITask): void;
  update(map: World<Cell>, tasks: TaskManager): void;
}