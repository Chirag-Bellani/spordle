export interface SlotTime {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: number;
  box_court_id: number;
  slot_id: number;
  rate: string;
  discount: string;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
  box_court_slot_id: number;
  normalized_id: number | null;
  get_single_slot: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface SlotResponseData {
  all_slots: Slot[];
  booked_slot: number[]; // assuming booked_slot is an array of slot IDs
}

export interface SlotApiResponse {
  success: boolean;
  data: SlotResponseData;
  message: string;
}

export type SelectedSlotType = {
  [date: string]: {
    [courtId: string]: number[]; // array of slot IDs
  };
};

export type SlotCountMap = {
  [date: string]: number;
};
