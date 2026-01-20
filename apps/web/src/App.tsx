import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTelegram } from './hooks/useTelegram';
import { authApi } from './api/auth';
import { Header } from './components/common';
import { BottomNav } from './components/layout';
import {
  WorkspaceSelector,
  ProjectList,
  BoardPage,
  TaskPage,
  CalendarPage,
  MyTasksPage,
  SettingsPage,
} from './pages';

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
      <div className="flex items-center justify-center min-h-screen bg-tg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button mx-auto mb-4"></div>
          <p className="text-tg-hint">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-tg-text">Welcome to Mini Tracker</h1>
          <p className="text-tg-hint">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-bg pb-16">
      <Header />
      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<WorkspaceSelector />} />
          <Route path="/workspace/:id" element={<ProjectList />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="/task/:id" element={<TaskPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<MyTasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
