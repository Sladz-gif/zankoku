import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen zankoku-bg py-12 px-4 md:px-6 flex flex-col items-center justify-center">
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(139, 0, 255, 0.12) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(0, 200, 255, 0.08) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="font-serif leading-none" style={{ fontSize: '50vw', color: 'white', opacity: 0.05 }}>残酷</span>
      </div>

      <Link to="/" className="absolute top-12 font-display font-black text-2xl tracking-widest text-white mb-8 z-10 hover:opacity-80 transition-opacity">
        ZANKOKU
      </Link>

      <div className="relative z-10 w-full max-w-[420px] rounded-[4px] p-6 md:p-10"
           style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-active)', boxShadow: '0 0 60px rgba(139,0,255,0.12)' }}>
        
        <Link to="/signin" className="inline-flex items-center justify-center w-8 h-8 font-body text-[14px] mb-8 rounded-lg bg-[#1A1A2E] hover:bg-[#2A2A4E] hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
        </Link>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={32} className="mx-auto mb-4" style={{ color: 'var(--neon-green)' }} />
            <h2 className="font-display font-bold text-[20px] text-white mb-3">Check your inbox.</h2>
            <p className="font-body text-[14px] leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              If that email matches an account, a reset link is on the way. Check your spam folder if you do not see it.
            </p>
            <Link to="/signin" className="font-display font-bold text-[14px] tracking-[2px] hover:text-white transition-colors uppercase" style={{ color: 'var(--neon-blue)' }}>
              RETURN TO SIGN IN
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="font-display font-bold text-[20px] text-white mb-2">Reset your password.</h2>
            <p className="font-body text-[14px] leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Enter your email address. If it matches an account we will send a reset link.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>EMAIL</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                         placeholder="your@email.com"
                         className="w-full font-body text-[15px] text-white rounded-[3px] focus:outline-none focus:border-[var(--neon-purple)] transition-colors"
                         style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '14px 18px 14px 44px' }} />
                </div>
              </div>
              
              <button type="submit" disabled={!email}
                      className="w-full flex items-center justify-center px-[32px] py-[14px] rounded-[3px] font-display font-bold tracking-[2px] text-white uppercase transition-all duration-200"
                      style={{ background: email ? 'linear-gradient(135deg, var(--neon-purple), #5500CC)' : 'var(--border)', opacity: email ? 1 : 0.5 }}>
                SEND RESET LINK
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
