export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready_to_load'
  | 'loaded'
  | 'in_transit'
  | 'near_customer'
  | 'delivered'
  | 'delayed'
  | 'cancelled';

export type VehicleStatus =
  | 'available'
  | 'in_transit'
  | 'idle'
  | 'maintenance'
  | 'out_of_service';

export type UserRole = 'admin' | 'sales' | 'logistics' | 'driver' | 'manager';

export type DelayReason =
  | 'traffic'
  | 'rain'
  | 'vehicle_breakdown'
  | 'customer_reschedule'
  | 'product_not_ready'
  | 'documentation_issue'
  | 'driver_issue'
  | 'other';

export type TimelineStep =
  | 'order_created'
  | 'picking'
  | 'packing'
  | 'loading'
  | 'vehicle_departed'
  | 'in_transit'
  | 'arrived_customer'
  | 'delivered';

export type MaintenanceType =
  | 'oil_change'
  | 'tire_replacement'
  | 'brake_service'
  | 'engine_service'
  | 'electrical'
  | 'body_repair'
  | 'inspection'
  | 'insurance'
  | 'tax'
  | 'other';

export interface Customer {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  phone: string;
  lat: number;
  lng: number;
  contact: string;
  email?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  status: 'active' | 'off_duty' | 'on_leave';
  vehicleId?: string;
  avatar?: string;
  joinDate: string;
  totalDeliveries: number;
  onTimeRate: number;
}

export interface Vehicle {
  id: string;
  registration: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  driverId?: string;
  mileage: number;
  fuel: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  taxExpiry: string;
  porobExpiry?: string;
  currentJobId?: string;
  payload: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  weight: number;
}

export interface Order {
  id: string;
  soNumber: string;
  customerId: string;
  salesName: string;
  salesPhone: string;
  vehicleId?: string;
  driverId?: string;
  status: OrderStatus;
  createdAt: string;
  scheduledDelivery: string;
  actualDelivery?: string;
  eta?: string;
  remainingKm?: number;
  delayReason?: DelayReason;
  delayNote?: string;
  podStatus: 'pending' | 'uploaded' | 'verified';
  items: OrderItem[];
  totalAmount: number;
  totalWeight: number;
  notes?: string;
  outsourceCompany?: string;
  route?: [number, number][];
  routeCompleted?: [number, number][];
}

export interface TimelineEvent {
  id: string;
  orderId: string;
  step: TimelineStep;
  timestamp: string;
  responsible: string;
  notes?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: MaintenanceType;
  description: string;
  vendor: string;
  cost: number;
  mileage: number;
  notes?: string;
  status: 'completed' | 'pending' | 'in_progress';
  nextServiceMileage?: number;
  nextServiceDate?: string;
}

export interface PODRecord {
  id: string;
  orderId: string;
  receiverName: string;
  receiverPhone: string;
  gps: [number, number];
  deliveryTime: string;
  driverId: string;
  photos: string[];
  signatureUrl?: string;
  notes?: string;
  status: 'pending' | 'uploaded' | 'verified';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  icon: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  vehicleId?: string;
}

export interface KPIData {
  ordersToday: number;
  ordersInTransit: number;
  ordersDelivered: number;
  ordersDelayed: number;
  onTimeRate: number;
  transportCost: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  totalOrders: number;
  avgDeliveryTime: number;
  podCompletionRate: number;
  deliverySuccessRate: number;
  costPerDelivery: number;
  fleetUtilization: number;
}

export interface ActivityItem {
  id: string;
  type: 'departure' | 'delivery' | 'breakdown' | 'delay' | 'reschedule' | 'maintenance';
  icon: string;
  message: string;
  detail: string;
  timestamp: string;
  orderId?: string;
  vehicleId?: string;
}
