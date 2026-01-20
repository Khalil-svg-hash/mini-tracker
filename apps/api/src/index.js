import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [];
let nextId = 1;

// Initialize Telegram Bot (only if token is provided)
let bot = null;
if (process.env.TELEGRAM_BOT_TOKEN) {
  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    console.log('✅ Telegram Bot initialized');
  } catch (error) {
    console.error('⚠️  Failed to initialize Telegram Bot:', error.message);
    console.log('Continuing without Telegram Bot integration...');
  }
} else {
  console.log('⚠️  TELEGRAM_BOT_TOKEN not set. Bot features will be disabled.');
}

// Helper function to create task object
function createTask(data) {
  return {
    id: nextId++,
    title: data.title || 'Untitled Task',
    description: data.description || '',
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// API Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Mini Tracker API is running',
    version: '1.0.0',
    endpoints: {
      tasks: {
        list: 'GET /tasks',
        create: 'POST /tasks',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id'
      }
    }
  });
});

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  const { status, priority } = req.query;
  
  let filteredTasks = [...tasks];
  
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  res.json({
    success: true,
    count: filteredTasks.length,
    tasks: filteredTasks
  });
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  try {
    const task = createTask(req.body);
    tasks.push(task);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body,
    id: tasks[taskIndex].id, // Prevent ID change
    createdAt: tasks[taskIndex].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    task: updatedTask
  });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Task deleted successfully',
    task: deletedTask
  });
});

// Telegram Bot Commands (if bot is initialized)
if (bot) {
  // Set bot commands
  bot.setMyCommands([
    { command: 'start', description: 'Start the Mini Tracker app' },
    { command: 'tasks', description: 'View all tasks' },
    { command: 'help', description: 'Show help information' }
  ]).catch(err => console.error('Failed to set bot commands:', err));

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:5173';
    
    bot.sendMessage(chatId, 
      '👋 Welcome to Mini Tracker!\n\n' +
      'A lightweight task management system for small teams.\n\n' +
      'Click the button below to open the app:',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '📱 Open Mini Tracker', web_app: { url: webAppUrl } }
          ]]
        }
      }
    );
  });

  // Handle /tasks command
  bot.onText(/\/tasks/, (msg) => {
    const chatId = msg.chat.id;
    
    if (tasks.length === 0) {
      bot.sendMessage(chatId, '📝 No tasks yet. Create your first task!');
      return;
    }
    
    const taskList = tasks.map(task => {
      const statusEmoji = task.status === 'done' ? '✅' : task.status === 'in-progress' ? '🔄' : '📋';
      return `${statusEmoji} *${task.title}* (${task.priority})\n   ${task.description || 'No description'}`;
    }).join('\n\n');
    
    bot.sendMessage(chatId, `📋 *Your Tasks:*\n\n${taskList}`, { parse_mode: 'Markdown' });
  });

  // Handle /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId,
      '🤖 *Mini Tracker Help*\n\n' +
      '/start - Open the Mini Tracker app\n' +
      '/tasks - View all your tasks\n' +
      '/help - Show this help message\n\n' +
      'Use the web app to create and manage tasks!',
      { parse_mode: 'Markdown' }
    );
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mini Tracker API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});
