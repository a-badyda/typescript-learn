/// <reference types="jest" />
import { TaskManager } from '../src/taskManager.js';

describe('TaskManager', () => {
  let manager: TaskManager;

  beforeEach(() => {
    manager = new TaskManager(false); 
  });

  test('should add a new task', () => {
    const task = manager.addTask('Test Task', 'Description');
    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('pending'); 
  });

  test('should complete a task by ID', () => {
    const task = manager.addTask('Task 1');
    const result = manager.completeTask(task.id);
    expect(result).toBe(true);
  });

  test('should return undefined when completing non-existent task', () => {
    const result = manager.completeTaskByTitle('Non Existent');
    expect(result).toBeUndefined();
  });
});