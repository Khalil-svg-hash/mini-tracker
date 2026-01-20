// API Configuration
// Use environment variable if available, otherwise default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// State
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// DOM Elements
const taskList = document.getElementById('task-list');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const modalTitle = document.getElementById('modal-title');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');

// Initialize Telegram WebApp
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  
  // Apply Telegram theme colors
  applyTelegramTheme();
  
  // Enable closing confirmation
  tg.enableClosingConfirmation();
  
  console.log('✅ Telegram WebApp initialized');
} else {
  console.log('⚠️  Running in browser mode (not in Telegram)');
}

// Apply Telegram theme colors to CSS variables
function applyTelegramTheme() {
  if (!tg) return;
  
  const root = document.documentElement;
  const themeParams = tg.themeParams;
  
  if (themeParams.bg_color) {
    root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
  }
  if (themeParams.text_color) {
    root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
  }
  if (themeParams.hint_color) {
    root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
  }
  if (themeParams.link_color) {
    root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
  }
  if (themeParams.button_color) {
    root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
  }
  if (themeParams.button_text_color) {
    root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
  }
  if (themeParams.secondary_bg_color) {
    root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
  }
}

// Event Listeners
addTaskBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', () => closeModal());
cancelBtn.addEventListener('click', () => closeModal());
taskForm.addEventListener('submit', handleFormSubmit);

// Tab filters
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTasks();
  });
});

// Close modal when clicking outside
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) {
    closeModal();
  }
});

// API Functions
async function fetchTasks() {
  try {
    loading.style.display = 'block';
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    
    if (data.success) {
      tasks = data.tasks;
      renderTasks();
    } else {
      showError('Failed to load tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showError('Failed to connect to server. Make sure the API is running.');
  } finally {
    loading.style.display = 'none';
  }
}

async function createTask(taskData) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      tasks.push(data.task);
      renderTasks();
      closeModal();
      showSuccess('Task created!');
      
      // Send haptic feedback if in Telegram
      if (tg) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    } else {
      showError(data.message || 'Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    showError('Failed to create task');
  }
}

async function updateTask(id, taskData) {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks[index] = data.task;
      }
      renderTasks();
      closeModal();
      showSuccess('Task updated!');
      
      // Send haptic feedback if in Telegram
      if (tg) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    } else {
      showError(data.message || 'Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    showError('Failed to update task');
  }
}

async function deleteTask(id) {
  // Use Telegram popup if available, otherwise use native confirm
  const confirmDelete = async () => {
    return new Promise((resolve) => {
      if (tg && tg.showConfirm) {
        tg.showConfirm('Are you sure you want to delete this task?', (confirmed) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm('Are you sure you want to delete this task?'));
      }
    });
  };
  
  const confirmed = await confirmDelete();
  if (!confirmed) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
      showSuccess('Task deleted!');
      
      // Send haptic feedback if in Telegram
      if (tg) {
        tg.HapticFeedback.notificationOccurred('success');
      }
    } else {
      showError(data.message || 'Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showError('Failed to delete task');
  }
}

// UI Functions
function openModal(task = null) {
  editingTaskId = task ? task.id : null;
  
  if (task) {
    modalTitle.textContent = 'Edit Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-priority').value = task.priority;
  } else {
    modalTitle.textContent = 'New Task';
    taskForm.reset();
  }
  
  taskModal.classList.add('show');
  
  // Send haptic feedback if in Telegram
  if (tg) {
    tg.HapticFeedback.impactOccurred('light');
  }
}

function closeModal() {
  taskModal.classList.remove('show');
  taskForm.reset();
  editingTaskId = null;
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const taskData = {
    title: document.getElementById('task-title').value,
    description: document.getElementById('task-description').value,
    status: document.getElementById('task-status').value,
    priority: document.getElementById('task-priority').value
  };
  
  if (editingTaskId) {
    updateTask(editingTaskId, taskData);
  } else {
    createTask(taskData);
  }
}

function renderTasks() {
  const filteredTasks = currentFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === currentFilter);
  
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  taskList.innerHTML = filteredTasks.map(task => `
    <div class="task-card" data-id="${task.id}">
      <div class="task-header">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-actions">
          <button class="icon-btn" onclick="editTask(${task.id})" title="Edit">✏️</button>
          <button class="icon-btn" onclick="deleteTaskById(${task.id})" title="Delete">🗑️</button>
        </div>
      </div>
      ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      <div class="task-meta">
        <span class="badge badge-status ${task.status}">${formatStatus(task.status)}</span>
        <span class="badge badge-priority ${task.priority}">${task.priority}</span>
      </div>
    </div>
  `).join('');
}

function formatStatus(status) {
  const statusMap = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  };
  return statusMap[status] || status;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showSuccess(message) {
  // Simple console log for now - could be enhanced with toast notifications
  console.log('✅', message);
  
  // Show Telegram popup if available
  if (tg) {
    tg.showPopup({
      title: 'Success',
      message: message,
      buttons: [{ type: 'ok' }]
    });
  }
}

function showError(message) {
  console.error('❌', message);
  
  // Show Telegram popup if available
  if (tg) {
    tg.showPopup({
      title: 'Error',
      message: message,
      buttons: [{ type: 'ok' }]
    });
  } else {
    alert(message);
  }
}

// Global functions for inline event handlers
window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    openModal(task);
  }
};

window.deleteTaskById = function(id) {
  deleteTask(id);
};

// Initialize app
fetchTasks();

// Refresh tasks every 30 seconds
setInterval(fetchTasks, 30000);
