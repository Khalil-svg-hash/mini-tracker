import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { useAuth } from '../hooks/useAuth';
import type { Task } from '../types';

export function MyTasksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'updated'>('dueDate');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await tasksApi.getAll({ assigneeId: user.id, limit: 100 });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter !== 'all') {
      filtered = filtered.filter((task) => task.status === filter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  };

  const filteredTasks = getFilteredTasks();
  const counts = getTaskCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">Tasks assigned to you</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`p-4 text-center transition ${
                filter === 'all' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{counts.all}</div>
              <div className="text-sm text-gray-600">All Tasks</div>
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`p-4 text-center transition ${
                filter === 'todo' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-purple-600">{counts.todo}</div>
              <div className="text-sm text-gray-600">To Do</div>
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`p-4 text-center transition ${
                filter === 'in_progress' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-blue-600">{counts.in_progress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`p-4 text-center transition ${
                filter === 'done' ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-green-600">{counts.done}</div>
              <div className="text-sm text-gray-600">Done</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">Sort by:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('dueDate')}
                className={`px-4 py-2 rounded-lg transition ${
                  sortBy === 'dueDate'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Due Date
              </button>
              <button
                onClick={() => setSortBy('priority')}
                className={`px-4 py-2 rounded-lg transition ${
                  sortBy === 'priority'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Priority
              </button>
              <button
                onClick={() => setSortBy('updated')}
                className={`px-4 py-2 rounded-lg transition ${
                  sortBy === 'updated'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'No tasks assigned to you yet'
                  : `No ${filter.replace('_', ' ')} tasks`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.dueDate && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            new Date(task.dueDate) < new Date()
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.board && (
                        <span className="text-xs text-gray-500">
                          {task.board.project?.name} / {task.board.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.column && (
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {task.column.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
