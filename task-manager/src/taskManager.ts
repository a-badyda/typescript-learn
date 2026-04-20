import { Task } from './task.js';
import { TaskStatus } from './types.js';
import { AiService } from './config/aiService.js';


export class TaskManager {
  tasks: Task[] = Task.loadSavedTasks();
  private aiService?: AiService;

  constructor(useAI: boolean = false) {
    if (useAI) {
      try {
        this.aiService = new AiService();
        console.log('AI service initialized with Claude');
      } catch (error) {
        console.warn('AI initialization failed:', error);
        console.log('Continuing without AI features');
      }
    }
  }

  async addTasksAi(content: string) {
    if(undefined === this.aiService ) {
      console.log("not available w/o AI enabled")
    }
    else {
      console.log("asking llm");
      var parsed = await this.aiService.parseTasksFromInput(content);
          
      for(var i = 0; i < parsed.length; i ++) {
        if(parsed[i] !== undefined){
          this.addTask(parsed[i].title, parsed[i].description);
        }
      }
    }
  }


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