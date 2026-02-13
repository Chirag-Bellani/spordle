import API_ENDPOINTS from "../constants/apiEndpoints";
import { apiPost } from "./api/apiService";

export const updateReviewAndRating = async (formData: FormData) => {
  try {
    const response = await apiPost(
      API_ENDPOINTS.REVIEW_AND_RATING.UPDATE_BOOKING_RATING_REVIEW,
      formData,
    );
    if (response.success) {
      return {success: true, message: response.message}; // Return the vehicle data
    } else {
      return {success: false, message: response.message};
    }
  } catch (error) {
    if (error instanceof Error)
      console.error('Error adding booking :', error.message);
    throw error; // Optional: Propagate the error if needed
  }
};
