// types/BoxImage.ts
export interface BoxImage {
  id: number;
  box_id: number;
  image: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
