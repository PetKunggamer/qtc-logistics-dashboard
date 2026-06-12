import { NavLink } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { path: '/', icon: '📊', label: 'Dashboard', roles: ['admin','sales','logistics','driver','manager'] },
  { path: '/map', icon: '🗺️', label: 'Live Delivery Map', roles: ['admin','logistics','manager'] },
  { path: '/orders', icon: '📦', label: 'Order Tracking', roles: ['admin','sales','logistics','manager'] },
  { path: '/timeline', icon: '⏱️', label: 'Delivery Timeline', roles: ['admin','sales','logistics','manager'] },
  { path: '/delay', icon: '⚠️', label: 'Delay Analysis', roles: ['admin','logistics','manager'] },
  { path: '/pod', icon: '📸', label: 'Proof of Delivery', roles: ['admin','sales','logistics','manager'] },
  { path: '/fleet', icon: '🚚', label: 'Fleet Management', roles: ['admin','logistics','manager'] },
  { path: '/maintenance', icon: '🔧', label: 'Maintenance', roles: ['admin','logistics','manager'] },
  { path: '/sales', icon: '💼', label: 'Sales View', roles: ['admin','sales','manager'] },
  { path: '/kpi', icon: '📈', label: 'KPI Report', roles: ['admin','manager'] },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, userRole } = useApp();

  const filtered = navItems.filter(n => n.roles.includes(userRole));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out',
        'bg-slate-900 dark:bg-slate-950 border-r border-slate-700/50',
        sidebarOpen ? 'w-64' : 'w-16',
        'lg:relative lg:translate-x-0',
        !sidebarOpen && '-translate-x-full lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 px-4 h-16 border-b border-slate-700/50 shrink-0',
          !sidebarOpen && 'justify-center px-0',
        )}>
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-xl shrink-0">
            🚛
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm leading-tight">QTC Logistics</div>
              <div className="text-slate-400 text-xs">Control Tower</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {filtered.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group relative',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                !sidebarOpen && 'justify-center px-0',
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium truncate">{item.label}</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded
                  opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-medium truncate">QTC Logistics Co.</div>
                <div className="text-slate-500 text-xs">v1.0.0</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
