// types/Amenity.ts
export interface Amenity {
  id: number;
  box_id: number;
  amenities_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  get_single_amenities: {
    id: number;
    name: string;
    icon: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface SingleAmenity {
  id: number;
  name: string;
  icon: string;
}
