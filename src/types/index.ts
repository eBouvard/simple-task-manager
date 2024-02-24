export enum TaskStatus {
  Pending = 'pending',
  RunningWork = 'running_work',
  RunningBreak = 'running_break',
  Completed = 'completed',
}

export interface TaskData {
  id: number;
  name: string;
  duration: number;
  startedAt?: number;
}

export class Task {
  id: number;
  name: string;
  duration: number;
  startedAt?: number;

  constructor(task: TaskData) {
    this.id = task.id;
    this.name = task.name;
    this.duration = task.duration;
    this.startedAt = task.startedAt;
  }

  get elapsedTime() {
    return Date.now() - (this.startedAt ?? Date.now());
  }

  get status() {
    if (this.elapsedTime > 2 * this.duration) return TaskStatus.Completed;
    if (this.elapsedTime > this.duration) return TaskStatus.RunningBreak;
    if (this.elapsedTime > 0) return TaskStatus.RunningWork;
    return TaskStatus.Pending;
  }

  get remainingTime() {
    switch (this.status) {
      case TaskStatus.Pending:
      case TaskStatus.Completed:
        return 0;
      case TaskStatus.RunningWork:
        return this.duration - Date.now() + (this.startedAt ?? 0);
      case TaskStatus.RunningBreak:
        return 2 * this.duration - Date.now() + (this.startedAt ?? 0);
    }
  }

  toTaskData = () =>
    ({
      id: this.id,
      name: this.name,
      duration: this.duration,
      startedAt: this.startedAt,
    }) as TaskData;
}
