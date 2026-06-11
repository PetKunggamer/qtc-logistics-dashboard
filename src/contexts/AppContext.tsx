import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '../types';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  unreadNotifications: number;
  setUnreadNotifications: (n: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  const userNames: Record<UserRole, string> = {
    admin: 'Admin ระบบ',
    sales: 'คุณเมย์ (Sales)',
    logistics: 'คุณแจ็ค (Logistics)',
    driver: 'สมชาย (Driver)',
    manager: 'คุณสมศักดิ์ (Manager)',
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      userRole,
      setUserRole,
      userName: userNames[userRole],
      sidebarOpen,
      setSidebarOpen,
      unreadNotifications,
      setUnreadNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
