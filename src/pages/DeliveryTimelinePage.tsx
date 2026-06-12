import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { orders, customers, drivers, vehicles, timelineEvents } from '../data/mockData';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, TIMELINE_STEP_LABEL, TIMELINE_STEP_ICON, formatDateTime, formatDate } from '../utils/helpers';

const TIMELINE_STEPS = ['order_created','picking','packing','loading','vehicle_departed','in_transit','arrived_customer','delivered'] as const;

export default function DeliveryTimelinePage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [search, setSearch] = useState('');
  const [showOrderList, setShowOrderList] = useState(false);

  const filteredOrders = orders.filter(o => {
    const customer = customers.find(c => c.id === o.customerId);
    const q = search.toLowerCase();
    return !q || o.soNumber.toLowerCase().includes(q) || customer?.name.toLowerCase().includes(q);
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedCustomer = selectedOrder ? customers.find(c => c.id === selectedOrder.customerId) : undefined;
  const selectedDriver = selectedOrder?.driverId ? drivers.find(d => d.id === selectedOrder.driverId) : undefined;
  const selectedVehicle = selectedOrder?.vehicleId ? vehicles.find(v => v.id === selectedOrder.vehicleId) : undefined;

  const timeline = selectedOrder
    ? timelineEvents.filter(t => t.orderId === selectedOrder.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return (
    <Layout title="Delivery Timeline">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
        {/* Mobile overlay */}
        {showOrderList && (
          <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setShowOrderList(false)} />
        )}

        {/* Left panel - order list */}
        <div className={`
          fixed top-16 left-0 h-[calc(100vh-64px)] z-30
          lg:relative lg:top-auto lg:left-auto lg:h-auto lg:z-auto
          w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 flex flex-col shrink-0
          transition-transform duration-300
          ${showOrderList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
            <input
              type="text"
              placeholder="ค้นหา SO หรือลูกค้า..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredOrders.map(order => {
              const customer = customers.find(c => c.id === order.customerId);
              const isActive = order.id === selectedOrderId;
              return (
                <button
                  key={order.id}
                  onClick={() => { setSelectedOrderId(order.id); setShowOrderList(false); }}
                  className={`w-full text-left p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{order.soNumber}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 truncate">{customer?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(order.createdAt)}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel - timeline detail */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Mobile order selector button */}
          <button
            onClick={() => setShowOrderList(true)}
            className="lg:hidden mb-4 w-full flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm px-4 py-3 text-sm font-medium text-slate-800 dark:text-white"
          >
            <span>📋 {selectedOrder ? selectedOrder.soNumber : 'เลือกออเดอร์'}</span>
            <span className="text-slate-400">▼</span>
          </button>
          {selectedOrder ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedOrder.soNumber}</h2>
                    <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{selectedCustomer?.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{selectedCustomer?.address}, {selectedCustomer?.district}</div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${ORDER_STATUS_COLOR[selectedOrder.status]}`}>
                    {ORDER_STATUS_LABEL[selectedOrder.status]}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Sales', value: selectedOrder.salesName },
                    { label: 'คนขับ', value: selectedDriver?.name || '-' },
                    { label: 'ทะเบียนรถ', value: selectedVehicle?.registration || '-' },
                    { label: 'กำหนดส่ง', value: formatDate(selectedOrder.scheduledDelivery) },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                      <div className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-6">ลำดับเหตุการณ์</h3>
                <div className="relative">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const event = timeline.find(t => t.step === step);
                    const hasNext = idx < TIMELINE_STEPS.length - 1;
                    const status = event?.status || 'pending';

                    return (
                      <div key={step} className="flex gap-5 group">
                        {/* Icon + line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 transition-all ${
                            status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-400 dark:ring-emerald-600'
                            : status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-400 dark:ring-blue-600 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-700 opacity-50'
                          }`}>
                            {status === 'completed' ? '✅' : status === 'in_progress' ? TIMELINE_STEP_ICON[step] : '⭕'}
                          </div>
                          {hasNext && (
                            <div className={`w-0.5 flex-1 my-1.5 min-h-6 ${status === 'completed' ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-6 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold ${status === 'completed' ? 'text-slate-800 dark:text-white' : status === 'in_progress' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                              {idx + 1}. {TIMELINE_STEP_LABEL[step]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                            }`}>
                              {status === 'completed' ? 'เสร็จแล้ว' : status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                            </span>
                          </div>
                          {event && (
                            <div className="mt-1.5 space-y-1">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDateTime(event.timestamp)} • {event.responsible}
                              </div>
                              {event.notes && (
                                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                                  {event.notes}
                                </div>
                              )}
                            </div>
                          )}
                          {!event && status === 'pending' && (
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">ยังไม่ดำเนินการ</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
              เลือกออเดอร์เพื่อดู Timeline
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
