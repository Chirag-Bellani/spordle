// types/Box.ts

import {Amenity} from './amenity';
import {BookMark} from './bookmark';
import {BoxImage} from './boxImage';
import {CancellationPolicy} from './cancellationPolicy';
import {Sport} from './sport';

export interface Box {
  id: number;
  user_id: number;
  title: string;
  address: string;
  latitude: string;
  longitude: string;
  price_start_from: string;
  avg_rating: string;
  box_image: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  distance: string;
  is_bookable: boolean;
  get_selected_available_sport: Sport[];
  get_selected_amenities: Amenity[];
  get_box_cancellation_policy: CancellationPolicy[];
  get_selected_box_images: BoxImage[];
  get_selected_user_book_mark: BookMark[]; // Update this if you know its shape
}
