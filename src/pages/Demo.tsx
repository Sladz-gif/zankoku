import React from 'react';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-white mb-4">Sign-in Successful!</h1>
          <p className="text-[#6666AA] text-lg">Navigation is working correctly</p>
        </div>

        {/* Demo Content */}
        <div className="bg-[#080812] border border-[#1A1A2E] rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Demo Page</h2>
          <p className="text-[#E8E8FF] mb-4">
            This is a simple demo page to test that the sign-in navigation is working properly.
            If you can see this page, it means:
          </p>
          <ul className="text-[#E8E8FF] list-disc list-inside space-y-2 mb-6">
            <li>✅ Sign-in authentication succeeded</li>
            <li>✅ Navigation from sign-in page worked</li>
            <li>✅ AuthGuard allowed access to this page</li>
            <li>✅ Page rendering is working correctly</li>
          </ul>

          <div className="bg-[#0D0D1A] border border-[#2A2A4E] rounded p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Next Steps:</h3>
            <p className="text-[#6666AA] text-sm">
              Now that we know navigation works, we can fix the feed page and update the sign-in to navigate there instead.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-3 bg-[#1A1A2E] text-white rounded-lg hover:bg-[#2A2A4E] transition-colors"
          >
            Back to Sign-in
          </button>
          <button
            onClick={() => navigate('/feed')}
            className="px-6 py-3 bg-[#8B00FF] text-white rounded-lg hover:bg-[#BF5FFF] transition-colors"
          >
            Try Feed Page
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 text-center">
          <p className="text-[#333355] text-sm">
            Current URL: {window.location.pathname}
          </p>
          <p className="text-[#333355] text-sm">
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
