import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTelegram } from './hooks/useTelegram';
import { authApi } from './api/auth';

function App() {
  const { isAuthenticated, login } = useAuth();
  const { initData, isReady } = useTelegram();

  useEffect(() => {
    const authenticate = async () => {
      if (isReady && initData && !isAuthenticated) {
        try {
          const response = await authApi.authenticateWithTelegram(initData);
          login(response.token, response.user);
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }
    };

    authenticate();
  }, [isReady, initData, isAuthenticated, login]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Mini Tracker</h1>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/workspaces" replace />} />
        <Route
          path="/workspaces"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Workspaces</h1>
              <p className="text-gray-600 mt-2">Workspace list coming soon...</p>
            </div>
          }
        />
        <Route
          path="/workspaces/:workspaceId"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Workspace Details</h1>
              <p className="text-gray-600 mt-2">Workspace details coming soon...</p>
            </div>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Project Details</h1>
              <p className="text-gray-600 mt-2">Project details coming soon...</p>
            </div>
          }
        />
        <Route
          path="/boards/:boardId"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Board</h1>
              <p className="text-gray-600 mt-2">Board view coming soon...</p>
            </div>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Task Details</h1>
              <p className="text-gray-600 mt-2">Task details coming soon...</p>
            </div>
          }
        />
        <Route
          path="/calendar"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-gray-600 mt-2">Calendar view coming soon...</p>
            </div>
          }
        />
        <Route
          path="/notifications"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-gray-600 mt-2">Notifications coming soon...</p>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
