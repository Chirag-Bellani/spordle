import API_ENDPOINTS from "../constants/apiEndpoints";
import { apiPost } from "./api/apiService";

export const boxByCourt = async (formData:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.BOX.GET_BOX_BY_COURT, formData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const boxCourtBySlot = async (payload:{booking_date:string ,box_court_id:number}) => {
  try {
    const response = await apiPost(
        API_ENDPOINTS.BOX.GET_BOX_COURT_DATE_BY_SLOT,
        payload,
      );;
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};