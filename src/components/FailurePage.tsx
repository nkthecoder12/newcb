import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';

const FailurePage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Failed ❌
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Unfortunately, your payment could not be processed. Please try again or contact our support team if the issue persists.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-orange-50 rounded-xl">
          <p className="text-sm text-orange-700">
            <strong>Need Help?</strong>
            <br />
            Contact us at: visionaryphoenixacademy@gmail.com
            <br />
            Phone: 8220397552
            <br />
            We're here to help you complete your enrollment!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;
