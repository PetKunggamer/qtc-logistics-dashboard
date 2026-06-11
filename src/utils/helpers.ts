import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus, VehicleStatus, DelayReason } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เพิ่งเกิดขึ้น';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'รอดำเนินการ',
  preparing: 'เตรียมสินค้า',
  ready_to_load: 'พร้อมโหลด',
  loaded: 'โหลดแล้ว',
  in_transit: 'กำลังขนส่ง',
  near_customer: 'ใกล้ถึงลูกค้า',
  delivered: 'ส่งสำเร็จ',
  delayed: 'ล่าช้า',
  cancelled: 'ยกเลิก',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  ready_to_load: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  loaded: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  in_transit: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  near_customer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  delayed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  available: 'พร้อมใช้',
  in_transit: 'กำลังขนส่ง',
  idle: 'รออยู่ที่คลัง',
  maintenance: 'ซ่อมบำรุง',
  out_of_service: 'หยุดใช้งาน',
};

export const VEHICLE_STATUS_COLOR: Record<VehicleStatus, string> = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  in_transit: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  idle: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  out_of_service: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const DELAY_REASON_LABEL: Record<DelayReason, string> = {
  traffic: 'รถติด',
  rain: 'ฝนตก',
  vehicle_breakdown: 'รถเสีย',
  customer_reschedule: 'ลูกค้าเลื่อน',
  product_not_ready: 'สินค้าไม่พร้อม',
  documentation_issue: 'เอกสารผิดพลาด',
  driver_issue: 'ปัญหาคนขับ',
  other: 'อื่นๆ',
};

export const TIMELINE_STEP_LABEL: Record<string, string> = {
  order_created: 'สร้างออเดอร์',
  picking: 'หยิบสินค้า',
  packing: 'บรรจุสินค้า',
  loading: 'โหลดสินค้า',
  vehicle_departed: 'รถออกจากคลัง',
  in_transit: 'กำลังขนส่ง',
  arrived_customer: 'ถึงหน้าร้านลูกค้า',
  delivered: 'ส่งสำเร็จ',
};

export const TIMELINE_STEP_ICON: Record<string, string> = {
  order_created: '📋',
  picking: '🔍',
  packing: '📦',
  loading: '🏗️',
  vehicle_departed: '🚚',
  in_transit: '🛣️',
  arrived_customer: '📍',
  delivered: '✅',
};
