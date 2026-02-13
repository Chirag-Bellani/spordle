// types/CancellationPolicy.ts
export interface CancellationPolicy {
  id: number;
  box_id: number;
  text: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
