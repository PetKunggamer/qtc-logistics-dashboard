import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Layout from '../components/layout/Layout';
import { vehicles, orders, customers, drivers, WAREHOUSE_LOCATION } from '../data/mockData';
import { ORDER_STATUS_LABEL, VEHICLE_STATUS_LABEL, formatTime } from '../utils/helpers';
import type { Vehicle, Order } from '../types';

// Custom DivIcon factory
function createVehicleIcon(status: string) {
  const cls = status === 'delayed' || status === 'in_transit_delayed' ? 'delayed'
    : status === 'near_customer' ? 'risk'
    : status === 'delivered' ? 'delivered'
    : status === 'idle' ? 'idle'
    : status === 'maintenance' ? 'maintenance'
    : '';
  return L.divIcon({
    html: `<div class="vehicle-icon ${cls} vehicle-pulse">🚚</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function createWarehouseIcon() {
  return L.divIcon({
    html: `<div class="warehouse-icon">🏭</div>`,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function createCustomerIcon() {
  return L.divIcon({
    html: `<div class="customer-icon">📍</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Status bar counts
function getStatusCounts() {
  const inTransitOrders = orders.filter(o => ['in_transit','near_customer'].includes(o.status));
  return {
    onTime: inTransitOrders.filter(o => !o.delayReason && o.status !== 'delayed').length,
    risk: inTransitOrders.filter(o => o.status === 'near_customer' || o.delayReason === 'rain').length,
    delayed: orders.filter(o => o.status === 'delayed' || (o.delayReason && o.status === 'in_transit')).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };
}

interface FloatingCardProps {
  vehicle: Vehicle;
  order: Order | undefined;
  onClose: () => void;
}

function FloatingCard({ vehicle, order, onClose }: FloatingCardProps) {
  const driver = drivers.find(d => d.id === vehicle.driverId);
  const customer = order ? customers.find(c => c.id === order.customerId) : undefined;

  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <div>
            <div className="text-white font-bold text-sm">{vehicle.registration}</div>
            <div className="text-blue-200 text-xs">{vehicle.type}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors">✕</button>
      </div>

      <div className="p-4 space-y-3">
        {order && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Order</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{order.soNumber}</span>
            </div>
            {customer && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">ลูกค้า</span>
                <span className="text-xs font-medium text-slate-800 dark:text-white truncate max-w-40">{customer.name}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Sales</span>
              <span className="text-xs font-medium text-slate-800 dark:text-white">{order.salesName}</span>
            </div>
          </>
        )}

        {driver && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">คนขับ</span>
            <span className="text-xs font-medium text-slate-800 dark:text-white">{driver.name}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">ความเร็ว</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{vehicle.speed}</div>
            <div className="text-xs text-slate-400">km/h</div>
          </div>
          {order && (
            <>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">ETA</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{order.eta ? formatTime(order.eta) : '-'}</div>
                <div className="text-xs text-slate-400">เวลา</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">เหลือ</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{order.remainingKm ?? '-'}</div>
                <div className="text-xs text-slate-400">km</div>
              </div>
            </>
          )}
        </div>

        {/* Status */}
        {order && (
          <div className={`text-center text-xs font-semibold py-1.5 rounded-lg ${
            order.status === 'delayed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            : order.status === 'near_customer' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            {ORDER_STATUS_LABEL[order.status]}
            {order.delayReason && ` • ${order.delayNote}`}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {driver && (
            <a href={`tel:${driver.phone}`} className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">
              📞 โทรหาคนขับ
            </a>
          )}
          <button className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 rounded-lg transition-colors">
            🗺️ Google Maps
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 rounded-lg transition-colors">
            ⏱️ Timeline
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium py-2 rounded-lg transition-colors">
            ⚠️ Report Delay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LiveMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<'all' | 'on_time' | 'risk' | 'delayed' | 'delivered'>('all');
  const statusCounts = getStatusCounts();

  const inTransitOrders = orders.filter(o => ['in_transit','near_customer','delayed'].includes(o.status));

  const selectedOrder = selectedVehicle
    ? orders.find(o => o.vehicleId === selectedVehicle.id && ['in_transit','near_customer','delayed'].includes(o.status))
    : undefined;

  const filterButtons = [
    { key: 'all', label: 'ทั้งหมด', color: 'bg-slate-600 text-white', count: inTransitOrders.length },
    { key: 'on_time', label: 'On Time', color: 'bg-emerald-500 text-white', count: statusCounts.onTime },
    { key: 'risk', label: 'เสี่ยงล่าช้า', color: 'bg-amber-500 text-white', count: statusCounts.risk },
    { key: 'delayed', label: 'ล่าช้า', color: 'bg-red-500 text-white', count: statusCounts.delayed },
    { key: 'delivered', label: 'ส่งแล้ว', color: 'bg-blue-500 text-white', count: statusCounts.delivered },
  ];

  return (
    <Layout title="Live Delivery Map">
      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Left Sidebar */}
        <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">ยานพาหนะบนท้องถนน</h2>
            {/* Status filter */}
            <div className="flex flex-wrap gap-1.5">
              {filterButtons.map(btn => (
                <button
                  key={btn.key}
                  onClick={() => setFilter(btn.key as typeof filter)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${filter === btn.key ? btn.color : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                  {btn.label} ({btn.count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {vehicles.filter(v => v.status !== 'out_of_service').map(vehicle => {
              const order = orders.find(o => o.vehicleId === vehicle.id && ['in_transit','near_customer','delayed'].includes(o.status));
              const driver = drivers.find(d => d.id === vehicle.driverId);
              const isSelected = selectedVehicle?.id === vehicle.id;

              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(isSelected ? null : vehicle)}
                  className={`w-full text-left p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${
                      vehicle.status === 'in_transit' ? 'bg-blue-100 dark:bg-blue-900/40'
                      : vehicle.status === 'maintenance' ? 'bg-amber-100 dark:bg-amber-900/40'
                      : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      🚚
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{vehicle.registration}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          vehicle.status === 'in_transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : vehicle.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {VEHICLE_STATUS_LABEL[vehicle.status]}
                        </span>
                      </div>
                      {driver && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{driver.name}</div>}
                      {order && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate">{order.soNumber}</div>
                      )}
                      {vehicle.speed > 0 && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">{vehicle.speed} km/h</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom stats */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{vehicles.filter(v => v.status === 'in_transit').length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">กำลังวิ่ง</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{vehicles.filter(v => v.status === 'available').length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">พร้อมใช้</div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[13.7563, 100.6018]}
            zoom={11}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Warehouse */}
            <Marker position={WAREHOUSE_LOCATION} icon={createWarehouseIcon()}>
              <Popup>
                <div className="text-sm font-semibold">🏭 คลังสินค้า QTC</div>
                <div className="text-xs text-gray-500 mt-1">นิคมอุตสาหกรรมลาดกระบัง</div>
              </Popup>
            </Marker>

            {/* Customer locations */}
            {inTransitOrders.map(order => {
              const customer = customers.find(c => c.id === order.customerId);
              if (!customer) return null;
              return (
                <Marker key={`cust-${order.id}`} position={[customer.lat, customer.lng]} icon={createCustomerIcon()}>
                  <Popup>
                    <div className="text-sm font-semibold">{customer.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{order.soNumber}</div>
                    <div className="text-xs mt-1">ETA: {order.eta ? formatTime(order.eta) : '-'}</div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Routes */}
            {inTransitOrders.map(order => {
              if (order.routeCompleted && order.routeCompleted.length >= 2) {
                return <Polyline key={`rc-${order.id}`} positions={order.routeCompleted} color="#3b82f6" weight={3} opacity={0.8} />;
              }
              return null;
            })}
            {inTransitOrders.map(order => {
              if (order.route && order.route.length >= 2) {
                const remaining = order.status === 'delayed'
                  ? order.route.slice(order.routeCompleted?.length ? order.routeCompleted.length - 1 : 0)
                  : order.route.slice(order.routeCompleted?.length ? order.routeCompleted.length - 1 : 0);
                return <Polyline key={`rr-${order.id}`} positions={remaining} color={order.status === 'delayed' ? '#ef4444' : '#f59e0b'} weight={3} opacity={0.7} dashArray="8 4" />;
              }
              return null;
            })}

            {/* Vehicle markers */}
            {vehicles.filter(v => v.lat !== WAREHOUSE_LOCATION[0] && v.status === 'in_transit').map(vehicle => {
              const order = orders.find(o => o.vehicleId === vehicle.id);
              return (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lat, vehicle.lng]}
                  icon={createVehicleIcon(order?.status || vehicle.status)}
                  eventHandlers={{ click: () => setSelectedVehicle(vehicle) }}
                >
                  <Popup>
                    <div className="text-sm font-semibold">{vehicle.registration}</div>
                    <div className="text-xs text-gray-600">{vehicle.type}</div>
                    {order && <div className="text-xs text-blue-600 mt-1">{order.soNumber}</div>}
                    <div className="text-xs mt-1">{vehicle.speed} km/h</div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Top status bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
            <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-1.5 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-medium text-slate-800 dark:text-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full" />On Time: {statusCounts.onTime}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" />เสี่ยง: {statusCounts.risk}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full" />ล่าช้า: {statusCounts.delayed}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full" />ส่งแล้ว: {statusCounts.delivered}</span>
            </div>
          </div>

          {/* Route legend */}
          <div className="absolute bottom-6 right-6 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">สัญลักษณ์เส้นทาง</div>
            {[
              { color: '#3b82f6', solid: true, label: 'เส้นทางที่วิ่งแล้ว' },
              { color: '#f59e0b', solid: false, label: 'เส้นทางที่เหลือ' },
              { color: '#ef4444', solid: false, label: 'เสี่ยงล่าช้า' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mt-1.5">
                <div className="w-8 h-0.5 rounded" style={{ background: item.color, borderStyle: item.solid ? 'solid' : 'dashed', borderWidth: item.solid ? 0 : 1, borderColor: item.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Floating detail card */}
          {selectedVehicle && (
            <FloatingCard
              vehicle={selectedVehicle}
              order={selectedOrder}
              onClose={() => setSelectedVehicle(null)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
