import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Globe, Shield, Lock, CheckCircle, AlertCircle, Heart } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseData = location.state || {};
  
  // Check for support donation from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const isSupportDonation = urlParams.get('support') === 'true';
  const supportAmount = urlParams.get('amount') ? parseInt(urlParams.get('amount')!) : null;
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [country, setCountry] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    momoNumber: '',
    momoProvider: '',
    notificationConsent: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const isStorePurchase = purchaseData.type === 'store_purchase';
  const isSpyNetwork = !isStorePurchase && !isSupportDonation;
  const isSupport = isSupportDonation;

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'India', 'Singapore', 'Malaysia', 'Nigeria', 'Kenya', 'South Africa', 'Ghana'
  ];

  const momoProviders = [
    { name: 'MTN MoMo', code: 'mtn', color: '#FF6B35' },
    { name: 'Vodafone Cash', code: 'vod', color: '#E4002B' },
    { name: 'AirtelTigo Money', code: 'airteltigo', color: '#ED1C24' }
  ];

  const isGhanaian = country === 'Ghana';
  const showMoMoOption = isGhanaian;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen zankoku-bg flex items-center justify-center p-4">
        <div className="scanline-overlay" />
        <div className="max-w-md w-full text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
               style={{ 
                 background: isStorePurchase ? '#FFD70020' : '#00FF8820', 
                 border: `2px solid ${isStorePurchase ? '#FFD700' : '#00FF88'}` 
               }}>
            <CheckCircle size={40} style={{ color: isStorePurchase ? '#FFD700' : '#00FF88' }} />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4" style={{ color: isStorePurchase ? '#FFD700' : '#00FF88' }}>
            {isStorePurchase ? 'Payment Successful!' : 'Pre-Order Successful!'}
          </h1>
          <p className="font-body text-sm mb-6" style={{ color: '#6666AA' }}>
            {isStorePurchase ? 
              `Your purchase of ${purchaseData.itemName || 'store items'} is complete! Check your email for confirmation.` :
              'You\'ll be notified when the Spy Network launches. Check your email for confirmation.'
            }
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/store')}
              className="w-full px-4 py-3 rounded font-display text-sm font-bold tracking-wider"
              style={{ 
                background: isStorePurchase ? 
                  'linear-gradient(135deg, #FFD700, #FFEC60)' : 
                  'linear-gradient(135deg, #00FF88, #00CC66)', 
                color: '#030308', 
                border: `1px solid ${isStorePurchase ? '#FFD700' : '#00FF88'}` 
              }}
            >
              Back to Store
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full px-4- py-3 rounded font-display text-sm font-bold tracking-wider"
              style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      <div className="max-w-4xl mx-auto p-4 md:p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(isSupport ? '/' : '/store')}
            className="p-2 rounded-lg transition-colors"
            style={{ background: '#080812', border: '1px solid #1A1A2E' }}
          >
            <ArrowLeft size={20} style={{ color: '#6666AA' }} />
          </button>
          <div>
            <h1 className="font-display text-2xl font-black tracking-wider" style={{ color: '#E8E8FF' }}>
              {isSupport ? 'Support Zankoku' : isStorePurchase ? 'Complete Purchase' : 'Spy Network Pre-Order'}
            </h1>
            <p className="font-body text-sm" style={{ color: '#6666AA' }}>
              {isSupport ? 'Thank you for supporting Zankoku!' : 
               isStorePurchase ? 'Secure payment processing' : 'Get notified at launch - Early access benefits'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#E8E8FF' }}>Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
                     style={{ 
                       background: isSupport ? '#FF149320' : isStorePurchase ? '#00FF8820' : '#FF003C20', 
                       border: `1px solid ${isSupport ? '#FF1493' : isStorePurchase ? '#00FF88' : '#FF003C'}` 
                     }}>
                  {isSupport ? 
                    <Heart size={20} style={{ color: '#FF1493' }} /> :
                    isStorePurchase ? 
                    <CheckCircle size={20} style={{ color: '#00FF88' }} /> :
                    <Lock size={20} style={{ color: '#FF003C' }} />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>
                    {isSupport ? `Support Zankoku - $${supportAmount}` : 
                     isStorePurchase ? purchaseData.itemName || 'Store Item' : 'Spy Network Early Access'}
                  </h3>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>
                    {isSupport ? 
                      'Your generous support helps us keep Zankoku awesome!' :
                     isStorePurchase ? 
                      `${purchaseData.silver || 0} Silver${purchaseData.gold > 0 ? ` + ${purchaseData.gold} Gold` : ''}` : 
                      'Launch notification + exclusive features'
                    }
                  </p>
                </div>
              </div>

              <div className="border-t pt-4" style={{ borderColor: '#1A1A2E' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm" style={{ color: '#6666AA' }}>Item Price</span>
                  <span className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>
                    {isSupport ? `$${supportAmount}` : isStorePurchase ? purchaseData.price || '$0.00' : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm" style={{ color: '#6666AA' }}>
                    {isSupport ? 'Processing Fee' : isStorePurchase ? 'Processing Fee' : 'Early Access Bonus'}
                  </span>
                  <span className="font-display text-sm font-bold" style={{ color: '#00FF88' }}>
                    {isSupport ? '$0.00' : isStorePurchase ? '$0.00' : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#1A1A2E' }}>
                  <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>Total</span>
                  <span className="font-display text-lg font-bold" style={{ color: isSupport ? '#FF1493' : isStorePurchase ? '#FFD700' : '#00FF88' }}>
                    {isSupport ? `$${supportAmount}` : isStorePurchase ? purchaseData.price || '$0.00' : 'FREE'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ 
                background: isSupport ? '#FF149310' : isStorePurchase ? '#FFD70010' : '#00FF8810', 
                border: `1px solid ${isSupport ? '#FF149340' : isStorePurchase ? '#FFD70040' : '#00FF8840'}` 
              }}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} style={{ color: isSupport ? '#FF1493' : isStorePurchase ? '#FFD700' : '#00FF88' }} />
                  <p className="font-body text-xs" style={{ color: isSupport ? '#FF1493' : isStorePurchase ? '#FFD700' : '#00FF88' }}>
                    {isSupport ? 
                      '100% of your donation goes directly to supporting Zankoku development' :
                     isStorePurchase ? 
                      'Secure payment processing - Your items will be delivered immediately after payment.' :
                      'No payment required - Just sign up for launch notifications!'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6 rounded-lg" style={{ background: '#080812', border: '1px solid #1A1A2E' }}>
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#E8E8FF' }}>Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Country Selection */}
              <div>
                <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  name="country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== 'Ghana') {
                      setPaymentMethod('card');
                    }
                  }}
                  className="w-full px-3- py-2 rounded font-body text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-3- py-2 rounded font-body text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-3- - py-2 rounded font-body text-sm"
                  style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                  required
                />
              </div>

              {/* Payment Method Selection */}
              {country && (
                <div>
                  <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        paymentMethod === 'card' 
                          ? 'border-2' 
                          : 'border opacity-60'
                      }`}
                      style={{ 
                        background: '#0D0D1A', 
                        borderColor: paymentMethod === 'card' ? '#00FF88' : '#1A1A2E',
                        color: paymentMethod === 'card' ? '#00FF88' : '#6666AA'
                      }}
                    >
                      <CreditCard size={16} />
                      <span className="font-body text-xs font-semibold">Card</span>
                    </button>
                    
                    {showMoMoOption && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                          paymentMethod === 'momo' 
                            ? 'border-2' 
                            : 'border opacity-60'
                        }`}
                        style={{ 
                          background: '#0D0D1A', 
                          borderColor: paymentMethod === 'momo' ? '#FF6B35' : '#1A1A2E',
                          color: paymentMethod === 'momo' ? '#FF6B35' : '#6666AA'
                        }}
                      >
                        <Smartphone size={16} />
                        <span className="font-body text-xs font-semibold">MoMo</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Card Payment Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                      Card Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3- py-2 rounded font-body text-sm"
                      style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                        Expiry Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3- py-2 rounded font-body text-sm"
                        style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                        CVV <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3- py-2 rounded font-body text-sm"
                        style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MoMo Payment Fields */}
              {paymentMethod === 'momo' && showMoMoOption && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                      MoMo Provider <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="momoProvider"
                      value={formData.momoProvider}
                      onChange={handleInputChange}
                      className="w-full px-3- py-2 rounded font-body text-sm"
                      style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                      required
                    >
                      <option value="">Select Provider</option>
                      {momoProviders.map(provider => (
                        <option key={provider.code} value={provider.code}>{provider.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-body text-xs font-semibold mb-2" style={{ color: '#E8E8FF' }}>
                      MoMo Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="momoNumber"
                      value={formData.momoNumber}
                      onChange={handleInputChange}
                      placeholder="024 123 4567"
                      maxLength={10}
                      className="w-full px-3- py-2 rounded font-body text-sm"
                      style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Notification Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="notificationConsent"
                  checked={formData.notificationConsent}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificationConsent: e.target.checked }))}
                  className="mt-1"
                  style={{ accentColor: isSupport ? '#FF1493' : '#00FF88' }}
                />
                <label className="font-body text-xs" style={{ color: '#6666AA' }}>
                  {isSupport ? 
                    'I agree to receive updates about Zankoku development and new features.' :
                    'I agree to receive notifications about the Spy Network launch and related updates.'
                  }
                </label>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}>
                <Shield size={16} style={{ color: isSupport ? '#FF1493' : '#00FF88' }} />
                <div className="flex-1">
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>
                    <span className="font-semibold" style={{ color: '#E8E8FF' }}>Secure Payment:</span> 
                    {paymentMethod === 'card' ? ' Your card information is encrypted and secure.' : ' Your MoMo transaction is protected.'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !formData.notificationConsent}
                className="w-full px-4 py-3 rounded font-display text-sm font-bold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: isProcessing ? '#6666AA' : isSupport ? 
                    'linear-gradient(135deg, #FF1493, #FF69B4)' : isStorePurchase ? 
                    'linear-gradient(135deg, #FFD700, #FFEC60)' : 
                    'linear-gradient(135deg, #00FF88, #00CC66)', 
                  color: '#030308', 
                  border: `1px solid ${isSupport ? '#FF1493' : isStorePurchase ? '#FFD700' : '#00FF88'}`
                }}
              >
                {isProcessing ? 'Processing...' : isSupport ? 'Support Zankoku' : isStorePurchase ? 'Complete Purchase' : 'Complete Pre-Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Globe size={16} style={{ color: '#6666AA' }} />
              <span className="font-body text-xs" style={{ color: '#6666AA' }}>Global Card Payments Accepted</span>
            </div>
            {isGhanaian && (
              <div className="flex items-center gap-2">
                <Smartphone size={16} style={{ color: '#FF6B35' }} />
                <span className="font-body text-xs" style={{ color: '#FF6B35' }}>Ghana MoMo Available</span>
              </div>
            )}
          </div>
          <p className="font-body text-xs" style={{ color: '#6666AA' }}>
            <Lock size={12} className="inline mr-1" />
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
