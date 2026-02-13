// types/Sport.ts
export interface Sport {
  id: number;
  box_id: number;
  sport_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  image: string;
  get_single_sports: {
    id: number;
    name: string;
    image: string;
    icon: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface SportCard {
  id: number;
  name: string;
  logo: {uri: string};
}
