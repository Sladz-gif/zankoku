import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { ZankokuUser } from '@/types/game';
import { signIn } from '@/lib/supabase';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useGame();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorText, setErrorText] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const handleSignIn = async () => {
    if (!identifier || !password) {
      setErrorText('Invalid email or password. Check your details and try again.');
      return;
    }
    
    setErrorText('');
    setAuthenticating(true);
    
    try {
      // Call Supabase signIn function
      const { data, error } = await signIn(identifier, password);
      
      if (error) {
        console.error('Sign in error:', error);
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setErrorText('Invalid email or password. Please check your details and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorText('Please confirm your email address before signing in.');
        } else {
          setErrorText('Sign in failed. Please try again.');
        }
        setAuthenticating(false);
        return;
      }
      
      if (data?.user) {
        // Create user profile with additional data
        const user: ZankokuUser = {
          id: data.user.id,
          username: data.user.user_metadata?.username || identifier.split('@')[0] || 'Player',
          bio: data.user.user_metadata?.bio || '',
          anime: data.user.user_metadata?.anime || 'jjk',
          alignment: data.user.user_metadata?.alignment || 'wanderer',
          rank: data.user.user_metadata?.rank || 500,
          points: data.user.user_metadata?.points || 1000,
          roleTag: data.user.user_metadata?.roleTag || '',
          cowardStars: data.user.user_metadata?.cowardStars || 0,
          betrayalHistory: data.user.user_metadata?.betrayalHistory || [],
          bountyActive: data.user.user_metadata?.bountyActive || false,
          bountyAmount: data.user.user_metadata?.bountyAmount || 0,
          currency: data.user.user_metadata?.currency || { bronze: 50, silver: 0, gold: 0 },
          techniques: data.user.user_metadata?.techniques || ['Divergent Fist'],
          duelsWon: data.user.user_metadata?.duelsWon || 0,
          duelsLost: data.user.user_metadata?.duelsLost || 0,
          shapesCaptured: data.user.user_metadata?.shapesCaptured || 0,
          clanWars: data.user.user_metadata?.clanWars || 0,
          bountiesClaimed: data.user.user_metadata?.bountiesClaimed || 0,
          avatar: data.user.user_metadata?.avatar || 1,
          clanId: data.user.user_metadata?.clanId || null,
          resource: data.user.user_metadata?.resource || 100,
          maxResource: data.user.user_metadata?.maxResource || 100,
          isLoggedIn: true
        };

        setCurrentUser(user);
        
        // Set signup time for support popup trigger (if first time signing in)
        if (!sessionStorage.getItem('zankoku_signup_time')) {
          sessionStorage.setItem('zankoku_signup_time', Date.now().toString());
        }
        
        const destination = location.state?.from || '/dashboard';
        navigate(destination);
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setErrorText('An unexpected error occurred. Please try again.');
      setAuthenticating(false);
    }
  };

  if (authenticating) {
    return (
      <div className="fixed inset-0 zankoku-bg flex items-center justify-center z-[9999]">
         <style>{`
            @keyframes pulse-explode-short {
              0% { opacity: 0; transform: scale(0.9); }
              40% { opacity: 1; transform: scale(1); }
              100% { opacity: 0; transform: scale(2); }
            }
         `}</style>
         <div className="font-serif leading-none absolute flex items-center justify-center pointer-events-none"
             style={{ fontSize: '50vw', color: 'var(--neon-purple)', textShadow: '0 0 40px var(--neon-purple)', animation: 'pulse-explode-short 0.8s ease-in forwards' }}>
           残酷
         </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen zankoku-bg py-12 px-4 md:px-6 flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 40%, hsl(var(--neon-purple) / 0.12) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 60%, hsl(var(--neon-blue) / 0.08) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="font-serif leading-none" style={{ fontSize: '50vw', color: 'white', opacity: 0.05 }}>残酷</span>
      </div>

      <Link to="/" className="font-display font-black text-2xl tracking-widest mb-8 relative z-10 hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--text-primary))' }}>
        ZANKOKU
      </Link>

      <div className="relative z-10 w-full max-w-[420px] rounded-[4px] p-6 md:p-10"
           style={{ background: 'hsl(var(--bg-surface))', border: '1px solid hsl(var(--border-active))', boxShadow: '0 0 60px hsl(var(--neon-purple) / 0.12)' }}>
        
        <div className="text-center mb-8">
          <div className="font-body font-semibold text-[11px] tracking-[4px] mb-2 uppercase" style={{ color: 'var(--text-muted)' }}>WELCOME BACK</div>
          <h2 className="font-display font-bold text-[22px]" style={{ color: 'hsl(var(--text-primary))' }}>Sign in to Zankoku.</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>EMAIL OR USERNAME</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={identifier} onChange={e => { setIdentifier(e.target.value); setErrorText(''); }}
                     placeholder="email or username"
                     className="w-full font-body text-[15px] rounded-[3px] focus:outline-none focus:border-[hsl(var(--neon-purple))] transition-colors"
                     style={{ background: 'hsl(var(--bg-elevated))', border: '1px solid', borderColor: errorText ? 'hsl(var(--neon-red))' : 'hsl(var(--border))', color: 'hsl(var(--text-primary))', padding: '14px 18px 14px 44px' }} />
            </div>
          </div>

          <div>
            <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>PASSWORD</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setErrorText(''); }}
                     className="w-full font-body text-[15px] rounded-[3px] focus:outline-none focus:border-[hsl(var(--neon-purple))] transition-colors pr-12"
                     style={{ background: 'hsl(var(--bg-elevated))', border: '1px solid', borderColor: errorText ? 'hsl(var(--neon-red))' : 'hsl(var(--border))', color: 'hsl(var(--text-primary))', padding: '14px 18px 14px 44px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right mt-1.5">
               <Link to="/forgot-password" className="font-body font-semibold text-[13px] hover:text-white transition-colors" style={{ color: 'var(--neon-blue)' }}>
                 Forgot password?
               </Link>
            </div>
          </div>

          <div className="mt-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <div className="w-4 h-4 rounded-[2px] transition-colors flex items-center justify-center"
                     style={{ border: '1px solid', borderColor: rememberMe ? 'var(--neon-purple)' : 'var(--border)', background: rememberMe ? 'var(--neon-purple)' : 'transparent' }}>
                  {rememberMe && <CheckCircle size={12} color="white" />}
                </div>
              </div>
              <div className="font-body text-[14px] leading-tight select-none pt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Keep me signed in
              </div>
            </label>
          </div>

          <div className="pt-4">
            {errorText && (
              <div className="font-body text-[13px] mb-3 flex items-center justify-center gap-1.5 transition-opacity" style={{ color: 'var(--neon-red)' }}>
                <AlertCircle size={14} /> {errorText}
              </div>
            )}
            <button onClick={handleSignIn}
                    className="w-full flex items-center justify-center gap-2 px-[32px] py-[14px] rounded-[3px] font-display font-bold tracking-[2px] text-white uppercase transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-purple) / 0.8))' }}>
              SIGN IN <ArrowRight size={20} />
            </button>
          </div>

          <div className="my-6 flex items-center justify-center relative">
            <div className="absolute left-0 right-0 h-[1px] bg-[var(--border)]" />
            <div className="relative px-4 font-body text-[13px] bg-[var(--bg-surface)]" style={{ color: 'var(--text-muted)' }}>OR</div>
          </div>

          
          <div className="mt-8 text-center font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            New to Zankoku? <Link to="/signup" className="hover:underline transition-colors font-bold" style={{ color: 'var(--neon-purple)' }}>START YOUR ARC</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
