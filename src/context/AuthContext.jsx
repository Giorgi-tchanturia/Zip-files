import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('game_store_user', null);

  const login = (userData) => {
    setUser({
      username: userData?.username || userData?.email?.split('@')[0] || 'Player',
      email: userData?.email || '',
      avatar: userData?.avatar || null,
      token: userData?.token || 'simulated_jwt_token_123',
    });
  };

  const logout = () => {
    setUser(null);
  };

  // პროფილის განახლება (username და/ან ავატარი)
  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || null,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
