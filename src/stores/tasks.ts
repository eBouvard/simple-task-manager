import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { Task, TaskData, TaskStatus } from '../types';

type TaskState = {
  stateId: number;
  tasks: Task[];
  runningTaskId: number | null;
  lastTaskCompletedAt: number;
  lastTaskRunCompletedAt: number;
};

type StorableTaskState = {
  stateId: number;
  tasks: TaskData[];
  runningTaskId: number | null;
  lastTaskCompletedAt: number;
  lastTaskRunCompletedAt: number;
};

function restoreTaskState(state: StorableTaskState): TaskState {
  const tasks = state.tasks.map((task) => new Task(task));
  return {
    stateId: state.stateId,
    tasks,
    runningTaskId: state.runningTaskId,
    lastTaskCompletedAt: state.lastTaskCompletedAt,
    lastTaskRunCompletedAt: state.lastTaskRunCompletedAt,
  };
}

export const useTasks = defineStore('tasks', {
  state: (): TaskState => {
    const localState = LocalStorage.getItem('tasks') as
      | StorableTaskState
      | undefined;
    if (localState) return restoreTaskState(localState);
    return {
      stateId: 0,
      tasks: [],
      runningTaskId: null,
      lastTaskCompletedAt: 0,
      lastTaskRunCompletedAt: 0,
    };
  },
  actions: {
    addTask(name: string, duration: number) {
      const lastTaskID = this.tasks[this.tasks.length - 1]?.id ?? 0;
      const task: Task = new Task({
        id: lastTaskID + 1,
        name,
        duration,
      });
      const newTasks = [...this.tasks, task];
      this.$patch({ tasks: newTasks });
    },
    startTask(taskId: number) {
      const runningTask = this.getRunningTask;
      if (
        runningTask &&
        (runningTask.status == TaskStatus.RunningWork ||
          runningTask.status == TaskStatus.RunningBreak)
      ) {
        return;
      }
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      const newTasks = [...this.tasks];
      newTasks[taskIndex].startedAt = Date.now();
      this.$patch({
        runningTaskId: taskId,
        tasks: newTasks,
      });
      this.updateRunningTask();
    },
    finishCurrentTaskEarly() {
      const runningTask = this.getRunningTask;
      if (!runningTask) return;
      const taskIndex = this.tasks.findIndex(
        (task) => task.id === runningTask.id,
      );
      const newTasks = [...this.tasks];
      if (runningTask.status === TaskStatus.RunningWork) {
        newTasks[taskIndex].duration = runningTask.elapsedTime;
      } else if (runningTask.status === TaskStatus.RunningBreak) {
        newTasks[taskIndex].startedAt = Date.now() - 2 * runningTask.duration;
      }
      this.$patch({
        tasks: newTasks,
      });
      this.updateRunningTask();
    },
    updateRunningTask() {
      this.$patch({ stateId: Math.random() });
      const runningTask = this.getRunningTask;
      if (!runningTask) return;
      if (runningTask.status === TaskStatus.Completed) {
        this.$patch({
          lastTaskCompletedAt: Date.now(),
          runningTaskId: null,
        });
        return;
      }
      if (runningTask.status === TaskStatus.RunningBreak) {
        this.$patch({ lastTaskRunCompletedAt: Date.now() });
      }
      setTimeout(() => {
        this.updateRunningTask();
      }, runningTask.remainingTime + 1);
    },
  },
  getters: {
    getTask: (state) => {
      return (taskId?: number) =>
        state.tasks.find((task) => task.id === taskId);
    },
    getRunningTask(state): Task | null {
      if (state.runningTaskId) {
        const runningTask = this.getTask(state.runningTaskId);
        if (runningTask) {
          return runningTask;
        }
      }
      return null;
    },
    getTasksSortedByStatus(state): Task[] {
      const tasks = state.tasks as Task[];
      const finishedTasks = [] as Task[];
      const runningTasks = [] as Task[];
      const pendingTasks = [] as Task[];
      for (const task of tasks) {
        if (task.status === TaskStatus.Completed) {
          finishedTasks.push(task);
        } else if (task.status === TaskStatus.Pending) {
          pendingTasks.push(task);
        } else {
          runningTasks.push(task);
        }
      }
      return [...finishedTasks, ...runningTasks, ...pendingTasks] as Task[];
    },
  },
});
