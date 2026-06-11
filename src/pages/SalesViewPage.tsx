import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { orders, customers, drivers, vehicles } from '../data/mockData';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, DELAY_REASON_LABEL, formatDateTime, formatCurrency } from '../utils/helpers';
import { useApp } from '../contexts/AppContext';

export default function SalesViewPage() {
  const { userRole } = useApp();
  const [selectedSales, setSelectedSales] = useState('คุณเมย์');

  const salesOptions = [...new Set(orders.map(o => o.salesName))];

  // For Sales role, always show their own name; for others, allow filter
  const effectiveSales = userRole === 'sales' ? 'คุณเมย์' : selectedSales;
  const myOrders = orders.filter(o => o.salesName === effectiveSales);

  const stats = {
    total: myOrders.length,
    delivered: myOrders.filter(o => o.status === 'delivered').length,
    delayed: myOrders.filter(o => o.status === 'delayed' || (o.delayReason && o.status === 'in_transit')).length,
    inTransit: myOrders.filter(o => ['in_transit','near_customer','loaded'].includes(o.status)).length,
    pending: myOrders.filter(o => ['pending','preparing','ready_to_load'].includes(o.status)).length,
    totalRevenue: myOrders.reduce((a, o) => a + o.totalAmount, 0),
  };

  return (
    <Layout title="Sales View">
      <div className="p-6 space-y-5">
        {/* Sales selector (non-sales roles) */}
        {userRole !== 'sales' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ดูข้อมูลของ Sales:</span>
              <div className="flex gap-2 flex-wrap">
                {salesOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSales(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedSales === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Header card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">👤</div>
            <div>
              <div className="text-xl font-bold">{effectiveSales}</div>
              <div className="text-blue-200 text-sm">Sales Executive</div>
              <div className="text-blue-100 text-xs mt-1">มูลค่ารวม: {formatCurrency(stats.totalRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'ออเดอร์ทั้งหมด', value: stats.total, icon: '📋', color: 'text-slate-800 dark:text-white' },
            { label: 'ส่งสำเร็จ', value: stats.delivered, icon: '✅', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'กำลังส่ง', value: stats.inTransit, icon: '🚚', color: 'text-blue-600 dark:text-blue-400' },
            { label: 'ล่าช้า', value: stats.delayed, icon: '⚠️', color: 'text-red-600 dark:text-red-400' },
            { label: 'รอดำเนินการ', value: stats.pending, icon: '⏳', color: 'text-amber-600 dark:text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Delayed orders alert */}
        {stats.delayed > 0 && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚨</span>
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">ออเดอร์ที่ล่าช้า ({stats.delayed} รายการ)</h3>
            </div>
            <div className="space-y-2">
              {myOrders.filter(o => o.status === 'delayed' || (o.delayReason && o.status === 'in_transit')).map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <div>
                      <div className="text-sm font-bold text-red-700 dark:text-red-300">{order.soNumber}</div>
                      <div className="text-xs text-red-600 dark:text-red-400">{customer?.name}</div>
                      {order.delayReason && <div className="text-xs text-red-500 dark:text-red-400">{DELAY_REASON_LABEL[order.delayReason]}: {order.delayNote}</div>}
                    </div>
                    <div className="text-right">
                      {order.eta && <div className="text-xs font-medium text-red-700 dark:text-red-300">ETA: {formatDateTime(order.eta)}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In transit */}
        {stats.inTransit > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">🚚 กำลังขนส่ง ({stats.inTransit} รายการ)</h3>
            <div className="space-y-3">
              {myOrders.filter(o => ['in_transit','near_customer','loaded'].includes(o.status)).map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                const driver = order.driverId ? drivers.find(d => d.id === order.driverId) : null;
                const vehicle = order.vehicleId ? vehicles.find(v => v.id === order.vehicleId) : null;
                return (
                  <div key={order.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xl shrink-0">🚚</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{order.soNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>{ORDER_STATUS_LABEL[order.status]}</span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 truncate">{customer?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{vehicle?.registration} • {driver?.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">
                        ETA: {order.eta ? formatDateTime(order.eta).split(' ')[1] : '-'}
                      </div>
                      {order.remainingKm && <div className="text-xs text-slate-500 dark:text-slate-400">{order.remainingKm} km</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All orders table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">ออเดอร์ทั้งหมด ({myOrders.length} รายการ)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  {['SO Number','ลูกค้า','มูลค่า','กำหนดส่ง','สถานะ','ETA','สาเหตุล่าช้า','POD'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myOrders.map(order => {
                  const customer = customers.find(c => c.id === order.customerId);
                  return (
                    <tr key={order.id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{order.soNumber}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 max-w-36 truncate">{customer?.name}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{formatDateTime(order.scheduledDelivery)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status]}`}>{ORDER_STATUS_LABEL[order.status]}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{order.eta ? formatDateTime(order.eta) : '-'}</td>
                      <td className="px-4 py-3 text-xs">
                        {order.delayReason ? <span className="text-red-600 dark:text-red-400">{DELAY_REASON_LABEL[order.delayReason]}</span> : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${order.podStatus === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : order.podStatus === 'uploaded' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {order.podStatus === 'verified' ? '✓ ยืนยัน' : order.podStatus === 'uploaded' ? '↑ อัปโหลด' : '⏳ รอ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
