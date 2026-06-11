import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { getKPIData, orders, drivers, vehicles, getMonthlyData } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';

export default function KPIReportPage() {
  const kpi = getKPIData();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';

  const [dateRange, setDateRange] = useState('month');
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

  const monthlyData = getMonthlyData();

  // Driver performance
  const driverPerformance = drivers.slice(0, 8).map(d => ({
    name: d.name.split(' ')[0],
    deliveries: d.totalDeliveries,
    onTime: d.onTimeRate,
  }));

  // Sales performance
  const salesPerf = [...new Set(orders.map(o => o.salesName))].map(name => {
    const salesOrders = orders.filter(o => o.salesName === name);
    return {
      name: name.replace('คุณ', ''),
      orders: salesOrders.length,
      delivered: salesOrders.filter(o => o.status === 'delivered').length,
      revenue: Math.round(salesOrders.reduce((a, o) => a + o.totalAmount, 0) / 1000),
    };
  });

  type StatusKey = 'good' | 'warning' | 'bad';
  // KPI metrics for display
  const kpiMetrics: Array<{ label: string; value: string; target: string; status: StatusKey; icon: string }> = [
    { label: 'On-Time Delivery Rate', value: `${kpi.onTimeRate}%`, target: '95%', status: (kpi.onTimeRate >= 95 ? 'good' : kpi.onTimeRate >= 85 ? 'warning' : 'bad') as StatusKey, icon: '⏱️' },
    { label: 'Avg Delivery Time', value: `${kpi.avgDeliveryTime} ชม.`, target: '4 ชม.', status: (kpi.avgDeliveryTime <= 4 ? 'good' : kpi.avgDeliveryTime <= 6 ? 'warning' : 'bad') as StatusKey, icon: '⌛' },
    { label: 'Delivery Success Rate', value: `${kpi.deliverySuccessRate}%`, target: '98%', status: (kpi.deliverySuccessRate >= 98 ? 'good' : 'warning') as StatusKey, icon: '✅' },
    { label: 'Delayed Delivery Rate', value: `${(100 - kpi.onTimeRate).toFixed(1)}%`, target: '<5%', status: ((100 - kpi.onTimeRate) <= 5 ? 'good' : 'warning') as StatusKey, icon: '⚠️' },
    { label: 'POD Completion Rate', value: `${kpi.podCompletionRate}%`, target: '100%', status: (kpi.podCompletionRate >= 100 ? 'good' : kpi.podCompletionRate >= 90 ? 'warning' : 'bad') as StatusKey, icon: '📸' },
    { label: 'Cost per Delivery', value: formatCurrency(kpi.costPerDelivery), target: `≤${formatCurrency(3000)}`, status: (kpi.costPerDelivery <= 3000 ? 'good' : 'warning') as StatusKey, icon: '💰' },
    { label: 'Fleet Utilization', value: `${kpi.fleetUtilization}%`, target: '70%', status: (kpi.fleetUtilization >= 70 ? 'good' : 'warning') as StatusKey, icon: '🚚' },
    { label: 'Total Orders (Month)', value: kpi.totalOrders.toString(), target: '300+', status: (kpi.totalOrders >= 300 ? 'good' : 'warning') as StatusKey, icon: '📦' },
  ];

  const statusColor: Record<StatusKey, string> = { good: 'text-emerald-600 dark:text-emerald-400', warning: 'text-amber-600 dark:text-amber-400', bad: 'text-red-600 dark:text-red-400' };
  const statusBg: Record<StatusKey, string> = { good: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30', warning: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30', bad: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' };

  const vehiclePerf = vehicles.slice(0, 8).map(v => ({
    name: v.registration.split(' ')[0],
    mileage: Math.round(v.mileage / 1000),
    fuel: v.fuel,
  }));

  return (
    <Layout title="KPI Report">
      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            {[{ key: 'today', label: 'วันนี้' }, { key: 'week', label: '7 วัน' }, { key: 'month', label: '30 วัน' }, { key: 'quarter', label: '3 เดือน' }].map(r => (
              <button key={r.key} onClick={() => setDateRange(r.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === r.key ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">Export:</span>
            {(['excel','csv','pdf'] as const).map(fmt => (
              <button key={fmt} onClick={() => setExportFormat(fmt)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${exportFormat === fmt ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-400'}`}>
                {fmt === 'excel' ? '📊 Excel' : fmt === 'csv' ? '📄 CSV' : '📑 PDF'}
              </button>
            ))}
            <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
              ⬇️ Download
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiMetrics.map((metric, i) => (
            <div key={i} className={`rounded-xl border shadow-sm p-4 ${statusBg[metric.status]}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{metric.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${metric.status === 'good' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : metric.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                  {metric.status === 'good' ? '✓ ดี' : metric.status === 'warning' ? '△ ควรปรับ' : '✗ ต่ำกว่าเป้า'}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{metric.label}</div>
                <div className={`text-xl font-bold mt-1 ${statusColor[metric.status]}`}>{metric.value}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">เป้าหมาย: {metric.target}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery trend + Driver performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Monthly Delivery Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
                <Bar dataKey="delivered" name="ทั้งหมด" fill="#3b82f6" radius={[4,4,0,0]} />
                <Bar dataKey="onTime" name="ตรงเวลา" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Driver Performance (On-Time Rate %)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={driverPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" domain={[80, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} formatter={(v: unknown) => [`${v}%`, 'On-Time Rate']} />
                <Bar dataKey="onTime" name="On-Time %" radius={[0,4,4,0]}>
                  {driverPerformance.map((e, i) => <Cell key={i} fill={e.onTime >= 95 ? '#10b981' : e.onTime >= 90 ? '#3b82f6' : '#f59e0b'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Performance + Vehicle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Sales Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Sales','Orders','Delivered','Revenue (฿K)','Delivery Rate'].map(h => (
                      <th key={h} className="text-left pb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salesPerf.map((s, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-700/50">
                      <td className="py-2.5 text-xs font-medium text-slate-800 dark:text-white">{s.name}</td>
                      <td className="py-2.5 text-xs text-slate-700 dark:text-slate-300">{s.orders}</td>
                      <td className="py-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{s.delivered}</td>
                      <td className="py-2.5 text-xs font-semibold text-slate-800 dark:text-white">{s.revenue}K</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 w-16">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${s.orders > 0 ? Math.round(s.delivered/s.orders*100) : 0}%` }} />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{s.orders > 0 ? Math.round(s.delivered/s.orders*100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Vehicle Performance (Mileage x1000 km)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vehiclePerf}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} formatter={(v: unknown) => [`${v}k km`, 'Mileage']} />
                <Bar dataKey="mileage" name="Mileage (k km)" fill="#8b5cf6" radius={[4,4,0,0]}>
                  {vehiclePerf.map((e, i) => <Cell key={i} fill={e.mileage > 300 ? '#ef4444' : e.mileage > 150 ? '#f59e0b' : '#8b5cf6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
