export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  email_verified_at: string | null;
  dob: string | null;
  role: number;
  api_token: string | null;
  mobile_no: string;
  mobile_verification_otp: string | null;
  is_mobile_verified: number;
  status: number;
  profile_pic: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingReview {
  id: number;
  box_id: number;
  user_id: number;
  booking_date: string; // e.g., "2025-03-28"
  payment_type: string; // e.g., "Cash"
  booking_from: string; // e.g., "App"
  booking_status: string | null;
  total_amount: string; // e.g., "800.00"
  rating: string; // e.g., "0.0"
  review: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  get_selected_user: User;
}
