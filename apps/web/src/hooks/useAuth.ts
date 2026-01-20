import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { token, user, isAuthenticated, login, logout, setUser } = useAuthStore();

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
  };
};
