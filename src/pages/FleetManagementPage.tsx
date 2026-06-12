import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Modal } from '../components/ui/Modal';
import { vehicles, drivers, orders, maintenanceRecords } from '../data/mockData';
import { VEHICLE_STATUS_LABEL, VEHICLE_STATUS_COLOR, formatDate, formatCurrency } from '../utils/helpers';
import type { VehicleStatus } from '../types';

const STATUS_TABS: { key: VehicleStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'in_transit', label: 'กำลังวิ่ง' },
  { key: 'available', label: 'พร้อมใช้' },
  { key: 'idle', label: 'จอดอยู่' },
  { key: 'maintenance', label: 'ซ่อมบำรุง' },
  { key: 'out_of_service', label: 'หยุดใช้' },
];

export default function FleetManagementPage() {
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filtered = vehicles.filter(v => statusFilter === 'all' || v.status === statusFilter);
  const selectedVehicle = selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null;
  const selectedDriver = selectedVehicle?.driverId ? drivers.find(d => d.id === selectedVehicle.driverId) : null;
  const vehicleMaintenance = selectedVehicleId ? maintenanceRecords.filter(m => m.vehicleId === selectedVehicleId) : [];

  // Fleet KPIs
  const kpis = [
    { label: 'Active Vehicles', value: vehicles.filter(v => v.status === 'in_transit').length, icon: '🚚', color: 'text-blue-600 dark:text-blue-400' },
    { label: 'พร้อมใช้', value: vehicles.filter(v => v.status === 'available').length, icon: '✅', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Idle', value: vehicles.filter(v => v.status === 'idle').length, icon: '⏸️', color: 'text-slate-600 dark:text-slate-400' },
    { label: 'ซ่อมบำรุง', value: vehicles.filter(v => v.status === 'maintenance').length, icon: '🔧', color: 'text-amber-600 dark:text-amber-400' },
    { label: 'หยุดใช้งาน', value: vehicles.filter(v => v.status === 'out_of_service').length, icon: '🚫', color: 'text-red-600 dark:text-red-400' },
    { label: 'Fleet Utilization', value: `${Math.round((vehicles.filter(v => v.status === 'in_transit').length / vehicles.length) * 100)}%`, icon: '📊', color: 'text-violet-600 dark:text-violet-400' },
  ];

  return (
    <Layout title="Fleet Management">
      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{kpi.icon}</div>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
          {/* Status filter tabs — horizontally scrollable on mobile */}
          <div className="w-full sm:w-auto overflow-x-auto">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-max min-w-full sm:min-w-0">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === tab.key ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab.label} ({tab.key === 'all' ? vehicles.length : vehicles.filter(v => v.status === tab.key).length})
              </button>
            ))}
          </div>
          </div>
          <div className="flex-1" />
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(['cards','table'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === mode ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {mode === 'cards' ? '⊞ Cards' : '☰ Table'}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(vehicle => {
              const driver = vehicle.driverId ? drivers.find(d => d.id === vehicle.driverId) : null;
              const currentOrder = orders.find(o => o.vehicleId === vehicle.id && ['in_transit','near_customer','loaded'].includes(o.status));
              const nextMaintDate = new Date(vehicle.nextMaintenance);
              const today = new Date();
              const daysUntilMaint = Math.ceil((nextMaintDate.getTime() - today.getTime()) / (1000*60*60*24));
              const maintWarning = daysUntilMaint <= 30;

              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        vehicle.status === 'in_transit' ? 'bg-blue-100 dark:bg-blue-900/40'
                        : vehicle.status === 'available' ? 'bg-emerald-100 dark:bg-emerald-900/40'
                        : vehicle.status === 'maintenance' ? 'bg-amber-100 dark:bg-amber-900/40'
                        : vehicle.status === 'out_of_service' ? 'bg-red-100 dark:bg-red-900/40'
                        : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        🚚
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{vehicle.registration}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{vehicle.type}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${VEHICLE_STATUS_COLOR[vehicle.status]}`}>
                      {VEHICLE_STATUS_LABEL[vehicle.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: 'ยี่ห้อ', value: `${vehicle.brand} ${vehicle.model}` },
                      { label: 'ปีรถ', value: vehicle.year.toString() },
                      { label: 'ไมล์', value: `${vehicle.mileage.toLocaleString()} km` },
                      { label: 'น้ำมัน', value: `${vehicle.fuel}%` },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                        <div className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Fuel bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">น้ำมัน</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{vehicle.fuel}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${vehicle.fuel > 50 ? 'bg-emerald-500' : vehicle.fuel > 25 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${vehicle.fuel}%` }} />
                    </div>
                  </div>

                  {driver && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-2">
                      <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-800 dark:text-white">{driver.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{driver.phone}</div>
                      </div>
                    </div>
                  )}

                  {currentOrder && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1.5 mb-2">
                      📦 {currentOrder.soNumber}
                    </div>
                  )}

                  {maintWarning && (
                    <div className={`text-xs px-3 py-1.5 rounded-lg font-medium ${daysUntilMaint <= 7 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                      🔧 ซ่อมบำรุงอีก {daysUntilMaint} วัน ({formatDate(vehicle.nextMaintenance)})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50">
                    {['ทะเบียน','ประเภท','ยี่ห้อ/รุ่น','คนขับ','ไมล์','น้ำมัน','สถานะ','งานปัจจุบัน','ซ่อมครั้งต่อไป','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(vehicle => {
                    const driver = vehicle.driverId ? drivers.find(d => d.id === vehicle.driverId) : null;
                    const currentOrder = orders.find(o => o.vehicleId === vehicle.id && ['in_transit','near_customer'].includes(o.status));
                    return (
                      <tr key={vehicle.id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-white whitespace-nowrap">{vehicle.registration}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{vehicle.type}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{vehicle.brand} {vehicle.model} {vehicle.year}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{driver?.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{vehicle.mileage.toLocaleString()} km</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${vehicle.fuel > 50 ? 'bg-emerald-500' : vehicle.fuel > 25 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${vehicle.fuel}%` }} />
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{vehicle.fuel}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${VEHICLE_STATUS_COLOR[vehicle.status]}`}>
                            {VEHICLE_STATUS_LABEL[vehicle.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-blue-600 dark:text-blue-400">{currentOrder?.soNumber || '-'}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{formatDate(vehicle.nextMaintenance)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedVehicleId(vehicle.id)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap">
                            รายละเอียด
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Detail Modal */}
      <Modal open={!!selectedVehicle} onClose={() => setSelectedVehicleId(null)} title={selectedVehicle ? `${selectedVehicle.registration} — รายละเอียดยานพาหนะ` : ''} size="lg">
        {selectedVehicle && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['ทะเบียน', selectedVehicle.registration],
                ['ประเภท', selectedVehicle.type],
                ['ยี่ห้อ/รุ่น', `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}`],
                ['สถานะ', VEHICLE_STATUS_LABEL[selectedVehicle.status]],
                ['ไมล์สะสม', `${selectedVehicle.mileage.toLocaleString()} km`],
                ['Payload', `${selectedVehicle.payload.toLocaleString()} kg`],
                ['ซ่อมครั้งสุดท้าย', formatDate(selectedVehicle.lastMaintenance)],
              ].map(([k, v], i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{k}</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            {/* Document expiry section — 6-wheel trucks only */}
            {selectedVehicle.type === 'รถบรรทุก 6 ล้อ' && (() => {
              const today = new Date();
              const docItems = [
                { label: 'พรบ หมดอายุ', date: selectedVehicle.porobExpiry, icon: '📋' },
                { label: 'ประกันภัย หมดอายุ', date: selectedVehicle.insuranceExpiry, icon: '🛡️' },
                { label: 'ปจ2 / ภาษีรถ หมดอายุ', date: selectedVehicle.taxExpiry, icon: '🏷️' },
                { label: 'รอบเข้าศูนย์ครั้งต่อไป', date: selectedVehicle.nextMaintenance, icon: '🔧' },
              ].filter(d => d.date);

              return (
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mb-3">📄 เอกสารและกำหนดการ (6 ล้อ)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {docItems.map(({ label, date, icon }) => {
                      const expiry = new Date(date!);
                      const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isExpired = days < 0;
                      const isUrgent = days >= 0 && days <= 30;
                      const isWarning = days > 30 && days <= 90;
                      const colorBg = isExpired
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50'
                        : isUrgent
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                          : isWarning
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40'
                            : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30';
                      const colorText = isExpired || isUrgent
                        ? 'text-red-700 dark:text-red-300'
                        : isWarning
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-emerald-700 dark:text-emerald-300';
                      const badge = isExpired
                        ? '🚨 หมดอายุแล้ว'
                        : isUrgent
                          ? `⚠️ อีก ${days} วัน`
                          : isWarning
                            ? `⏳ อีก ${days} วัน`
                            : `✅ อีก ${days} วัน`;

                      return (
                        <div key={label} className={`rounded-lg border p-3 ${colorBg}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base">{icon}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-white">{formatDate(date!)}</div>
                          <div className={`text-xs font-medium mt-0.5 ${colorText}`}>{badge}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {selectedDriver && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">คนขับประจำรถ</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{selectedDriver.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white">{selectedDriver.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{selectedDriver.phone} • On-time: {selectedDriver.onTimeRate}%</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white mb-3">ประวัติการซ่อมบำรุง</div>
              <div className="space-y-2">
                {vehicleMaintenance.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium text-slate-800 dark:text-white">{m.description}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(m.date)} • {m.vendor}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(m.cost)}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : m.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                        {m.status === 'completed' ? 'เสร็จแล้ว' : m.status === 'in_progress' ? 'กำลังซ่อม' : 'รอดำเนินการ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
