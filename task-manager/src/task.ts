import jsonObject from '../resources/tasks.json' with { type: 'json' };
import { TaskStatus } from './types.js';
import { plainToInstance } from 'class-transformer';
import { writeFile } from 'fs/promises';
import path from 'path';

export class Task {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  createdAt!: Date;
  completedAt?: Date;

  static loadSavedTasks() {
    const temp = plainToInstance(Task, jsonObject);
    console.log("tasks loaded");
    return temp;
 }
 
static async saveTasksToFile(tasks: Task[]) {
  // Use import.meta.dirname instead of __dirname
  const filePath = path.resolve(import.meta.dirname, '../resources/tasks.json');
  
  await writeFile(filePath, JSON.stringify(tasks, null, 4), 'utf8');
  console.log(`Data written to tasks.json file as JSON.`);
}
}
