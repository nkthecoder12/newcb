import { useNavigate } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home } from 'lucide-react';


const SuccessPage = () => {
  const navigate = useNavigate();

  const handleWhatsAppRedirect = () => {
    // Prefer opening WhatsApp app on mobile, fallback to web invite
    const inviteWeb = 'https://chat.whatsapp.com/KL2tyedQGHWJUc83ij8G0J';
    const inviteApp = 'whatsapp://chat?code=KL2tyedQGHWJUc83ij8G0J';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // Try to open the WhatsApp app first
      setTimeout(() => {
        // Fallback to web link if app didn't open
        window.location.href = inviteWeb;
      }, 1200);
      window.location.href = inviteApp;
    } else {
      // Desktop: open WhatsApp Web invite (requires WhatsApp Web login)
      window.location.href = inviteWeb;
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your course has been successfully ordered! Join our WhatsApp group for further updates and course materials.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* WhatsApp Group Button */}
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Join WhatsApp Group
          </button>
          {/* Fallback direct link in case button is blocked by browser */}
          <p className="text-sm text-gray-500">
            Having trouble? Use this link:
            {' '}
            <a
              href="https://chat.whatsapp.com/KL2tyedQGHWJUc83ij8G0J"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline hover:text-green-700"
            >
              Open WhatsApp Group
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Tip: On desktop, ensure you are logged in to <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="underline">WhatsApp Web</a> or have the WhatsApp Desktop app installed. On mobile, the app should open automatically.
          </p>
          <p className="text-xs text-gray-500">
            Direct app link (mobile):{' '}
            <a
              href="whatsapp://chat?code=KL2tyedQGHWJUc83ij8G0J"
              className="text-green-600 underline hover:text-green-700"
            >
              Open in WhatsApp App
            </a>
          </p>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-700">
            <strong>Next Steps:</strong>
            <br />
            1. Join the WhatsApp group above
            <br />
            2. You'll receive course access details within 24 hours
            <br />
            3. Check your email for payment confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
