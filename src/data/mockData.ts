import type {
  Customer, Driver, Vehicle, Order, TimelineEvent,
  MaintenanceRecord, PODRecord, Notification, ActivityItem
} from '../types';

// ============================================================
// CUSTOMERS (20)
// ============================================================
export const customers: Customer[] = [
  { id: 'C001', name: 'บริษัท สยามพาณิชย์ จำกัด', address: '123 ถ.สุขุมวิท', district: 'วัฒนา', province: 'กรุงเทพมหานคร', phone: '02-234-5678', lat: 13.7308, lng: 100.5691, contact: 'คุณสมหญิง', email: 'siam@example.com' },
  { id: 'C002', name: 'ห้างหุ้นส่วน เจริญกิจ', address: '456 ถ.พหลโยธิน', district: 'จตุจักร', province: 'กรุงเทพมหานคร', phone: '02-345-6789', lat: 13.8198, lng: 100.5500, contact: 'คุณวีระ', email: 'charoen@example.com' },
  { id: 'C003', name: 'บริษัท ไทยอินเตอร์ เทรด จำกัด', address: '789 ถ.ลาดพร้าว', district: 'ลาดพร้าว', province: 'กรุงเทพมหานคร', phone: '02-456-7890', lat: 13.7955, lng: 100.6095, contact: 'คุณสมศรี', email: 'thaiinter@example.com' },
  { id: 'C004', name: 'บริษัท มีทรัพย์ดี จำกัด', address: '321 ถ.รามคำแหง', district: 'บางกะปิ', province: 'กรุงเทพมหานคร', phone: '02-567-8901', lat: 13.7700, lng: 100.6453, contact: 'คุณประพันธ์', email: 'meesap@example.com' },
  { id: 'C005', name: 'ห้างหุ้นส่วน สุขสมบูรณ์', address: '654 ถ.บางนา-ตราด', district: 'บางนา', province: 'กรุงเทพมหานคร', phone: '02-678-9012', lat: 13.6655, lng: 100.6008, contact: 'คุณนิภา', email: 'suksomboon@example.com' },
  { id: 'C006', name: 'บริษัท อีซี่ โลจิสติกส์ จำกัด', address: '987 ถ.สุขุมวิท 107', district: 'บางพลี', province: 'สมุทรปราการ', phone: '02-789-0123', lat: 13.5938, lng: 100.6849, contact: 'คุณรัตนา', email: 'easy@example.com' },
  { id: 'C007', name: 'บริษัท เบสท์ซัพพลาย จำกัด', address: '147 ถ.งามวงศ์วาน', district: 'เมือง', province: 'นนทบุรี', phone: '02-890-1234', lat: 13.8456, lng: 100.5278, contact: 'คุณธนภัทร', email: 'best@example.com' },
  { id: 'C008', name: 'ห้างหุ้นส่วน รุ่งเรืองพาณิชย์', address: '258 ถ.รังสิต-นครนายก', district: 'ธัญบุรี', province: 'ปทุมธานี', phone: '02-901-2345', lat: 14.0188, lng: 100.7385, contact: 'คุณกมลา', email: 'rungrueang@example.com' },
  { id: 'C009', name: 'บริษัท เอเชียน ทรัค จำกัด', address: '369 ถ.รามคำแหง 187', district: 'มีนบุรี', province: 'กรุงเทพมหานคร', phone: '02-012-3456', lat: 13.7863, lng: 100.7396, contact: 'คุณปริญญา', email: 'asiantruck@example.com' },
  { id: 'C010', name: 'บริษัท ดีคาร์โก้ จำกัด', address: '741 ถ.วิภาวดีรังสิต', district: 'ดอนเมือง', province: 'กรุงเทพมหานคร', phone: '02-123-4567', lat: 13.9126, lng: 100.5965, contact: 'คุณสุดา', email: 'decargo@example.com' },
  { id: 'C011', name: 'บริษัท ฟาสต์เดลิเวอรี จำกัด', address: '852 ถ.แจ้งวัฒนะ', district: 'หลักสี่', province: 'กรุงเทพมหานคร', phone: '02-234-5670', lat: 13.8861, lng: 100.5797, contact: 'คุณมาลี', email: 'fastdelivery@example.com' },
  { id: 'C012', name: 'บริษัท เซ็นทรัลโลจิสติก จำกัด', address: '963 ถ.ราชวิถี', district: 'ดุสิต', province: 'กรุงเทพมหานคร', phone: '02-345-6780', lat: 13.7760, lng: 100.5105, contact: 'คุณชัยวิชย์', email: 'central@example.com' },
  { id: 'C013', name: 'ห้างหุ้นส่วน เทพสมบูรณ์', address: '174 ถ.รัชดาภิเษก', district: 'ห้วยขวาง', province: 'กรุงเทพมหานคร', phone: '02-456-7800', lat: 13.7738, lng: 100.5755, contact: 'คุณอมรรัตน์', email: 'thepsomboon@example.com' },
  { id: 'C014', name: 'บริษัท ทรงพล เทรดดิ้ง จำกัด', address: '285 ถ.รัชดาภิเษก 32', district: 'ลาดยาว', province: 'กรุงเทพมหานคร', phone: '02-567-8900', lat: 13.8128, lng: 100.5652, contact: 'คุณทรงศักดิ์', email: 'songpon@example.com' },
  { id: 'C015', name: 'บริษัท ยูนิตี้ ซัพพลาย จำกัด', address: '396 ถ.กาญจนาภิเษก', district: 'บางซื่อ', province: 'กรุงเทพมหานคร', phone: '02-678-9000', lat: 13.8233, lng: 100.5263, contact: 'คุณพัชรี', email: 'unity@example.com' },
  { id: 'C016', name: 'บริษัท เอ็กซ์เพรส โลจิส จำกัด', address: '507 นิคมอุตสาหกรรมลาดกระบัง', district: 'ลาดกระบัง', province: 'กรุงเทพมหานคร', phone: '02-789-0100', lat: 13.7180, lng: 100.7682, contact: 'คุณกฤตยา', email: 'express@example.com' },
  { id: 'C017', name: 'บริษัท ซีทีเอส เทรด จำกัด', address: '618 ถ.หน้าสนามบิน', district: 'ราษฎร์บูรณะ', province: 'สมุทรปราการ', phone: '02-890-1200', lat: 13.6830, lng: 100.7507, contact: 'คุณวรวุฒิ', email: 'cts@example.com' },
  { id: 'C018', name: 'ห้างหุ้นส่วน ศิริมังกร', address: '729 ถ.เทพารักษ์', district: 'บางพลี', province: 'สมุทรปราการ', phone: '02-901-2300', lat: 13.5890, lng: 100.6700, contact: 'คุณศิริพร', email: 'sirimangkorn@example.com' },
  { id: 'C019', name: 'บริษัท โกลบอล ซัพพลาย จำกัด', address: '830 ถ.พระราม 2', district: 'เมือง', province: 'สมุทรสาคร', phone: '034-012-345', lat: 13.5500, lng: 100.2740, contact: 'คุณพงศกร', email: 'global@example.com' },
  { id: 'C020', name: 'บริษัท เมกะ โลจิสติกส์ จำกัด', address: '941 ถ.พุทธมณฑลสาย 4', district: 'เมือง', province: 'นครปฐม', phone: '034-123-456', lat: 13.8200, lng: 100.0380, contact: 'คุณอัจฉรา', email: 'mega@example.com' },
];

// ============================================================
// DRIVERS (10)
// ============================================================
export const drivers: Driver[] = [
  { id: 'D001', name: 'สมชาย วงศ์ดี', phone: '081-234-5678', license: 'ทบ.12345', status: 'active', vehicleId: 'V001', joinDate: '2020-03-15', totalDeliveries: 1245, onTimeRate: 94.2 },
  { id: 'D002', name: 'วิชัย มีสุข', phone: '082-345-6789', license: 'ทบ.23456', status: 'active', vehicleId: 'V002', joinDate: '2019-07-20', totalDeliveries: 1560, onTimeRate: 91.8 },
  { id: 'D003', name: 'ประสิทธิ์ ดีงาม', phone: '083-456-7890', license: 'ทบ.34567', status: 'active', vehicleId: 'V003', joinDate: '2021-01-10', totalDeliveries: 892, onTimeRate: 96.5 },
  { id: 'D004', name: 'อำนาจ สุขใจ', phone: '084-567-8901', license: 'ทบ.45678', status: 'active', vehicleId: 'V004', joinDate: '2020-09-05', totalDeliveries: 1105, onTimeRate: 89.3 },
  { id: 'D005', name: 'มานพ วิเศษ', phone: '085-678-9012', license: 'ทบ.56789', status: 'active', vehicleId: 'V005', joinDate: '2022-02-28', totalDeliveries: 678, onTimeRate: 97.1 },
  { id: 'D006', name: 'สุรชัย ทองดี', phone: '086-789-0123', license: 'ทบ.67890', status: 'active', vehicleId: 'V006', joinDate: '2019-11-15', totalDeliveries: 1780, onTimeRate: 92.6 },
  { id: 'D007', name: 'ยงยุทธ สมบัติ', phone: '087-890-1234', license: 'ทบ.78901', status: 'active', vehicleId: 'V007', joinDate: '2021-06-01', totalDeliveries: 934, onTimeRate: 93.9 },
  { id: 'D008', name: 'ชัยวัฒน์ เจริญ', phone: '088-901-2345', license: 'ทบ.89012', status: 'off_duty', vehicleId: 'V008', joinDate: '2020-04-22', totalDeliveries: 1023, onTimeRate: 88.7 },
  { id: 'D009', name: 'ธนชัย พรมมา', phone: '089-012-3456', license: 'ทบ.90123', status: 'active', vehicleId: 'V009', joinDate: '2022-08-14', totalDeliveries: 456, onTimeRate: 95.8 },
  { id: 'D010', name: 'สุรศักดิ์ บุญมี', phone: '080-123-4567', license: 'ทบ.01234', status: 'on_leave', vehicleId: undefined, joinDate: '2018-12-01', totalDeliveries: 2340, onTimeRate: 90.4 },
];

// Warehouse location: Lat Krabang Industrial Estate
const WAREHOUSE: [number, number] = [13.7275, 100.7826];

// ============================================================
// VEHICLES (10)
// ============================================================
export const vehicles: Vehicle[] = [
  { id: 'V001', registration: '80-1234 กท.', type: 'รถบรรทุก 6 ล้อ', brand: 'Isuzu', model: 'NQR', year: 2020, status: 'in_transit', driverId: 'D001', mileage: 125340, fuel: 72, lat: 13.7480, lng: 100.6920, speed: 45, heading: 270, lastMaintenance: '2026-05-01', nextMaintenance: '2026-08-01', insuranceExpiry: '2026-12-31', taxExpiry: '2026-11-30', currentJobId: 'O001', payload: 5000 },
  { id: 'V002', registration: '80-5678 กท.', type: 'รถบรรทุก 10 ล้อ', brand: 'Hino', model: 'FC', year: 2019, status: 'in_transit', driverId: 'D002', mileage: 198560, fuel: 55, lat: 13.7950, lng: 100.6200, speed: 38, heading: 315, lastMaintenance: '2026-04-15', nextMaintenance: '2026-07-15', insuranceExpiry: '2026-10-31', taxExpiry: '2026-09-30', currentJobId: 'O006', payload: 10000 },
  { id: 'V003', registration: '80-9012 กท.', type: 'รถกระบะ', brand: 'Toyota', model: 'Hilux Revo', year: 2022, status: 'available', driverId: 'D003', mileage: 45200, fuel: 88, lat: 13.7275, lng: 100.7826, speed: 0, heading: 0, lastMaintenance: '2026-05-20', nextMaintenance: '2026-08-20', insuranceExpiry: '2027-01-31', taxExpiry: '2026-12-31', currentJobId: undefined, payload: 1000 },
  { id: 'V004', registration: '70-1234 กท.', type: 'รถบรรทุก 6 ล้อ', brand: 'Isuzu', model: 'FRR', year: 2021, status: 'in_transit', driverId: 'D004', mileage: 87650, fuel: 43, lat: 13.6720, lng: 100.6350, speed: 52, heading: 180, lastMaintenance: '2026-03-10', nextMaintenance: '2026-06-10', insuranceExpiry: '2026-08-31', taxExpiry: '2026-07-31', currentJobId: 'O012', payload: 5000 },
  { id: 'V005', registration: '70-5678 กท.', type: 'รถบรรทุก 10 ล้อ', brand: 'Hino', model: 'GH', year: 2018, status: 'idle', driverId: 'D005', mileage: 245780, fuel: 61, lat: 13.7275, lng: 100.7826, speed: 0, heading: 0, lastMaintenance: '2026-05-05', nextMaintenance: '2026-08-05', insuranceExpiry: '2026-11-30', taxExpiry: '2026-10-31', currentJobId: undefined, payload: 10000 },
  { id: 'V006', registration: '70-9012 กท.', type: 'รถบรรทุก 6 ล้อ', brand: 'Isuzu', model: 'NQR', year: 2020, status: 'in_transit', driverId: 'D006', mileage: 112350, fuel: 38, lat: 13.8150, lng: 100.5500, speed: 29, heading: 90, lastMaintenance: '2026-04-20', nextMaintenance: '2026-07-20', insuranceExpiry: '2026-12-31', taxExpiry: '2026-11-30', currentJobId: 'O018', payload: 5000 },
  { id: 'V007', registration: '60-1234 กท.', type: 'รถบรรทุก 6 ล้อ', brand: 'Mitsubishi', model: 'Canter', year: 2019, status: 'in_transit', driverId: 'D007', mileage: 156780, fuel: 67, lat: 13.8490, lng: 100.5900, speed: 41, heading: 45, lastMaintenance: '2026-05-10', nextMaintenance: '2026-08-10', insuranceExpiry: '2026-09-30', taxExpiry: '2026-08-31', currentJobId: 'O023', payload: 5000 },
  { id: 'V008', registration: '60-5678 กท.', type: 'รถบรรทุก 10 ล้อ', brand: 'Hino', model: 'FC', year: 2017, status: 'maintenance', driverId: 'D008', mileage: 312560, fuel: 25, lat: 13.7275, lng: 100.7826, speed: 0, heading: 0, lastMaintenance: '2026-06-09', nextMaintenance: '2026-09-09', insuranceExpiry: '2026-07-31', taxExpiry: '2026-06-30', currentJobId: undefined, payload: 10000 },
  { id: 'V009', registration: '60-9012 กท.', type: 'รถกระบะ', brand: 'Ford', model: 'Ranger', year: 2023, status: 'available', driverId: 'D009', mileage: 22100, fuel: 92, lat: 13.7275, lng: 100.7826, speed: 0, heading: 0, lastMaintenance: '2026-06-01', nextMaintenance: '2026-09-01', insuranceExpiry: '2027-02-28', taxExpiry: '2027-01-31', currentJobId: undefined, payload: 1000 },
  { id: 'V010', registration: '50-1234 กท.', type: 'รถบรรทุก 6 ล้อ', brand: 'Isuzu', model: 'FTR', year: 2016, status: 'out_of_service', driverId: undefined, mileage: 445230, fuel: 0, lat: 13.7275, lng: 100.7826, speed: 0, heading: 0, lastMaintenance: '2026-05-28', nextMaintenance: '2026-08-28', insuranceExpiry: '2026-06-30', taxExpiry: '2026-05-31', currentJobId: undefined, payload: 7000 },
];

// ============================================================
// ORDERS (50)
// ============================================================
const salesTeam = [
  { name: 'คุณเมย์', phone: '091-111-1111' },
  { name: 'คุณตั้ม', phone: '092-222-2222' },
  { name: 'คุณนุ้ย', phone: '093-333-3333' },
  { name: 'คุณปู', phone: '094-444-4444' },
  { name: 'คุณแจ็ค', phone: '095-555-5555' },
];

export const orders: Order[] = [
  // In Transit Orders
  { id: 'O001', soNumber: 'SO-2026-001', customerId: 'C001', salesName: 'คุณเมย์', salesPhone: '091-111-1111', vehicleId: 'V001', driverId: 'D001', status: 'in_transit', createdAt: '2026-06-11T07:00:00', scheduledDelivery: '2026-06-11T14:00:00', eta: '2026-06-11T13:45:00', remainingKm: 12.5, podStatus: 'pending', items: [{ id: 'I001', name: 'เครื่องใช้สำนักงาน', quantity: 50, unit: 'กล่อง', weight: 250 }], totalAmount: 125000, totalWeight: 250, route: [[13.7275, 100.7826], [13.7480, 100.6920], [13.7308, 100.5691]], routeCompleted: [[13.7275, 100.7826], [13.7480, 100.6920]] },
  { id: 'O002', soNumber: 'SO-2026-002', customerId: 'C003', salesName: 'คุณตั้ม', salesPhone: '092-222-2222', vehicleId: 'V001', driverId: 'D001', status: 'in_transit', createdAt: '2026-06-11T07:00:00', scheduledDelivery: '2026-06-11T16:00:00', eta: '2026-06-11T15:30:00', remainingKm: 8.2, podStatus: 'pending', items: [{ id: 'I002', name: 'อุปกรณ์ IT', quantity: 20, unit: 'ชิ้น', weight: 120 }], totalAmount: 89000, totalWeight: 120 },
  { id: 'O003', soNumber: 'SO-2026-003', customerId: 'C005', salesName: 'คุณนุ้ย', salesPhone: '093-333-3333', vehicleId: 'V006', driverId: 'D006', status: 'in_transit', createdAt: '2026-06-11T06:30:00', scheduledDelivery: '2026-06-11T12:00:00', eta: '2026-06-11T12:45:00', remainingKm: 5.8, delayReason: 'traffic', delayNote: 'รถติดทางด่วนบางนา', podStatus: 'pending', items: [{ id: 'I003', name: 'วัสดุก่อสร้าง', quantity: 100, unit: 'ถุง', weight: 2000 }], totalAmount: 45000, totalWeight: 2000, route: [[13.7275, 100.7826], [13.8150, 100.5500], [13.6655, 100.6008]], routeCompleted: [[13.7275, 100.7826], [13.8150, 100.5500]] },
  { id: 'O004', soNumber: 'SO-2026-004', customerId: 'C007', salesName: 'คุณปู', salesPhone: '094-444-4444', vehicleId: 'V007', driverId: 'D007', status: 'near_customer', createdAt: '2026-06-11T06:00:00', scheduledDelivery: '2026-06-11T11:00:00', eta: '2026-06-11T10:55:00', remainingKm: 1.2, podStatus: 'pending', items: [{ id: 'I004', name: 'สินค้าทั่วไป', quantity: 80, unit: 'กล่อง', weight: 400 }], totalAmount: 67000, totalWeight: 400, route: [[13.7275, 100.7826], [13.8490, 100.5900], [13.8456, 100.5278]], routeCompleted: [[13.7275, 100.7826], [13.8490, 100.5900]] },
  { id: 'O005', soNumber: 'SO-2026-005', customerId: 'C002', salesName: 'คุณแจ็ค', salesPhone: '095-555-5555', vehicleId: 'V002', driverId: 'D002', status: 'in_transit', createdAt: '2026-06-11T07:30:00', scheduledDelivery: '2026-06-11T15:00:00', eta: '2026-06-11T14:50:00', remainingKm: 15.3, podStatus: 'pending', items: [{ id: 'I005', name: 'เฟอร์นิเจอร์', quantity: 30, unit: 'ชิ้น', weight: 1500 }], totalAmount: 230000, totalWeight: 1500, route: [[13.7275, 100.7826], [13.7950, 100.6200], [13.8198, 100.5500]], routeCompleted: [[13.7275, 100.7826], [13.7950, 100.6200]] },
  { id: 'O006', soNumber: 'SO-2026-006', customerId: 'C009', salesName: 'คุณเมย์', salesPhone: '091-111-1111', vehicleId: 'V002', driverId: 'D002', status: 'delayed', createdAt: '2026-06-11T05:00:00', scheduledDelivery: '2026-06-11T10:00:00', eta: '2026-06-11T13:30:00', remainingKm: 22.1, delayReason: 'vehicle_breakdown', delayNote: 'รถมีปัญหาเรื่องยาง ซ่อมแซมเสร็จแล้ว', podStatus: 'pending', items: [{ id: 'I006', name: 'อะไหล่รถยนต์', quantity: 200, unit: 'ชิ้น', weight: 800 }], totalAmount: 156000, totalWeight: 800 },
  // Delivered Orders
  { id: 'O007', soNumber: 'SO-2026-007', customerId: 'C004', salesName: 'คุณตั้ม', salesPhone: '092-222-2222', vehicleId: 'V003', driverId: 'D003', status: 'delivered', createdAt: '2026-06-11T06:00:00', scheduledDelivery: '2026-06-11T10:00:00', actualDelivery: '2026-06-11T09:48:00', podStatus: 'verified', items: [{ id: 'I007', name: 'อาหารแห้ง', quantity: 150, unit: 'กล่อง', weight: 750 }], totalAmount: 88000, totalWeight: 750 },
  { id: 'O008', soNumber: 'SO-2026-008', customerId: 'C008', salesName: 'คุณนุ้ย', salesPhone: '093-333-3333', vehicleId: 'V005', driverId: 'D005', status: 'delivered', createdAt: '2026-06-10T08:00:00', scheduledDelivery: '2026-06-10T14:00:00', actualDelivery: '2026-06-10T14:22:00', podStatus: 'verified', items: [{ id: 'I008', name: 'เครื่องมือช่าง', quantity: 40, unit: 'กล่อง', weight: 320 }], totalAmount: 195000, totalWeight: 320 },
  { id: 'O009', soNumber: 'SO-2026-009', customerId: 'C010', salesName: 'คุณปู', salesPhone: '094-444-4444', vehicleId: 'V009', driverId: 'D009', status: 'delivered', createdAt: '2026-06-10T07:00:00', scheduledDelivery: '2026-06-10T12:00:00', actualDelivery: '2026-06-10T11:55:00', podStatus: 'verified', items: [{ id: 'I009', name: 'อุปกรณ์ไฟฟ้า', quantity: 60, unit: 'ชิ้น', weight: 180 }], totalAmount: 74000, totalWeight: 180 },
  { id: 'O010', soNumber: 'SO-2026-010', customerId: 'C012', salesName: 'คุณแจ็ค', salesPhone: '095-555-5555', vehicleId: 'V003', driverId: 'D003', status: 'delivered', createdAt: '2026-06-10T06:30:00', scheduledDelivery: '2026-06-10T11:00:00', actualDelivery: '2026-06-10T11:10:00', podStatus: 'uploaded', items: [{ id: 'I010', name: 'กระดาษ A4', quantity: 500, unit: 'รีม', weight: 1250 }], totalAmount: 45000, totalWeight: 1250 },
  { id: 'O011', soNumber: 'SO-2026-011', customerId: 'C006', salesName: 'คุณเมย์', salesPhone: '091-111-1111', vehicleId: 'V007', driverId: 'D007', status: 'delivered', createdAt: '2026-06-10T08:30:00', scheduledDelivery: '2026-06-10T15:00:00', actualDelivery: '2026-06-10T16:30:00', delayReason: 'traffic', delayNote: 'รถติดช่วงสุขุมวิท', podStatus: 'verified', items: [{ id: 'I011', name: 'สินค้านำเข้า', quantity: 100, unit: 'กล่อง', weight: 600 }], totalAmount: 312000, totalWeight: 600 },
  { id: 'O012', soNumber: 'SO-2026-012', customerId: 'C013', salesName: 'คุณตั้ม', salesPhone: '092-222-2222', vehicleId: 'V004', driverId: 'D004', status: 'in_transit', createdAt: '2026-06-11T08:00:00', scheduledDelivery: '2026-06-11T13:00:00', eta: '2026-06-11T12:50:00', remainingKm: 9.7, podStatus: 'pending', items: [{ id: 'I012', name: 'เครื่องดื่ม', quantity: 200, unit: 'ลัง', weight: 2400 }], totalAmount: 56000, totalWeight: 2400, route: [[13.7275, 100.7826], [13.6720, 100.6350], [13.7738, 100.5755]], routeCompleted: [[13.7275, 100.7826], [13.6720, 100.6350]] },
  // Preparing/Loading Orders
  { id: 'O013', soNumber: 'SO-2026-013', customerId: 'C011', salesName: 'คุณนุ้ย', salesPhone: '093-333-3333', status: 'preparing', createdAt: '2026-06-11T09:00:00', scheduledDelivery: '2026-06-11T17:00:00', podStatus: 'pending', items: [{ id: 'I013', name: 'วัสดุบรรจุภัณฑ์', quantity: 300, unit: 'ชิ้น', weight: 450 }], totalAmount: 78000, totalWeight: 450 },
  { id: 'O014', soNumber: 'SO-2026-014', customerId: 'C015', salesName: 'คุณปู', salesPhone: '094-444-4444', status: 'ready_to_load', createdAt: '2026-06-11T08:00:00', scheduledDelivery: '2026-06-11T15:00:00', podStatus: 'pending', items: [{ id: 'I014', name: 'อุปกรณ์โรงงาน', quantity: 25, unit: 'ชิ้น', weight: 750 }], totalAmount: 145000, totalWeight: 750 },
  { id: 'O015', soNumber: 'SO-2026-015', customerId: 'C017', salesName: 'คุณแจ็ค', salesPhone: '095-555-5555', status: 'loaded', vehicleId: 'V009', driverId: 'D009', createdAt: '2026-06-11T09:30:00', scheduledDelivery: '2026-06-11T16:00:00', podStatus: 'pending', items: [{ id: 'I015', name: 'สินค้าอิเล็กทรอนิกส์', quantity: 50, unit: 'ชิ้น', weight: 200 }], totalAmount: 255000, totalWeight: 200 },
  { id: 'O016', soNumber: 'SO-2026-016', customerId: 'C019', salesName: 'คุณเมย์', salesPhone: '091-111-1111', status: 'pending', createdAt: '2026-06-11T10:00:00', scheduledDelivery: '2026-06-12T10:00:00', podStatus: 'pending', items: [{ id: 'I016', name: 'สินค้าเกษตร', quantity: 400, unit: 'กระสอบ', weight: 8000 }], totalAmount: 96000, totalWeight: 8000 },
  { id: 'O017', soNumber: 'SO-2026-017', customerId: 'C020', salesName: 'คุณตั้ม', salesPhone: '092-222-2222', status: 'pending', createdAt: '2026-06-11T10:30:00', scheduledDelivery: '2026-06-12T14:00:00', podStatus: 'pending', items: [{ id: 'I017', name: 'เครื่องจักรกล', quantity: 5, unit: 'ชิ้น', weight: 2500 }], totalAmount: 450000, totalWeight: 2500 },
  { id: 'O018', soNumber: 'SO-2026-018', customerId: 'C014', salesName: 'คุณนุ้ย', salesPhone: '093-333-3333', vehicleId: 'V006', driverId: 'D006', status: 'in_transit', createdAt: '2026-06-11T07:00:00', scheduledDelivery: '2026-06-11T14:00:00', eta: '2026-06-11T14:20:00', remainingKm: 7.3, delayReason: 'rain', delayNote: 'ฝนตกหนักช่วงนนทบุรี', podStatus: 'pending', items: [{ id: 'I018', name: 'ผ้าและสิ่งทอ', quantity: 120, unit: 'กล่อง', weight: 960 }], totalAmount: 134000, totalWeight: 960, route: [[13.7275, 100.7826], [13.8128, 100.5652], [13.8233, 100.5263]], routeCompleted: [[13.7275, 100.7826], [13.8128, 100.5652]] },
  { id: 'O019', soNumber: 'SO-2026-019', customerId: 'C016', salesName: 'คุณปู', salesPhone: '094-444-4444', vehicleId: 'V004', driverId: 'D004', status: 'in_transit', createdAt: '2026-06-11T06:00:00', scheduledDelivery: '2026-06-11T11:00:00', eta: '2026-06-11T11:05:00', remainingKm: 3.1, podStatus: 'pending', items: [{ id: 'I019', name: 'อุปกรณ์นิรภัย', quantity: 80, unit: 'ชิ้น', weight: 240 }], totalAmount: 89500, totalWeight: 240 },
  { id: 'O020', soNumber: 'SO-2026-020', customerId: 'C018', salesName: 'คุณแจ็ค', salesPhone: '095-555-5555', status: 'cancelled', createdAt: '2026-06-10T08:00:00', scheduledDelivery: '2026-06-11T10:00:00', delayReason: 'customer_reschedule', delayNote: 'ลูกค้าขอยกเลิก', podStatus: 'pending', items: [{ id: 'I020', name: 'วัสดุซ่อมแซม', quantity: 60, unit: 'ชิ้น', weight: 360 }], totalAmount: 43000, totalWeight: 360 },
  // More delivered orders (historical data)
  ...[21,22,23,24,25,26,27,28,29,30].map(n => ({
    id: `O0${n}`,
    soNumber: `SO-2026-0${n.toString().padStart(2,'0')}`,
    customerId: `C0${String(((n-1)%20)+1).padStart(2,'0')}`,
    salesName: salesTeam[(n-1)%5].name,
    salesPhone: salesTeam[(n-1)%5].phone,
    vehicleId: `V00${((n-1)%9)+1}`,
    driverId: `D00${((n-1)%9)+1}`,
    status: 'delivered' as const,
    createdAt: `2026-06-${String(10-(n-21)).padStart(2,'0')}T0${(n%8)+1}:00:00`,
    scheduledDelivery: `2026-06-${String(10-(n-21)).padStart(2,'0')}T${13+(n%5)}:00:00`,
    actualDelivery: `2026-06-${String(10-(n-21)).padStart(2,'0')}T${13+(n%5)+((n%3===0)?1:0)}:${n%3===0 ? '30':'15'}:00`,
    delayReason: n%5===0 ? 'traffic' as const : undefined,
    podStatus: 'verified' as const,
    items: [{ id: `I0${n}`, name: `สินค้า ${n}`, quantity: 30+(n*5), unit: 'กล่อง', weight: 200+(n*20) }],
    totalAmount: 50000+(n*15000),
    totalWeight: 200+(n*20),
  })),
  ...[31,32,33,34,35,36,37,38,39,40].map(n => ({
    id: `O0${n}`,
    soNumber: `SO-2026-0${n.toString().padStart(2,'0')}`,
    customerId: `C0${String(((n-1)%20)+1).padStart(2,'0')}`,
    salesName: salesTeam[(n-1)%5].name,
    salesPhone: salesTeam[(n-1)%5].phone,
    vehicleId: `V00${((n-1)%9)+1}`,
    driverId: `D00${((n-1)%9)+1}`,
    status: 'delivered' as const,
    createdAt: `2026-06-${String(n-25).padStart(2,'0')}T08:00:00`,
    scheduledDelivery: `2026-06-${String(n-25).padStart(2,'0')}T14:00:00`,
    actualDelivery: `2026-06-${String(n-25).padStart(2,'0')}T${14+((n%3===0)?1:0)}:20:00`,
    delayReason: n%7===0 ? 'rain' as const : undefined,
    podStatus: n%3===0 ? 'uploaded' as const : 'verified' as const,
    items: [{ id: `I0${n}`, name: `สินค้า ${n}`, quantity: 20+(n*3), unit: 'กล่อง', weight: 150+(n*15) }],
    totalAmount: 45000+(n*12000),
    totalWeight: 150+(n*15),
  })),
  ...[41,42,43,44,45,46,47,48,49,50].map(n => ({
    id: `O0${n}`,
    soNumber: `SO-2026-0${n.toString().padStart(2,'0')}`,
    customerId: `C0${String(((n-1)%20)+1).padStart(2,'0')}`,
    salesName: salesTeam[(n-1)%5].name,
    salesPhone: salesTeam[(n-1)%5].phone,
    vehicleId: `V00${((n-1)%9)+1}`,
    driverId: `D00${((n-1)%9)+1}`,
    status: n%3===0 ? 'delayed' as const : n%5===0 ? 'preparing' as const : 'delivered' as const,
    createdAt: `2026-06-${String(n-36).padStart(2,'0')}T09:00:00`,
    scheduledDelivery: `2026-06-${String(n-36).padStart(2,'0')}T15:00:00`,
    actualDelivery: n%3!==0 && n%5!==0 ? `2026-06-${String(n-36).padStart(2,'0')}T15:45:00` : undefined,
    delayReason: n%3===0 ? 'customer_reschedule' as const : undefined,
    podStatus: n%3!==0 && n%5!==0 ? 'verified' as const : 'pending' as const,
    items: [{ id: `I0${n}`, name: `สินค้า ${n}`, quantity: 25+(n*4), unit: 'กล่อง', weight: 180+(n*18) }],
    totalAmount: 60000+(n*10000),
    totalWeight: 180+(n*18),
  })),
];

// ============================================================
// TIMELINE EVENTS (100+)
// ============================================================
const timelineSteps = ['order_created','picking','packing','loading','vehicle_departed','in_transit','arrived_customer','delivered'] as const;
const responsibles = ['ระบบ', 'สมชาย วงศ์ดี', 'วิชัย มีสุข', 'ประสิทธิ์ ดีงาม', 'ฝ่ายคลัง', 'ฝ่ายจัดส่ง'];

export const timelineEvents: TimelineEvent[] = orders.flatMap((order) => {
  const statusIdx = timelineSteps.findIndex(s => {
    const map: Record<string, number> = {
      pending:0, preparing:1, ready_to_load:2, loaded:3,
      in_transit:4, near_customer:5, delayed:4, delivered:7, cancelled:0,
    };
    return s === timelineSteps[map[order.status] ?? 0];
  });
  const baseTime = new Date(order.createdAt).getTime();
  return timelineSteps.slice(0, Math.max(1, statusIdx + 2)).map((step, si) => ({
    id: `TL-${order.id}-${si}`,
    orderId: order.id,
    step,
    timestamp: new Date(baseTime + si * 45 * 60000).toISOString(),
    responsible: responsibles[si % responsibles.length],
    notes: si === 0 ? `สร้างออเดอร์ ${order.soNumber}` : undefined,
    status: si < statusIdx + 1 ? 'completed' as const : si === statusIdx + 1 && order.status !== 'delivered' ? 'in_progress' as const : 'pending' as const,
  }));
});

// ============================================================
// MAINTENANCE RECORDS (20)
// ============================================================
export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'M001', vehicleId: 'V001', date: '2026-05-01', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง + ไส้กรอง', vendor: 'อีซูซุ เซ็นเตอร์ ลาดกระบัง', cost: 2800, mileage: 124000, status: 'completed', nextServiceMileage: 129000, nextServiceDate: '2026-08-01' },
  { id: 'M002', vehicleId: 'V002', date: '2026-04-15', type: 'tire_replacement', description: 'เปลี่ยนยาง 4 เส้น', vendor: 'ศูนย์บริการฮีโน่ บางนา', cost: 18000, mileage: 196000, status: 'completed', nextServiceDate: '2026-10-15' },
  { id: 'M003', vehicleId: 'V004', date: '2026-03-10', type: 'brake_service', description: 'ซ่อมระบบเบรก ฝั่งหน้า', vendor: 'อู่ช่างแมน', cost: 5500, mileage: 85000, status: 'completed', nextServiceDate: '2026-09-10' },
  { id: 'M004', vehicleId: 'V008', date: '2026-06-09', type: 'engine_service', description: 'ซ่อมเครื่องยนต์ ระบบน้ำมัน', vendor: 'ศูนย์บริการฮีโน่ สาขาหลัก', cost: 45000, mileage: 311000, status: 'in_progress', notes: 'คาดแล้วเสร็จ 12 มิ.ย. 2569' },
  { id: 'M005', vehicleId: 'V006', date: '2026-04-20', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง', vendor: 'อีซูซุ เซ็นเตอร์', cost: 2800, mileage: 110000, status: 'completed', nextServiceMileage: 115000, nextServiceDate: '2026-07-20' },
  { id: 'M006', vehicleId: 'V007', date: '2026-05-10', type: 'inspection', description: 'ตรวจสภาพรถประจำปี', vendor: 'กรมการขนส่งทางบก', cost: 800, mileage: 155000, status: 'completed', nextServiceDate: '2027-05-10' },
  { id: 'M007', vehicleId: 'V010', date: '2026-05-28', type: 'body_repair', description: 'ซ่อมตัวถัง ท้ายรถ', vendor: 'อู่ช่างวิไล', cost: 12000, mileage: 444000, status: 'completed' },
  { id: 'M008', vehicleId: 'V003', date: '2026-05-20', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง + กรองอากาศ', vendor: 'โตโยต้า สุขุมวิท', cost: 3200, mileage: 44500, status: 'completed', nextServiceDate: '2026-08-20' },
  { id: 'M009', vehicleId: 'V005', date: '2026-05-05', type: 'tire_replacement', description: 'เปลี่ยนยาง 2 เส้น', vendor: 'ศูนย์บริการฮีโน่', cost: 9000, mileage: 244000, status: 'completed', nextServiceDate: '2026-11-05' },
  { id: 'M010', vehicleId: 'V009', date: '2026-06-01', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง', vendor: 'ฟอร์ด เซอร์วิส', cost: 3500, mileage: 21500, status: 'completed', nextServiceDate: '2026-09-01' },
  { id: 'M011', vehicleId: 'V001', date: '2026-08-01', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง (กำหนดการ)', vendor: 'อีซูซุ เซ็นเตอร์', cost: 2800, mileage: 129000, status: 'pending', nextServiceDate: '2026-08-01' },
  { id: 'M012', vehicleId: 'V002', date: '2026-07-15', type: 'inspection', description: 'ตรวจสภาพประจำปี', vendor: 'กรมการขนส่งทางบก', cost: 800, mileage: 200000, status: 'pending', nextServiceDate: '2026-07-15' },
  { id: 'M013', vehicleId: 'V004', date: '2026-06-10', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง', vendor: 'อีซูซุ เซ็นเตอร์', cost: 2800, mileage: 88000, status: 'pending', nextServiceDate: '2026-06-10' },
  { id: 'M014', vehicleId: 'V006', date: '2026-07-20', type: 'tire_replacement', description: 'เปลี่ยนยาง 4 เส้น', vendor: 'ศูนย์บริการยาง', cost: 16000, mileage: 115000, status: 'pending', nextServiceDate: '2026-07-20' },
  { id: 'M015', vehicleId: 'V010', date: '2026-08-28', type: 'engine_service', description: 'โอเวอร์ฮอลเครื่องยนต์', vendor: 'ศูนย์บริการ Isuzu', cost: 85000, mileage: 450000, status: 'pending', notes: 'รอพิจารณาว่าจะซ่อมหรือเปลี่ยนรถ' },
  { id: 'M016', vehicleId: 'V002', date: '2026-06-15', type: 'electrical', description: 'ซ่อมระบบไฟฟ้า', vendor: 'ช่างไฟรถยนต์สมชาย', cost: 4500, mileage: 199000, status: 'pending' },
  { id: 'M017', vehicleId: 'V005', date: '2026-08-05', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง', vendor: 'ศูนย์บริการฮีโน่', cost: 3000, mileage: 250000, status: 'pending', nextServiceDate: '2026-08-05' },
  { id: 'M018', vehicleId: 'V007', date: '2026-08-10', type: 'brake_service', description: 'ตรวจเบรกและเปลี่ยนผ้าเบรก', vendor: 'อู่ช่างมิตร', cost: 6500, mileage: 160000, status: 'pending', nextServiceDate: '2026-08-10' },
  { id: 'M019', vehicleId: 'V003', date: '2026-08-20', type: 'oil_change', description: 'เปลี่ยนน้ำมันเครื่อง', vendor: 'โตโยต้า สุขุมวิท', cost: 3200, mileage: 50000, status: 'pending', nextServiceDate: '2026-08-20' },
  { id: 'M020', vehicleId: 'V009', date: '2026-09-01', type: 'inspection', description: 'ตรวจสภาพประจำปี', vendor: 'กรมการขนส่งทางบก', cost: 800, mileage: 27000, status: 'pending', nextServiceDate: '2026-09-01' },
];

// ============================================================
// POD RECORDS (20)
// ============================================================
const podPhotos = [
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
  'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400',
  'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400',
];

export const podRecords: PODRecord[] = [
  { id: 'P001', orderId: 'O007', receiverName: 'คุณประพันธ์ มีทรัพย์', receiverPhone: '081-234-9876', gps: [13.7700, 100.6453], deliveryTime: '2026-06-11T09:48:00', driverId: 'D003', photos: [podPhotos[0], podPhotos[3]], notes: 'ลูกค้ารับสินค้าครบ', status: 'verified' },
  { id: 'P002', orderId: 'O008', receiverName: 'คุณกมลา รุ่งเรือง', receiverPhone: '082-345-8765', gps: [14.0188, 100.7385], deliveryTime: '2026-06-10T14:22:00', driverId: 'D005', photos: [podPhotos[1], podPhotos[4]], status: 'verified' },
  { id: 'P003', orderId: 'O009', receiverName: 'คุณสุดา ดีคาร์โก้', receiverPhone: '083-456-7654', gps: [13.9126, 100.5965], deliveryTime: '2026-06-10T11:55:00', driverId: 'D009', photos: [podPhotos[2]], status: 'verified' },
  { id: 'P004', orderId: 'O010', receiverName: 'คุณชัยวิชย์ เซ็นทรัล', receiverPhone: '084-567-6543', gps: [13.7760, 100.5105], deliveryTime: '2026-06-10T11:10:00', driverId: 'D003', photos: [podPhotos[0], podPhotos[1]], status: 'uploaded' },
  { id: 'P005', orderId: 'O011', receiverName: 'คุณรัตนา อีซี่', receiverPhone: '085-678-5432', gps: [13.5938, 100.6849], deliveryTime: '2026-06-10T16:30:00', driverId: 'D007', photos: [podPhotos[3]], notes: 'ส่งล่าช้า 1.5 ชม. เนื่องจากรถติด', status: 'verified' },
  ...orders.filter(o => o.status === 'delivered' && parseInt(o.id.replace('O0',''))>11).slice(0,15).map((o, i) => ({
    id: `P0${String(i+6).padStart(2,'0')}`,
    orderId: o.id,
    receiverName: `ผู้รับสินค้า ${i+6}`,
    receiverPhone: `08${i}-xxx-xxxx`,
    gps: [13.7 + (i*0.05), 100.55 + (i*0.03)] as [number,number],
    deliveryTime: o.actualDelivery || o.scheduledDelivery,
    driverId: o.driverId || 'D001',
    photos: [podPhotos[i%5]],
    status: i%3===0 ? 'uploaded' as const : 'verified' as const,
  })),
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notifications: Notification[] = [
  { id: 'N001', type: 'success', icon: '🚚', title: 'รถออกจากคลัง', message: 'รถ 80-1234 กท. (สมชาย) ออกจากคลังแล้ว', timestamp: '2026-06-11T07:15:00', read: false, vehicleId: 'V001' },
  { id: 'N002', type: 'success', icon: '📦', title: 'ส่งสำเร็จ', message: 'SO-2026-007 ส่งถึง บ. มีทรัพย์ดี แล้ว', timestamp: '2026-06-11T09:48:00', read: false, orderId: 'O007' },
  { id: 'N003', type: 'error', icon: '⚠️', title: 'รถล่าช้า', message: 'SO-2026-006 ล่าช้า เนื่องจากรถมีปัญหาเรื่องยาง', timestamp: '2026-06-11T08:30:00', read: false, orderId: 'O006', vehicleId: 'V002' },
  { id: 'N004', type: 'warning', icon: '🔧', title: 'รถเข้าซ่อม', message: 'รถ 60-5678 กท. เข้าศูนย์ซ่อมบำรุง', timestamp: '2026-06-11T08:00:00', read: true, vehicleId: 'V008' },
  { id: 'N005', type: 'warning', icon: '🌧️', title: 'เสี่ยงล่าช้า', message: 'SO-2026-018 อาจล่าช้า เนื่องจากฝนตกหนัก', timestamp: '2026-06-11T09:00:00', read: false, orderId: 'O018' },
  { id: 'N006', type: 'info', icon: '📋', title: 'ออเดอร์ใหม่', message: 'SO-2026-017 ถูกสร้างโดย คุณตั้ม', timestamp: '2026-06-11T10:30:00', read: true, orderId: 'O017' },
  { id: 'N007', type: 'success', icon: '✅', title: 'POD อัปโหลดแล้ว', message: 'POD ของ SO-2026-007 ถูกอัปโหลดและยืนยันแล้ว', timestamp: '2026-06-11T10:00:00', read: true, orderId: 'O007' },
  { id: 'N008', type: 'warning', icon: '🛡️', title: 'ประกันภัยใกล้หมดอายุ', message: 'ประกันภัยรถ 70-1234 กท. หมดอายุ 31 ส.ค. 69', timestamp: '2026-06-11T09:00:00', read: false, vehicleId: 'V004' },
];

// ============================================================
// RECENT ACTIVITIES
// ============================================================
export const recentActivities: ActivityItem[] = [
  { id: 'A001', type: 'departure', icon: '🚚', message: 'รถ 80-1234 กท. ออกจากคลัง', detail: 'ขนส่ง 2 รายการ | สมชาย วงศ์ดี', timestamp: '2026-06-11T07:15:00', vehicleId: 'V001' },
  { id: 'A002', type: 'departure', icon: '🚚', message: 'รถ 80-5678 กท. ออกจากคลัง', detail: 'ขนส่ง 2 รายการ | วิชัย มีสุข', timestamp: '2026-06-11T07:30:00', vehicleId: 'V002' },
  { id: 'A003', type: 'delivery', icon: '✅', message: 'SO-2026-007 ส่งสำเร็จ', detail: 'บ.มีทรัพย์ดี จำกัด | ก่อนเวลา 12 นาที', timestamp: '2026-06-11T09:48:00', orderId: 'O007' },
  { id: 'A004', type: 'breakdown', icon: '🔧', message: 'รถ 60-5678 กท. เข้าซ่อมบำรุง', detail: 'ซ่อมเครื่องยนต์ | ศูนย์บริการฮีโน่', timestamp: '2026-06-11T08:00:00', vehicleId: 'V008' },
  { id: 'A005', type: 'delay', icon: '⚠️', message: 'SO-2026-006 ล่าช้า', detail: 'รถ 80-5678 มีปัญหาเรื่องยาง | ETA 13:30', timestamp: '2026-06-11T08:30:00', orderId: 'O006' },
  { id: 'A006', type: 'departure', icon: '🚚', message: 'รถ 70-9012 กท. ออกจากคลัง', detail: 'ขนส่ง 2 รายการ | สุรชัย ทองดี', timestamp: '2026-06-11T07:00:00', vehicleId: 'V006' },
  { id: 'A007', type: 'delivery', icon: '✅', message: 'SO-2026-009 ส่งสำเร็จ', detail: 'บ.ดีคาร์โก้ จำกัด | ตรงเวลา', timestamp: '2026-06-10T11:55:00', orderId: 'O009' },
  { id: 'A008', type: 'reschedule', icon: '📅', message: 'SO-2026-020 ถูกยกเลิก', detail: 'ห้างหุ้นส่วน ศิริมังกร | ลูกค้าขอยกเลิก', timestamp: '2026-06-10T14:00:00', orderId: 'O020' },
];

// ============================================================
// COMPUTED KPI DATA
// ============================================================
export function getKPIData() {
  const today = orders.filter(o => o.createdAt.startsWith('2026-06-11'));
  const delivered = orders.filter(o => o.status === 'delivered');
  const delayed = orders.filter(o => o.status === 'delayed' || o.delayReason);
  const inTransit = orders.filter(o => ['in_transit','near_customer','loaded'].includes(o.status));
  const onTime = delivered.filter(o => {
    if (!o.actualDelivery || !o.scheduledDelivery) return true;
    return new Date(o.actualDelivery) <= new Date(o.scheduledDelivery);
  });
  const activeV = vehicles.filter(v => v.status === 'in_transit');
  const maintV = vehicles.filter(v => v.status === 'maintenance');
  const totalCost = maintenanceRecords.filter(m => m.status === 'completed').reduce((a, m) => a + m.cost, 0);

  return {
    ordersToday: today.length,
    ordersInTransit: inTransit.length,
    ordersDelivered: delivered.length,
    ordersDelayed: delayed.filter(o => o.status === 'delayed').length,
    onTimeRate: delivered.length > 0 ? Math.round((onTime.length / delivered.length) * 100 * 10) / 10 : 0,
    transportCost: totalCost,
    activeVehicles: activeV.length,
    vehiclesInMaintenance: maintV.length,
    totalOrders: orders.length,
    avgDeliveryTime: 4.2,
    podCompletionRate: Math.round((podRecords.filter(p => p.status !== 'pending').length / Math.max(1, delivered.length)) * 100),
    deliverySuccessRate: 96.4,
    costPerDelivery: delivered.length > 0 ? Math.round(totalCost / delivered.length) : 0,
    fleetUtilization: Math.round((activeV.length / vehicles.length) * 100),
  };
}

export function getDelayStats() {
  const reasons = ['traffic','rain','vehicle_breakdown','customer_reschedule','product_not_ready','documentation_issue','driver_issue','other'];
  const labels: Record<string, string> = {
    traffic: 'รถติด', rain: 'ฝนตก', vehicle_breakdown: 'รถเสีย',
    customer_reschedule: 'ลูกค้าเลื่อน', product_not_ready: 'สินค้าไม่พร้อม',
    documentation_issue: 'เอกสารผิดพลาด', driver_issue: 'ปัญหาคนขับ', other: 'อื่นๆ',
  };
  return reasons.map(r => ({
    reason: r,
    label: labels[r],
    count: orders.filter(o => o.delayReason === r).length,
  })).filter(r => r.count > 0);
}

export function getDailyDeliveryData() {
  return [
    { date: '6 มิ.ย.', delivered: 12, delayed: 1 },
    { date: '7 มิ.ย.', delivered: 15, delayed: 2 },
    { date: '8 มิ.ย.', delivered: 11, delayed: 0 },
    { date: '9 มิ.ย.', delivered: 18, delayed: 3 },
    { date: '10 มิ.ย.', delivered: 14, delayed: 1 },
    { date: '11 มิ.ย.', delivered: 9, delayed: 2 },
  ];
}

export function getMonthlyData() {
  return [
    { month: 'ม.ค.', delivered: 245, onTime: 228 },
    { month: 'ก.พ.', delivered: 218, onTime: 204 },
    { month: 'มี.ค.', delivered: 267, onTime: 252 },
    { month: 'เม.ย.', delivered: 234, onTime: 219 },
    { month: 'พ.ค.', delivered: 289, onTime: 271 },
    { month: 'มิ.ย.', delivered: 79, onTime: 74 },
  ];
}

export const WAREHOUSE_LOCATION: [number, number] = WAREHOUSE;
