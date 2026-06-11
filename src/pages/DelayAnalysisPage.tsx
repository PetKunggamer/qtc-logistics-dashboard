import Layout from '../components/layout/Layout';
import { orders } from '../data/mockData';
import { DELAY_REASON_LABEL } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#ef4444','#f59e0b','#3b82f6','#10b981','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

const delayReasonKeys = ['traffic','rain','vehicle_breakdown','customer_reschedule','product_not_ready','documentation_issue','driver_issue','other'] as const;

export default function DelayAnalysisPage() {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';

  const delayedOrders = orders.filter(o => o.delayReason);

  const reasonData = delayReasonKeys.map((r, i) => ({
    reason: r,
    label: DELAY_REASON_LABEL[r],
    count: delayedOrders.filter(o => o.delayReason === r).length,
    color: COLORS[i],
    percentage: delayedOrders.length > 0
      ? Math.round((delayedOrders.filter(o => o.delayReason === r).length / delayedOrders.length) * 100)
      : 0,
  })).filter(r => r.count > 0).sort((a, b) => b.count - a.count);

  const monthlyTrend = [
    { month: 'ม.ค.', traffic: 3, rain: 1, breakdown: 2, other: 1 },
    { month: 'ก.พ.', traffic: 4, rain: 0, breakdown: 1, other: 2 },
    { month: 'มี.ค.', traffic: 2, rain: 3, breakdown: 1, other: 0 },
    { month: 'เม.ย.', traffic: 5, rain: 2, breakdown: 3, other: 1 },
    { month: 'พ.ค.', traffic: 3, rain: 1, breakdown: 1, other: 2 },
    { month: 'มิ.ย.', traffic: reasonData.find(r => r.reason === 'traffic')?.count || 0, rain: reasonData.find(r => r.reason === 'rain')?.count || 0, breakdown: reasonData.find(r => r.reason === 'vehicle_breakdown')?.count || 0, other: reasonData.find(r => r.reason === 'other')?.count || 0 },
  ];

  const totalDelayed = delayedOrders.length;
  const totalOrders = orders.length;
  const delayRate = totalOrders > 0 ? ((totalDelayed / totalOrders) * 100).toFixed(1) : '0';
  const avgDelay = 2.8; // hours

  return (
    <Layout title="Delay Analysis">
      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ออเดอร์ล่าช้าทั้งหมด', value: totalDelayed, icon: '⚠️', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/10' },
            { label: 'อัตราการล่าช้า', value: `${delayRate}%`, icon: '📊', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { label: 'เฉลี่ยล่าช้า', value: `${avgDelay} ชม.`, icon: '⏱️', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { label: 'สาเหตุหลัก', value: reasonData[0]?.label || '-', icon: '🔍', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/10' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5 ${s.bg}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                  <div className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">สัดส่วนสาเหตุการล่าช้า</h3>
            {reasonData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={reasonData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="count">
                      {reasonData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {reasonData.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400 flex-1">{r.label}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{r.count}</span>
                      <span className="text-xs text-slate-400">({r.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">ไม่มีข้อมูลการล่าช้า</div>
            )}
          </div>

          {/* Bar chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">จำนวนครั้งตามสาเหตุ</h3>
            {reasonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reasonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
                  <Bar dataKey="count" name="จำนวนครั้ง" radius={[0, 4, 4, 0]}>
                    {reasonData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-sm">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Monthly Delay Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: isDark ? '#f1f5f9' : '#1e293b', fontSize: 12 }} labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} />
              <Line type="monotone" dataKey="traffic" name="รถติด" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="rain" name="ฝนตก" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="breakdown" name="รถเสีย" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="other" name="อื่นๆ" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm">ตารางสรุปสาเหตุการล่าช้า</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">สาเหตุ</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">จำนวนครั้ง</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">เปอร์เซ็นต์</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Progress</th>
                </tr>
              </thead>
              <tbody>
                {reasonData.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: row.color }} />
                        <span className="text-slate-800 dark:text-white font-medium">{row.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-slate-800 dark:text-white">{row.count}</td>
                    <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">{row.percentage}%</td>
                    <td className="px-5 py-3">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${row.percentage}%`, background: row.color }} />
                      </div>
                    </td>
                  </tr>
                ))}
                {reasonData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">ไม่มีข้อมูลการล่าช้า</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
