import { Box } from './Box';

export interface BookingResponse {
  id: number;
  box_id: number;
  user_id: number;
  booking_date: string | null;
  payment_type: string;
  booking_from: string;
  booking_status: string | null;
  total_amount: string;
  rating: string;
  review: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  slot_count: number;
  get_bookings_details: BookingDetail[];
  get_selected_box: Box;
  category: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface BookingDetail {
  id: number;
  booking_id: number;
  booking_date: string;
  box_court_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  get_selected_box_court: BoxCourt;
  get_selected_booking_slot_details: BookingSlotDetail[];
}

export interface BoxCourt {
  id: number;
  box_id: number;
  name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  get_box_court_detail: CourtDetail[];
}

export interface CourtDetail {
  id: number;
  box_court_id: number;
  slot_id: number;
  rate: string;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface BookingSlotDetail {
  id: number;
  booking_detail_id: number;
  slot_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  get_selected_slot: Slot;
}

export interface Slot {
  get_single_slot: any;
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  timeRange: string;
  rate: number;
  startTime: string | null;
  endTime: string | null;
}

export interface BookingItem {
  id: number;
  category: 'Upcoming' | 'Completed' | 'Cancelled';
  slot_count: number;
  get_selected_box: Box;
}

export interface ProcessedSlot {
  id: number | string;
  name: string;
  timeRange: string;
  rate: number;
  startTime: string | null;
  endTime: string | null;
}