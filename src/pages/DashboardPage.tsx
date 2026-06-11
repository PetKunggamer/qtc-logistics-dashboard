import Layout from '../components/layout/Layout';
import { KPICard } from '../components/ui/Card';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { getKPIData, getDelayStats, getDailyDeliveryData, getMonthlyData, recentActivities, orders, vehicles } from '../data/mockData';
import { formatCurrency, timeAgo, ORDER_STATUS_LABEL, VEHICLE_STATUS_LABEL } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6','#f59e0b','#ef4444','#10b981','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

export default function DashboardPage() {
  const kpi = getKPIData();
  const delayStats = getDelayStats();
  const dailyData = getDailyDeliveryData();
  const monthlyData = getMonthlyData();
  const { theme } = useApp();
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';

  // Order status counts for pie
  const statusCounts = (['in_transit','near_customer','delivered','delayed','pending','preparing','loaded','cancelled'] as const).map(s => ({
    name: ORDER_STATUS_LABEL[s],
    value: orders.filter(o => o.status === s).length,
    color: PIE_COLORS[['in_transit','near_customer','delivered','delayed','pending','preparing','loaded','cancelled'].indexOf(s)],
  })).filter(s => s.value > 0);

  // Vehicle utilization
  const vehicleUtil = (['available','in_transit','idle','maintenance','out_of_service'] as const).map(s => ({
    name: VEHICLE_STATUS_LABEL[s],
    value: vehicles.filter(v => v.status === s).length,
    color: [PIE_COLORS[3], PIE_COLORS[0], PIE_COLORS[1], PIE_COLORS[2], '#94a3b8'][['available','in_transit','idle','maintenance','out_of_service'].indexOf(s)],
  })).filter(v => v.value > 0);

  const onTimeVsDelay = [
    { name: 'ตรงเวลา', value: Math.round(orders.filter(o => o.status === 'delivered' && !o.delayReason).length), fill: '#10b981' },
    { name: 'ล่าช้า', value: orders.filter(o => o.delayReason).length, fill: '#ef4444' },
  ];

  return (
    <Layout title="Dashboard Overview">
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Orders Today" value={kpi.ordersToday} icon="📋" color="blue" subtitle="วันนี้" trend={{ value: 12, label: 'vs เมื่อวาน' }} />
          <KPICard title="In Transit" value={kpi.ordersInTransit} icon="🚚" color="amber" subtitle="กำลังขนส่ง" />
          <KPICard title="Delivered" value={kpi.ordersDelivered} icon="✅" color="emerald" subtitle="ส่งสำเร็จแล้ว" trend={{ value: 8, label: 'vs เดือนที่แล้ว' }} />
          <KPICard title="Delayed" value={kpi.ordersDelayed} icon="⚠️" color="red" subtitle="ล่าช้า" trend={{ value: -5, label: 'vs เดือนที่แล้ว' }} />
          <KPICard title="On-Time Delivery" value={`${kpi.onTimeRate}%`} icon="⏱️" color="emerald" subtitle="อัตราส่งตรงเวลา" trend={{ value: 2.3, label: 'vs เดือนที่แล้ว' }} />
          <KPICard title="Transport Cost" value={formatCurrency(kpi.transportCost)} icon="💰" color="violet" subtitle="ค่าขนส่งเดือนนี้" />
          <KPICard title="Active Vehicles" value={kpi.activeVehicles} icon="🚛" color="cyan" subtitle={`จากทั้งหมด ${vehicles.length} คัน`} />
          <KPICard title="In Maintenance" value={kpi.vehiclesInMaintenance} icon="🔧" color="orange" subtitle="รถเข้าซ่อม" />
        </div>

        {/* Row 1: Status pie + On-Time bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Order Status</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {statusCounts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusCounts.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400 flex-1">{s.name}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">On-Time vs Delay</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={onTimeVsDelay} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Bar dataKey="value" name="รายการ" radius={[6, 6, 0, 0]}>
                  {onTimeVsDelay.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Daily + Monthly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Daily Delivery (6 วันล่าสุด)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
                <Line type="monotone" dataKey="delivered" name="ส่งสำเร็จ" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="delayed" name="ล่าช้า" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Monthly Delivery</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
                <Bar dataKey="delivered" name="ทั้งหมด" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" name="ตรงเวลา" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Delay reasons + Vehicle util */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">สาเหตุการล่าช้า</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={delayStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Bar dataKey="count" name="จำนวน" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Vehicle Utilization</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={vehicleUtil} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                    {vehicleUtil.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {vehicleUtil.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: v.color }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400 flex-1">{v.name}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">{v.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm">Recent Activities</h3>
            <button onClick={() => navigate('/orders')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">ดูทั้งหมด →</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-white font-medium">{activity.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">{timeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
