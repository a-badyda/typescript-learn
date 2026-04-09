import { Task } from './task.js';
import { TaskStatus } from './types.js';


export class TaskManager {
  tasks: Task[] = Task.loadSavedTasks();


  addTask(title: string, description?: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      ...(description !== undefined && { description }),
      status: TaskStatus.PENDING,
      createdAt: new Date()
    };

    this.tasks.push(task);
    return task;
  }

  completeTaskByTitle(title: string): Task | undefined {
    const task = this.getTasks(TaskStatus.PENDING).find(t => t.title === title);

    if (task === undefined) {
      console.log('can\'t find task with title' + title);
      return undefined;
    } else {
      task.status = TaskStatus.COMPLETED;
      task.completedAt = new Date();
      return task;
    }
  }

  //run this every time program is initalised? maybe every X  mins while it's running
  archiveAllCompletedTasks() {
    const allCompleted = this.getTasks(TaskStatus.COMPLETED);
    allCompleted.forEach(t => t.status = TaskStatus.ARCHIVED);
  }


  getTasks(status?: TaskStatus): Task[] {
    return status ? this.tasks.filter(t => t.status === status).sort().reverse() : this.tasks.sort().reverse();
  }

  completeTask(id: string): boolean {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return false;
    task.status = TaskStatus.COMPLETED;
    task.completedAt = new Date();
    return true;
  }

  async saveState() {
    await Task.saveTasksToFile(this.tasks);
  }
}