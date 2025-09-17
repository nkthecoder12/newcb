import { verifyPayment } from './api';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load Razorpay checkout script dynamically
 * @returns {Promise} Resolves when script is loaded
 */
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

interface OrderData {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

interface UserDetails {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Initialize Razorpay payment process
 * @param {Object} orderData - Contains order_id, amount, currency, key_id from backend
 * @param {Object} userDetails - User information for prefill
 * @param {Function} onSuccess - Callback for successful payment
 * @param {Function} onFailure - Callback for failed payment
 */
export const initiateRazorpayPayment = async (
  orderData: OrderData,
  userDetails: UserDetails,
  onSuccess: (result: any) => void,
  onFailure: (error: any) => void
) => {
  try {
    // Ensure Razorpay script is loaded
    await loadRazorpayScript();

    const options = {
      key: orderData.key_id, // Razorpay key from backend
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'Visionary Phoenix Academy',
      description: 'Course Enrollment Payment',
      order_id: orderData.order_id,
      
      // Prefill user details if available
      prefill: {
        name: userDetails.name || '',
        email: userDetails.email || '',
        contact: userDetails.phone || ''
      },
      
      // Theme customization
      theme: {
        color: '#f97316' // Orange color matching your brand
      },
      
      // Success handler
      handler: async function (response: any) {
        try {
          // Send payment details to backend for verification
          const verificationResult = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
          
          // Call success callback with verification result
          onSuccess(verificationResult);
        } catch (error) {
          console.error('Payment verification failed:', error);
          onFailure(error);
        }
      },
      
      // Modal configuration
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed by user');
          onFailure(new Error('Payment cancelled by user'));
        }
      }
    };

    // Create and open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
    onFailure(error);
  }
};
