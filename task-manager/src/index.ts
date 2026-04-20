import * as readLine from 'readline-sync';
import { TaskManager } from './taskManager.js';
import 'reflect-metadata';
import { AiService } from './config/aiService.js';



const enableAi = true; //change to param from startup
const manager = new TaskManager(enableAi);


console.log("manager started");

while (true) {

    const input = readLine.question('\n What would you like to do? add / complete / list / quit\n').trim().toLowerCase();

    if ('quit' == input) {
       await manager.saveState();
        console.log('bye');
        break;
    }

    if('add' == input && enableAi) {
        const message = readLine.question('Describe your task(s): ');
        await manager.addTasksAi(message);
    }

    if ('add' == input && !enableAi) {
        const title = readLine.question('enter title: ');
        const description = readLine.question('enter description (optional): ');
        //trim out empty answer - maybe move this to 'add task' checks tbh
        const finalDescription = description ? description : undefined;

        const task = manager.addTask(title, finalDescription);

        console.log('added new task ' + task.title);
    } else if ('list' == input) {

        const allTasks = manager.getTasks();
        if (allTasks.length == 0) {
            console.log("no tasks found");
        } else {
            allTasks.forEach( t=> console.log(`[${t.status} : ${t.title}]`))
        }

    } else if('complete' == input){
        const title = readLine.question('enter title to complete: ');
        const completedTask = manager.completeTaskByTitle(title);
        if(completedTask !== undefined){
            console.log('completed task : ', completedTask.title);
        }
    }
    else {
        console.log('could not understand command. Try add / list / quit');
    }

}
