import {
  ITask,
  IWorker
} from '../tasks/task';

export default class TaskManager {
  protected tasks = [] as Array<ITask>;
  protected idles = new Set<IWorker>();


  get hasJobs(): boolean {
    return Boolean(this.tasks.length);
  }

  get hasWorkers(): boolean {
    return Boolean(this.idles.size);
  }


  addIdle(worker: IWorker): void {
    this.idles.add(worker);
  }

  addTask(task: ITask): void {
    // TODO: usar un heap
    let i;
    for (i = 0; i < this.tasks.length; i++)
      if (this.tasks[i].priority < task.priority)
        break;
    this.tasks.splice(i, 0, task);
  }

  assign() {
    if (!this.hasJobs || !this.hasWorkers)
      return;

    const remove = new Set<ITask>();

    for (const task of this.tasks) {
      let chosen;
      let bestValidity = 0;

      for (const worker of this.idles) {
        const validity = task.isValidWorker(worker);

        if (validity > bestValidity) {
          chosen = worker;
          bestValidity = validity;
        }
      }

      if (chosen) {
        task.assign(chosen);
        chosen.assignTask(task);
        this.idles.delete(chosen);
        remove.add(task);
      }
    }

    this.tasks = this.tasks.filter(task => !remove.has(task));
    if (!this.tasks.length)
      return;

    const message = this.tasks.map(task => task.toString());
    console.log(`No one can:\n\t${message.join('\n\t')}`);
  }
}
