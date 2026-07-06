const Task = require('../models/Task');
const readlineSync = require('readline-sync');

class TaskController {
    static async addTask(userId) {
        console.log('\n=== Add New Task ===\n');

        const title = readlineSync.question('Enter task title: ');
        if (!title || title.trim() === '') {
            console.log('Task title cannot be empty.');
            return;
        }

        const description = readlineSync.question('Enter task description: ');
        const dueDate = readlineSync.question('Enter due date (YYYY-MM-DD): ');
        // Simple date validation
        if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            console.log('Invalid date format. Please use YYYY-MM-DD.');
            return;
        }

        let priority = readlineSync.question('Enter priority (Low/Medium/High): ');
        priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        if (!['Low', 'Medium', 'High'].includes(priority)) {
            console.log('Invalid priority. Must be Low, Medium, or High.');
            return;
        }

        const taskId = await Task.create(userId, title, description, dueDate || null, priority);
        console.log('\n✅ Task added successfully!\n');

        // Display the added task
        const task = await Task.findById(taskId, userId);
        if (task) {
            console.log('Task Data');
            console.log('---------');
            console.log(`Task ID: ${task.id}`);
            console.log(`Title: ${task.title}`);
            console.log(`Description: ${task.description || 'N/A'}`);
            console.log(`Due Date: ${task.due_date || 'N/A'}`);
            console.log(`Priority: ${task.priority}`);
            console.log(`Status: ${task.status}\n`);
        }
    }

    static async viewTasks(userId) {
        console.log('\n=== Your Tasks ===\n');

        const tasks = await Task.findByUserId(userId);

        if (tasks.length === 0) {
            console.log('No tasks found.\n');
            return;
        }

        tasks.forEach(task => {
            console.log(`ID: ${task.id}`);
            console.log(`Title: ${task.title}`);
            console.log(`Due Date: ${task.due_date || 'N/A'}`);
            console.log(`Priority: ${task.priority}`);
            console.log(`Status: ${task.status}`);
            console.log('---');
        });
        console.log();
    }

    static async editTask(userId) {
        console.log('\n=== Edit Task ===\n');

        const taskId = parseInt(readlineSync.question('Enter task ID to edit: '));
        if (isNaN(taskId)) {
            console.log('Invalid task ID.\n');
            return;
        }

        const task = await Task.findById(taskId, userId);
        if (!task) {
            console.log('Task not found.\n');
            return;
        }

        console.log(`\nCurrent Title: ${task.title}`);
        const newTitle = readlineSync.question('Enter new title (press Enter to keep current): ');

        console.log(`Current Description: ${task.description || 'N/A'}`);
        const newDescription = readlineSync.question('Enter new description (press Enter to keep current): ');

        console.log(`Current Due Date: ${task.due_date || 'N/A'}`);
        const newDueDate = readlineSync.question('Enter new due date (YYYY-MM-DD, press Enter to keep current): ');
        if (newDueDate && !/^\d{4}-\d{2}-\d{2}$/.test(newDueDate)) {
            console.log('Invalid date format. Please use YYYY-MM-DD.');
            return;
        }

        console.log(`Current Priority: ${task.priority}`);
        let newPriority = readlineSync.question('Enter new priority (Low/Medium/High, press Enter to keep current): ');
        if (newPriority) {
            newPriority = newPriority.charAt(0).toUpperCase() + newPriority.slice(1).toLowerCase();
            if (!['Low', 'Medium', 'High'].includes(newPriority)) {
                console.log('Invalid priority. Must be Low, Medium, or High.');
                return;
            }
        }

        const updates = {};
        if (newTitle) updates.title = newTitle;
        if (newDescription !== '') updates.description = newDescription;
        if (newDueDate) updates.due_date = newDueDate;
        if (newPriority) updates.priority = newPriority;

        if (Object.keys(updates).length === 0) {
            console.log('No changes made.\n');
            return;
        }

        await Task.update(taskId, userId, updates);
        console.log('\n✅ Task updated successfully!\n');
    }

    static async deleteTask(userId) {
        console.log('\n=== Delete Task ===\n');

        const taskId = parseInt(readlineSync.question('Enter task ID to delete: '));
        if (isNaN(taskId)) {
            console.log('Invalid task ID.\n');
            return;
        }

        const task = await Task.findById(taskId, userId);
        if (!task) {
            console.log('Task not found.\n');
            return;
        }

        const confirm = readlineSync.question('Are you sure you want to delete this task? (yes/no): ');
        if (confirm.toLowerCase() !== 'yes') {
            console.log('Delete cancelled.\n');
            return;
        }

        await Task.delete(taskId, userId);
        console.log('\n✅ Task deleted successfully!\n');
    }

    static async searchTasks(userId) {
        console.log('\n=== Search Tasks ===\n');

        const keyword = readlineSync.question('Enter search keyword: ');
        if (!keyword || keyword.trim() === '') {
            console.log('Please enter a search keyword.\n');
            return;
        }

        const tasks = await Task.search(userId, keyword);

        console.log('\nSearch Result:');
        console.log('-------------');

        if (tasks.length === 0) {
            console.log('No matching tasks found.\n');
            return;
        }

        tasks.forEach(task => {
            console.log(`ID: ${task.id}`);
            console.log(`Title: ${task.title}`);
            console.log(`Due Date: ${task.due_date || 'N/A'}`);
            console.log(`Priority: ${task.priority}`);
            console.log(`Status: ${task.status}`);
            console.log('---');
        });
        console.log();
    }
}

module.exports = TaskController;