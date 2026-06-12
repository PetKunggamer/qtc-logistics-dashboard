import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { podRecords, orders, customers, drivers } from '../data/mockData';
import { formatDateTime } from '../utils/helpers';
import type { PODRecord } from '../types';

export default function PODPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'uploaded' | 'verified'>('all');
  const [selectedPOD, setSelectedPOD] = useState<PODRecord | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = podRecords.filter(p => {
    const order = orders.find(o => o.id === p.orderId);
    const customer = order ? customers.find(c => c.id === order.customerId) : undefined;
    const q = search.toLowerCase();
    if (q && !order?.soNumber.toLowerCase().includes(q) && !customer?.name.toLowerCase().includes(q)) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const getOrder = (orderId: string) => orders.find(o => o.id === orderId);
  const getCustomer = (customerId: string) => customers.find(c => c.id === customerId);
  const getDriver = (driverId: string) => drivers.find(d => d.id === driverId);

  const stats = {
    total: podRecords.length,
    verified: podRecords.filter(p => p.status === 'verified').length,
    uploaded: podRecords.filter(p => p.status === 'uploaded').length,
    pending: podRecords.filter(p => p.status === 'pending').length,
  };

  return (
    <Layout title="Proof of Delivery">
      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'POD ทั้งหมด', value: stats.total, color: 'text-slate-800 dark:text-white', bg: '' },
            { label: 'ยืนยันแล้ว', value: stats.verified, color: 'text-emerald-600 dark:text-emerald-400', bg: 'border-l-4 border-l-emerald-500' },
            { label: 'อัปโหลดแล้ว', value: stats.uploaded, color: 'text-blue-600 dark:text-blue-400', bg: 'border-l-4 border-l-blue-500' },
            { label: 'รอ POD', value: stats.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'border-l-4 border-l-amber-500' },
          ].map((s, i) => (
            <div key={i} className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5 ${s.bg}`}>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="ค้นหา SO Number หรือลูกค้า..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="verified">✅ ยืนยันแล้ว</option>
            <option value="uploaded">📤 อัปโหลดแล้ว</option>
            <option value="pending">⏳ รอ POD</option>
          </select>
          <Button variant="primary" size="sm" onClick={() => setShowUpload(true)}>
            + Upload POD
          </Button>
        </div>

        {/* POD Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(pod => {
            const order = getOrder(pod.orderId);
            const customer = order ? getCustomer(order.customerId) : undefined;
            const driver = getDriver(pod.driverId);

            return (
              <div key={pod.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Photo preview */}
                <div className="relative h-40 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  {pod.photos.length > 0 ? (
                    <>
                      <img src={pod.photos[0]} alt="POD" className="w-full h-full object-cover" />
                      {pod.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          +{pod.photos.length - 1} รูป
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl">📷</div>
                  )}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    pod.status === 'verified' ? 'bg-emerald-500 text-white'
                    : pod.status === 'uploaded' ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
                  }`}>
                    {pod.status === 'verified' ? '✅ ยืนยันแล้ว' : pod.status === 'uploaded' ? '📤 อัปโหลดแล้ว' : '⏳ รอ POD'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{order?.soNumber}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate">{customer?.name}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">ผู้รับ</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{pod.receiverName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">คนขับ</span>
                      <span className="text-slate-700 dark:text-slate-300">{driver?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">เวลาส่ง</span>
                      <span className="text-slate-700 dark:text-slate-300">{formatDateTime(pod.deliveryTime)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">GPS</span>
                      <span className="text-slate-700 dark:text-slate-300">{pod.gps[0].toFixed(4)}, {pod.gps[1].toFixed(4)}</span>
                    </div>
                  </div>

                  {pod.notes && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2.5 py-1.5">
                      {pod.notes}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedPOD(pod)}
                      className="flex-1 text-xs text-center py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium transition-colors"
                    >
                      ดู POD
                    </button>
                    <button className="flex-1 text-xs text-center py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 font-medium transition-colors">
                      📥 PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500">
              ไม่พบรายการที่ค้นหา
            </div>
          )}
        </div>
      </div>

      {/* POD Detail Modal */}
      <Modal open={!!selectedPOD} onClose={() => setSelectedPOD(null)} title="Proof of Delivery" size="lg">
        {selectedPOD && (() => {
          const order = getOrder(selectedPOD.orderId);
          const customer = order ? getCustomer(order.customerId) : undefined;
          const driver = getDriver(selectedPOD.driverId);
          return (
            <div className="p-6 space-y-5">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['SO Number', order?.soNumber || '-'],
                  ['ลูกค้า', customer?.name || '-'],
                  ['ผู้รับสินค้า', selectedPOD.receiverName],
                  ['เบอร์โทร', selectedPOD.receiverPhone],
                  ['คนขับ', driver?.name || '-'],
                  ['เวลาส่ง', formatDateTime(selectedPOD.deliveryTime)],
                  ['พิกัด GPS', `${selectedPOD.gps[0].toFixed(5)}, ${selectedPOD.gps[1].toFixed(5)}`],
                  ['สถานะ', selectedPOD.status === 'verified' ? '✅ ยืนยันแล้ว' : selectedPOD.status === 'uploaded' ? '📤 อัปโหลดแล้ว' : '⏳ รอ POD'],
                ].map(([k, v], i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{k}</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              {selectedPOD.notes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300">
                  📝 {selectedPOD.notes}
                </div>
              )}

              {/* Photo gallery */}
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white mb-3">ภาพถ่ายหลักฐาน ({selectedPOD.photos.length} รูป)</div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedPOD.photos.map((photo, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img src={photo} alt={`POD ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">📥 Download PDF</Button>
                <Button variant="secondary" className="flex-1">🗺️ View on Map</Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Upload modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload POD" size="md">
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {['SO Number', 'ชื่อผู้รับ', 'เบอร์โทรผู้รับ', 'หมายเหตุ'].map((label, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                <input className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={`กรอก${label}`} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">อัปโหลดรูปภาพ</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <div className="text-3xl mb-2">📸</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">คลิกหรือลากไฟล์มาที่นี่</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">PNG, JPG สูงสุด 10MB</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={() => setShowUpload(false)}>Upload POD</Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowUpload(false)}>ยกเลิก</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
