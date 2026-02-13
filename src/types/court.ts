





export interface courtItem {
  id: number;
  name: string;
}

// Add this new type for normalized slots
export interface NormalizedSlot {
  normalized_id: number | null;
  rate: number;
  slot_id?: number;
  start_time: string;
  end_time: string;
  name: string;
  date: string;
  court_id: number;
}

// Update SelectedSlotType - it should match the structure you're actually using
export type SelectedSlotType = NormalizedSlot;

// Update Court interface
export interface Court {
  id: number;
  name: string;
  date?: string;
  court_id?: number;
  start_time?: string;
  end_time?: string;
  court?: courtItem;
}
