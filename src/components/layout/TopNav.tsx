import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { notifications } from '../../data/mockData';
import { timeAgo } from '../../utils/helpers';
import type { UserRole } from '../../types';

const roles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: '🔑 Admin' },
  { value: 'manager', label: '👔 Manager' },
  { value: 'logistics', label: '🚚 Logistics' },
  { value: 'sales', label: '💼 Sales' },
  { value: 'driver', label: '🚛 Driver' },
];

export default function TopNav({ title }: { title?: string }) {
  const { sidebarOpen, setSidebarOpen, theme, toggleTheme, userRole, setUserRole, userName, unreadNotifications, setUnreadNotifications } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const handleNotifOpen = () => {
    setShowNotif(v => !v);
    setShowUser(false);
    setUnreadNotifications(0);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center px-4 gap-4 shrink-0 relative z-10">
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      {title && (
        <h1 className="text-slate-800 dark:text-white font-semibold text-lg hidden sm:block">{title}</h1>
      )}

      {/* Live indicator */}
      <div className="hidden md:flex items-center gap-2 ml-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs text-slate-500 dark:text-slate-400">Live Update</span>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Role selector */}
        <select
          value={userRole}
          onChange={e => setUserRole(e.target.value as UserRole)}
          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 hidden md:block"
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotifOpen}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-white text-sm">การแจ้งเตือน</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{notifications.length} รายการ</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <div className="flex gap-3">
                      <span className="text-xl shrink-0">{n.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 dark:text-white">{n.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{n.message}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo(n.timestamp)}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">ดูทั้งหมด</button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-slate-800 dark:text-white truncate max-w-28">{userName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</div>
            </div>
          </button>

          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-800 dark:text-white">{userName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">petkunggamer@gmail.com</div>
              </div>
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => { setUserRole(r.value); setShowUser(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${userRole === r.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotif || showUser) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotif(false); setShowUser(false); }} />
      )}
    </header>
  );
}
