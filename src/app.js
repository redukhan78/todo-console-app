const readlineSync = require('readline-sync');
const AuthController = require('./controllers/authController');
const TaskController = require('./controllers/taskController');
require('dotenv').config();

let currentUser = null;

function showMainMenu() {
    console.log('\n╔════════════════════════════════╗');
    console.log('║   Welcome to Todo App          ║');
    console.log('╚════════════════════════════════╝');
    console.log('\n1. Register');
    console.log('2. Login');
    console.log('3. Exit\n');
}

function showTaskMenu() {
    console.log('\n╔════════════════════════════════╗');
    console.log('║   Todo Menu                    ║');
    console.log('╚════════════════════════════════╝');
    console.log('\n1. Add Task');
    console.log('2. View All Tasks');
    console.log('3. Edit Task');
    console.log('4. Delete Task');
    console.log('5. Search Tasks');
    console.log('6. Logout\n');
}

async function handleMainMenu() {
    showMainMenu();
    const choice = readlineSync.question('Enter your choice: ');

    switch (choice) {
        case '1':
            await AuthController.register();
            break;
        case '2':
            const user = await AuthController.login();
            if (user) {
                currentUser = user;
                await handleTaskMenu();
            }
            break;
        case '3':
            console.log('\nGoodbye! 👋\n');
            process.exit(0);
        default:
            console.log('\nInvalid choice. Please try again.\n');
    }
}

async function handleTaskMenu() {
    while (currentUser) {
        showTaskMenu();
        const choice = readlineSync.question('Enter your choice: ');

        switch (choice) {
            case '1':
                await TaskController.addTask(currentUser.id);
                break;
            case '2':
                await TaskController.viewTasks(currentUser.id);
                break;
            case '3':
                await TaskController.editTask(currentUser.id);
                break;
            case '4':
                await TaskController.deleteTask(currentUser.id);
                break;
            case '5':
                await TaskController.searchTasks(currentUser.id);
                break;
            case '6':
                console.log('\n✅ Logged out successfully!\n');
                currentUser = null;
                return;
            default:
                console.log('\nInvalid choice. Please try again.\n');
        }
    }
}

async function main() {
    console.log('\n🚀 Starting Todo App...\n');

    // Test database connection
    try {
        const db = require('./config/database');
        await db.query('SELECT 1');
        console.log('✅ Database connected successfully!\n');
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
        console.log('Please check your database configuration in .env file\n');
        process.exit(1);
    }

    while (true) {
        await handleMainMenu();
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    process.exit(0);
});

main();