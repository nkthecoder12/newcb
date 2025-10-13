import axios from 'axios';
import { config } from '../config';


const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API utility functions for backend communication

/**
 * Fetch all available courses from backend
 * @returns {Promise} Array of courses with id, name, price, etc.
 */
export const fetchCourses = async () => {
  try {
    const response = await api.get(config.ENDPOINTS.COURSES);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses. Please try again later.');
  }
};

/**
 * Initiate enrollment process for a course
 * @param {string} courseId - The ID of the course to enroll in
 * @returns {Promise} Object containing order_id, amount, currency, key_id for Razorpay
 */
export const initiateEnrollment = async (courseId: string) => {
  try {
    const response = await api.post(config.ENDPOINTS.ENROLL, {
      courseId: courseId
    });
    
    // Backend returns: { order_id, amount, currency, key_id }
    return response.data;
  } catch (error) {
    console.error('Error initiating enrollment:', error);
    throw new Error('Failed to initiate enrollment. Please try again.');
  }
};

/**
 * Verify payment after successful Razorpay transaction
 * @param {Object} paymentData - Contains razorpay_payment_id, razorpay_order_id, razorpay_signature
 * @returns {Promise} Verification result from backend
 */
export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  try {
    const response = await api.post(config.ENDPOINTS.VERIFY_PAYMENT, {
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_signature: paymentData.razorpay_signature
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed. Please contact support.');
  }
};

// Export the configured axios instance for custom requests if needed
export default api;
