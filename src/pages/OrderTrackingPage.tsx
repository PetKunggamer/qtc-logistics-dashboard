import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { orders, customers, drivers, vehicles, timelineEvents } from '../data/mockData';
import {
  ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, DELAY_REASON_LABEL,
  TIMELINE_STEP_LABEL, TIMELINE_STEP_ICON, formatDateTime, formatCurrency,
} from '../utils/helpers';
import type { Order, OrderStatus } from '../types';
import { useApp } from '../contexts/AppContext';

const STATUS_OPTIONS: OrderStatus[] = ['pending','preparing','ready_to_load','loaded','in_transit','near_customer','delivered','delayed','cancelled'];

export default function OrderTrackingPage() {
  const { userRole } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [salesFilter, setSalesFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'timeline'>('detail');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const salesOptions = [...new Set(orders.map(o => o.salesName))];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (userRole === 'sales') {
        if (o.salesName !== 'คุณเมย์') return false;
      }
      const customer = customers.find(c => c.id === o.customerId);
      const q = search.toLowerCase();
      if (search && !o.soNumber.toLowerCase().includes(q) && !customer?.name.toLowerCase().includes(q) && !o.salesName.toLowerCase().includes(q)) {
        const veh = vehicles.find(v => v.id === o.vehicleId);
        if (!veh?.registration.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (salesFilter !== 'all' && o.salesName !== salesFilter) return false;
      return true;
    });
  }, [search, statusFilter, salesFilter, userRole]);

  const paged = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const orderTimeline = selectedOrder
    ? timelineEvents.filter(t => t.orderId === selectedOrder.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const getCustomer = (id: string) => customers.find(c => c.id === id);
  const getDriver = (id?: string) => id ? drivers.find(d => d.id === id) : undefined;
  const getVehicle = (id?: string) => id ? vehicles.find(v => v.id === id) : undefined;

  return (
    <Layout title="Order Tracking">
      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'ทั้งหมด', count: orders.length, color: 'text-slate-800 dark:text-white' },
            { label: 'กำลังขนส่ง', count: orders.filter(o => ['in_transit','near_customer','loaded'].includes(o.status)).length, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'ส่งสำเร็จ', count: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'ล่าช้า', count: orders.filter(o => o.status === 'delayed').length, color: 'text-red-600 dark:text-red-400' },
            { label: 'รอดำเนินการ', count: orders.filter(o => ['pending','preparing','ready_to_load'].includes(o.status)).length, color: 'text-blue-600 dark:text-blue-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-4 text-center shadow-sm">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="ค้นหา SO, ลูกค้า, Sales, ทะเบียนรถ..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <option value="all">สถานะทั้งหมด</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
          </select>
          {userRole !== 'sales' && (
            <select
              value={salesFilter}
              onChange={e => { setSalesFilter(e.target.value); setPage(1); }}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <option value="all">Sales ทั้งหมด</option>
              {salesOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="text-xs text-slate-500 dark:text-slate-400 self-center whitespace-nowrap">
            {filteredOrders.length} รายการ
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  {['SO Number','ลูกค้า','Sales','รถ / คนขับ','สถานะ','ETA','ส่งจริง','สาเหตุล่าช้า','POD','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map(order => {
                  const customer = getCustomer(order.customerId);
                  const driver = getDriver(order.driverId);
                  const vehicle = getVehicle(order.vehicleId);

                  return (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{order.soNumber}</td>
                      <td className="px-4 py-3 max-w-36">
                        <div className="text-slate-800 dark:text-white font-medium text-xs truncate">{customer?.name}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs truncate">{customer?.district}, {customer?.province}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">{order.salesName}</td>
                      <td className="px-4 py-3 min-w-32">
                        {vehicle ? (
                          <>
                            <div className="text-slate-800 dark:text-white text-xs font-medium">{vehicle.registration}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs">{driver?.name || '-'}</div>
                          </>
                        ) : <span className="text-slate-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
                          {ORDER_STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
                        {order.eta ? formatDateTime(order.eta) : order.scheduledDelivery ? formatDateTime(order.scheduledDelivery) : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        {order.actualDelivery ? (
                          <span className="text-emerald-600 dark:text-emerald-400">{formatDateTime(order.actualDelivery)}</span>
                        ) : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-28">
                        {order.delayReason ? (
                          <div>
                            <span className="text-red-600 dark:text-red-400 font-medium">{DELAY_REASON_LABEL[order.delayReason]}</span>
                            {order.delayNote && <div className="text-slate-400 text-xs truncate">{order.delayNote}</div>}
                          </div>
                        ) : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.podStatus === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : order.podStatus === 'uploaded' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {order.podStatus === 'verified' ? '✓ ยืนยัน' : order.podStatus === 'uploaded' ? '↑ อัปโหลด' : '⏳ รอ POD'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedOrder(order); setActiveTab('detail'); }}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
                        >
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                      ไม่พบรายการที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2 justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                แสดง {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredOrders.length)} จาก {filteredOrders.length} รายการ
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 min-h-[36px]">
                  ← ก่อน
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 text-xs rounded border transition-colors ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 min-h-[36px]">
                  ถัดไป →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `${selectedOrder.soNumber} — รายละเอียดออเดอร์` : ''}
        size="xl"
      >
        {selectedOrder && (() => {
          const customer = getCustomer(selectedOrder.customerId)!;
          const driver = getDriver(selectedOrder.driverId);
          const vehicle = getVehicle(selectedOrder.vehicleId);
          return (
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
                {(['detail', 'timeline'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    {tab === 'detail' ? '📋 รายละเอียด' : '⏱️ Timeline'}
                  </button>
                ))}
              </div>

              {activeTab === 'detail' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order info */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white">ข้อมูลออเดอร์</h4>
                      {[
                        ['SO Number', selectedOrder.soNumber],
                        ['สถานะ', <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLOR[selectedOrder.status]}`}>{ORDER_STATUS_LABEL[selectedOrder.status]}</span>],
                        ['Sales', selectedOrder.salesName],
                        ['สร้างวันที่', formatDateTime(selectedOrder.createdAt)],
                        ['กำหนดส่ง', formatDateTime(selectedOrder.scheduledDelivery)],
                        ['ส่งจริง', selectedOrder.actualDelivery ? formatDateTime(selectedOrder.actualDelivery) : '-'],
                        ['ETA', selectedOrder.eta ? formatDateTime(selectedOrder.eta) : '-'],
                        ['มูลค่า', formatCurrency(selectedOrder.totalAmount)],
                        ['น้ำหนักรวม', `${selectedOrder.totalWeight.toLocaleString()} kg`],
                      ].map(([k, v], i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{k}</span>
                          <span className="text-xs font-medium text-slate-800 dark:text-white text-right max-w-48">{v}</span>
                        </div>
                      ))}
                      {selectedOrder.delayReason && (
                        <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400">สาเหตุล่าช้า: {DELAY_REASON_LABEL[selectedOrder.delayReason]}</div>
                          {selectedOrder.delayNote && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedOrder.delayNote}</div>}
                        </div>
                      )}
                    </div>

                    {/* Customer */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white">ข้อมูลลูกค้า</h4>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{customer.name}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{customer.address}, {customer.district}, {customer.province}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">ผู้ติดต่อ: {customer.contact}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">โทร: {customer.phone}</div>
                    </div>
                  </div>

                  {/* Vehicle + Items */}
                  <div className="space-y-4">
                    {vehicle && (
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">ยานพาหนะ</h4>
                        <div className="text-sm font-medium text-slate-800 dark:text-white">{vehicle.registration}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{vehicle.type} • {vehicle.brand} {vehicle.model}</div>
                        {driver && (
                          <>
                            <div className="text-xs text-slate-600 dark:text-slate-300">คนขับ: {driver.name}</div>
                            <a href={`tel:${driver.phone}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">📞 {driver.phone}</a>
                          </>
                        )}
                      </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">รายการสินค้า</h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map(item => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                            <span className="text-slate-500 dark:text-slate-400">{item.quantity} {item.unit} ({item.weight} kg)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* POD Status */}
                    <div className={`rounded-xl p-4 ${selectedOrder.podStatus === 'verified' ? 'bg-emerald-50 dark:bg-emerald-900/20' : selectedOrder.podStatus === 'uploaded' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">
                        POD Status: {selectedOrder.podStatus === 'verified' ? '✅ ยืนยันแล้ว' : selectedOrder.podStatus === 'uploaded' ? '📤 อัปโหลดแล้ว' : '⏳ รอ POD'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-0">
                  {orderTimeline.map((event, i) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${event.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40' : event.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                          {TIMELINE_STEP_ICON[event.step]}
                        </div>
                        {i < orderTimeline.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 ${event.status === 'completed' ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        )}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${event.status === 'completed' ? 'text-slate-800 dark:text-white' : event.status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {TIMELINE_STEP_LABEL[event.step]}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : event.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                            {event.status === 'completed' ? 'เสร็จแล้ว' : event.status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.responsible} • {formatDateTime(event.timestamp)}</div>
                        {event.notes && <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-1.5">{event.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </Layout>
  );
}
