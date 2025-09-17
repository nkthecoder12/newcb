// Configuration file for backend API and external services
export const config = {
  // Backend API base URL
  API_BASE_URL: 'https://my-backend-mjuk.onrender.com',
  
  // API endpoints
  ENDPOINTS: {
    COURSES: '/api/courses',
    ENROLL: '/api/enroll',
    VERIFY_PAYMENT: '/api/verify-payment'
  },
  
  // WhatsApp group invite link for successful enrollments
  WHATSAPP_GROUP_LINK: 'https://chat.whatsapp.com/your-group-invite-link',
  
  // Razorpay configuration (key_id will be received from backend)
  RAZORPAY: {
    // This will be populated from backend response
    KEY_ID: null
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
};
