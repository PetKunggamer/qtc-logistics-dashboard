import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { maintenanceRecords, vehicles } from '../data/mockData';
import { formatDate, formatCurrency } from '../utils/helpers';
import type { MaintenanceRecord } from '../types';

const TYPE_LABEL: Record<string, string> = {
  oil_change: 'เปลี่ยนน้ำมันเครื่อง',
  tire_replacement: 'เปลี่ยนยาง',
  brake_service: 'ซ่อมเบรก',
  engine_service: 'ซ่อมเครื่องยนต์',
  electrical: 'ซ่อมไฟฟ้า',
  body_repair: 'ซ่อมตัวถัง',
  inspection: 'ตรวจสภาพ',
  insurance: 'ประกันภัย',
  tax: 'ภาษีรถ',
  other: 'อื่นๆ',
};

export default function MaintenancePage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = maintenanceRecords.filter(m => {
    const vehicle = vehicles.find(v => v.id === m.vehicleId);
    const q = search.toLowerCase();
    if (q && !vehicle?.registration.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q) && !m.vendor.toLowerCase().includes(q)) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  const getVehicle = (id: string) => vehicles.find(v => v.id === id);

  const thisMonthCost = maintenanceRecords.filter(m => m.status === 'completed' && m.date.startsWith('2026-06')).reduce((a, m) => a + m.cost, 0);

  // Alerts
  const today = new Date();
  const alerts = vehicles.filter(v => {
    const daysInsurance = Math.ceil((new Date(v.insuranceExpiry).getTime() - today.getTime()) / (1000*60*60*24));
    const daysTax = Math.ceil((new Date(v.taxExpiry).getTime() - today.getTime()) / (1000*60*60*24));
    const daysMaint = Math.ceil((new Date(v.nextMaintenance).getTime() - today.getTime()) / (1000*60*60*24));
    return daysInsurance <= 60 || daysTax <= 60 || daysMaint <= 30;
  }).map(v => {
    const daysInsurance = Math.ceil((new Date(v.insuranceExpiry).getTime() - today.getTime()) / (1000*60*60*24));
    const daysTax = Math.ceil((new Date(v.taxExpiry).getTime() - today.getTime()) / (1000*60*60*24));
    const daysMaint = Math.ceil((new Date(v.nextMaintenance).getTime() - today.getTime()) / (1000*60*60*24));
    const alertItems = [];
    if (daysInsurance <= 60) alertItems.push({ type: 'ประกันภัย', days: daysInsurance, date: v.insuranceExpiry });
    if (daysTax <= 60) alertItems.push({ type: 'ภาษีรถ', days: daysTax, date: v.taxExpiry });
    if (daysMaint <= 30) alertItems.push({ type: 'ซ่อมบำรุง', days: daysMaint, date: v.nextMaintenance });
    return { vehicle: v, alertItems };
  });

  return (
    <Layout title="Maintenance Management">
      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ค่าซ่อมเดือนนี้', value: formatCurrency(thisMonthCost), icon: '💰', color: 'text-violet-600 dark:text-violet-400' },
            { label: 'ซ่อมเสร็จแล้ว', value: maintenanceRecords.filter(m => m.status === 'completed').length, icon: '✅', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'กำลังซ่อม', value: maintenanceRecords.filter(m => m.status === 'in_progress').length, icon: '🔧', color: 'text-blue-600 dark:text-blue-400' },
            { label: 'รอดำเนินการ', value: maintenanceRecords.filter(m => m.status === 'pending').length, icon: '⏳', color: 'text-amber-600 dark:text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5">
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

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">การแจ้งเตือนที่ต้องดำเนินการ ({alerts.reduce((a, al) => a + al.alertItems.length, 0)} รายการ)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {alerts.flatMap(al => al.alertItems.map((item, i) => (
                <div key={`${al.vehicle.id}-${i}`} className={`flex items-center gap-2 p-2.5 rounded-lg ${item.days <= 7 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                  <span className="text-base">{item.days <= 7 ? '🚨' : '⚠️'}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-800 dark:text-white">{al.vehicle.registration} — {item.type}</div>
                    <div className={`text-xs ${item.days <= 0 ? 'text-red-600 dark:text-red-400 font-bold' : item.days <= 7 ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-300'}`}>
                      {item.days <= 0 ? 'หมดอายุแล้ว' : `อีก ${item.days} วัน (${formatDate(item.date)})`}
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="ค้นหาทะเบียน, รายการ, ร้านซ่อม..."
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
            <option value="completed">✅ เสร็จแล้ว</option>
            <option value="in_progress">🔧 กำลังซ่อม</option>
            <option value="pending">⏳ รอดำเนินการ</option>
          </select>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>+ เพิ่มรายการซ่อม</Button>
          <span className="text-xs text-slate-500 dark:text-slate-400 self-center">{filtered.length} รายการ</span>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  {['ทะเบียนรถ','วันที่','ประเภท','รายการ','ร้านซ่อม','ค่าใช้จ่าย','ไมล์','สถานะ','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => {
                  const vehicle = getVehicle(record.vehicleId);
                  return (
                    <tr key={record.id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-white whitespace-nowrap">{vehicle?.registration || '-'}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{formatDate(record.date)}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{TYPE_LABEL[record.type] || record.type}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 max-w-48 truncate">{record.description}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{record.vendor}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white whitespace-nowrap">{formatCurrency(record.cost)}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{record.mileage.toLocaleString()} km</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : record.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {record.status === 'completed' ? '✅ เสร็จแล้ว' : record.status === 'in_progress' ? '🔧 กำลังซ่อม' : '⏳ รอดำเนินการ'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedRecord(record)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap">
                          รายละเอียด
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">ไม่พบรายการที่ค้นหา</td></tr>
                )}
              </tbody>
              {/* Total row */}
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-t-2 border-slate-200 dark:border-slate-700">
                  <td colSpan={5} className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">รวมทั้งหมด {filtered.length} รายการ</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">
                    {formatCurrency(filtered.filter(r => r.status === 'completed').reduce((a, r) => a + r.cost, 0))}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="รายละเอียดการซ่อมบำรุง" size="md">
        {selectedRecord && (() => {
          const vehicle = getVehicle(selectedRecord.vehicleId);
          return (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['ทะเบียนรถ', vehicle?.registration || '-'],
                  ['ประเภทรถ', vehicle?.type || '-'],
                  ['วันที่', formatDate(selectedRecord.date)],
                  ['ประเภทการซ่อม', TYPE_LABEL[selectedRecord.type] || selectedRecord.type],
                  ['รายการ', selectedRecord.description],
                  ['ร้านซ่อม', selectedRecord.vendor],
                  ['ค่าใช้จ่าย', formatCurrency(selectedRecord.cost)],
                  ['ไมล์ที่ซ่อม', `${selectedRecord.mileage.toLocaleString()} km`],
                  ...(selectedRecord.nextServiceDate ? [['ซ่อมครั้งต่อไป', formatDate(selectedRecord.nextServiceDate)]] : []),
                  ...(selectedRecord.nextServiceMileage ? [['ไมล์ซ่อมครั้งต่อไป', `${selectedRecord.nextServiceMileage?.toLocaleString()} km`]] : []),
                ].map(([k, v], i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{k}</div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              {selectedRecord.notes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">หมายเหตุ</div>
                  <div className="text-sm text-amber-900 dark:text-amber-200">{selectedRecord.notes}</div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedRecord(null)}>ปิด</Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="เพิ่มรายการซ่อมบำรุง" size="md">
        <div className="p-6 space-y-4">
          {['ทะเบียนรถ','วันที่','ประเภทการซ่อม','รายละเอียด','ร้านซ่อม / ศูนย์บริการ','ค่าใช้จ่าย (บาท)','ไมล์ที่ซ่อม','หมายเหตุ'].map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
              {i === 2 ? (
                <select className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              ) : (
                <input type={i === 1 ? 'date' : i === 5 || i === 6 ? 'number' : 'text'} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={`กรอก${label}`} />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" className="flex-1" onClick={() => setShowAdd(false)}>บันทึก</Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>ยกเลิก</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
