import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Lock, Eye, EyeOff, Globe, CheckCircle, AlertCircle, ArrowRight, Swords, Skull, Compass, Zap, Dumbbell } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { AnimeFaction, Alignment, FACTION_NAMES, FACTION_RESOURCE, TECHNIQUES, COUNTRIES, FACTION_COLORS, ZankokuUser } from '@/types/game';
import { signUp, supabase } from '@/lib/supabase';

const ANIMES: AnimeFaction[] = ['naruto', 'jjk', 'onepiece', 'bleach', 'blackclover', 'dragonball', 'demonslayer', 'hxh'];

const SignUp = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useGame();
  
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<{name: string; flag: string; code: string} | null>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Step 2 State
  const [alignment, setAlignment] = useState<Alignment | null>(null);

  // Step 3 State
  const [faction, setFaction] = useState<AnimeFaction | null>(null);
  
  const [completing, setCompleting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Validation
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isValidUsername = username.length >= 3 && username.length <= 20 && !username.includes(' ');
  const usernameHasSpace = username.includes(' ');
  
  const passwordStrength = useMemo(() => {
    if (password.length === 0) return 0; // 0 = empty
    if (password.length < 8) return 1; // 1 = weak
    let score = 1;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // up to 4 = strong
  }, [password]);

  const passwordStrengthColor = ['#333355', 'var(--neon-red)', 'var(--neon-orange)', 'var(--neon-blue)', 'var(--neon-green)'][passwordStrength];
  const passwordStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  // Check if email already exists
  const checkEmailExists = async (email: string) => {
    if (!isValidEmail) {
      setEmailError(null);
      return;
    }

    setIsCheckingEmail(true);
    setEmailError(null);

    try {
      // Use Supabase auth.signInWithPassword with a dummy password to check if user exists
      // This is a safe way to check without revealing sensitive info
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check-only'
      });

      // If error is about invalid credentials, user exists
      if (error && error.message.includes('Invalid login credentials')) {
        setEmailError('An account with this email already exists. Please sign in instead.');
      }
      // If error is about email not confirmed, user exists but hasn't confirmed
      else if (error && error.message.includes('Email not confirmed')) {
        setEmailError('An account with this email exists but hasn\'t been confirmed. Please check your email or sign in.');
      }
      // If no error, user doesn't exist (or password happens to match, which is extremely unlikely)
      // In the rare case password matches, we'll handle it in the actual signup
    } catch (error) {
      // If there's a network error or other issue, don't block the user
      console.log('Email check failed:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Check email when user stops typing
  useMemo(() => {
    if (isValidEmail && email) {
      const timeoutId = setTimeout(() => {
        checkEmailExists(email);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setEmailError(null);
    }
  }, [email]);

  const filteredCountries = COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));

  const canProceedStep1 = isValidEmail && isValidUsername && passwordStrength > 0 && doPasswordsMatch && selectedCountry && acceptedTerms && !emailError;

  const handleComplete = async () => {
    // Prevent proceeding if there's already an email error
    if (emailError) {
      alert('Please use a different email address or sign in to your existing account.');
      return;
    }

    setCompleting(true);
    
    try {
      // Call Supabase signUp function
      const { data, error } = await signUp(email, password, username);
      
      if (error) {
        console.error('Signup error:', error);
        // Handle specific error messages
        if (error.message.includes('User already registered')) {
          alert('User with this email already exists. Please sign in instead.');
        } else if (error.message.includes('weak password')) {
          alert('Password is too weak. Please choose a stronger password.');
        } else {
          alert('Signup failed. Please try again.');
        }
        setCompleting(false);
        return;
      }
      
      if (data?.user) {
        // Create user profile with additional data
        const newUser: ZankokuUser = {
          id: parseInt(data.user.id),
          username: username || 'Fighter' + Date.now().toString().slice(-4),
          bio: '',
          anime: faction || 'jjk',
          alignment: alignment || 'wanderer',
          rank: 0,
          points: 0,
          roleTag: '',
          cowardStars: 0,
          betrayalHistory: [],
          bountyActive: false,
          bountyAmount: 0,
          currency: { bronze: 0, silver: 0, gold: 0 }, // Start with 0 coins
          techniques: [TECHNIQUES[faction || 'jjk'][0].name],
          duelsWon: 0,
          duelsLost: 0,
          shapesCaptured: 0,
          clanWars: 0,
          bountiesClaimed: 0,
          avatar: 1, // default
          clanId: null,
          resource: 100,
          maxResource: 100,
          country: selectedCountry?.name,
          countryFlag: selectedCountry?.flag,
          isLoggedIn: true
        };

        setCurrentUser(newUser);
        
        // Set signup time for support popup trigger
        sessionStorage.setItem('zankoku_signup_time', Date.now().toString());
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      alert('An unexpected error occurred. Please try again.');
      setCompleting(false);
    }
  };

  if (completing) {
    return (
      <div className="fixed inset-0 zankoku-bg flex items-center justify-center z-[9999]">
         <style>{`
            @keyframes pulse-explode {
              0% { opacity: 0; transform: scale(0.8); }
              30% { opacity: 1; transform: scale(1); }
              60% { opacity: 1; transform: scale(1); }
              100% { opacity: 0; transform: scale(3); }
            }
         `}</style>
         <div className="font-serif leading-none absolute flex items-center justify-center pointer-events-none"
             style={{ fontSize: '60vw', color: 'var(--neon-purple)', textShadow: '0 0 40px var(--neon-purple)', animation: 'pulse-explode 1.5s ease-in-out forwards' }}>
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

      <div className="relative z-10 w-full max-w-[480px] rounded-[4px] p-6 md:p-10"
           style={{ background: 'hsl(var(--bg-surface))', border: '1px solid hsl(var(--border-active))', boxShadow: '0 0 60px hsl(var(--neon-purple) / 0.12)' }}>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-2 justify-center mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="w-2 h-2 rounded-full transition-colors duration-300"
                 style={{ background: step === s ? 'hsl(var(--neon-purple))' : 'hsl(var(--border-active))' }} />
          ))}
        </div>
        
        <div className="text-center mb-8">
          <div className="font-body font-semibold text-[11px] tracking-[4px] mb-2 uppercase" style={{ color: 'var(--text-muted)' }}>STEP {step} OF 3</div>
          <h2 className="font-display font-bold text-[22px]" style={{ color: 'hsl(var(--text-primary))' }}>
            {step === 1 ? 'Create your identity.' : step === 2 ? 'Who are you in Zankoku?' : 'Choose your anime faction.'}
          </h2>
          {step === 2 && <p className="font-body text-[14px] mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>Your alignment affects how others see you. It is recorded on your profile. You can never hide it.</p>}
          {step === 3 && <p className="font-body text-[14px] mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>This determines your resource type and your starting free technique. Switching later costs everything you have built.</p>}
        </div>

        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>EMAIL</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                       placeholder="your@email.com"
                       className="w-full font-body text-[15px] rounded-[3px] focus:outline-none transition-colors"
                       style={{ background: 'hsl(var(--bg-elevated))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--text-primary))', padding: '14px 18px 14px 44px', borderColor: emailError ? 'hsl(var(--neon-red))' : email && isValidEmail ? 'hsl(var(--neon-green))' : email && !isValidEmail ? 'hsl(var(--neon-red))' : '' }} />
                {isCheckingEmail && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(var(--neon-purple))' }}></div>
                  </div>
                )}
                {!isCheckingEmail && email && isValidEmail && !emailError && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--neon-green))' }} />}
                {!isCheckingEmail && emailError && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--neon-red))' }} />}
              </div>
              {email && !isValidEmail && <div className="font-body text-[13px] mt-1.5 flex items-center gap-1.5" style={{ color: 'hsl(var(--neon-red))' }}><AlertCircle size={14} /> Invalid email format.</div>}
              {emailError && (
                <div className="font-body text-[13px] mt-1.5 flex items-start gap-1.5" style={{ color: 'hsl(var(--neon-red))' }}>
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>USERNAME</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                       placeholder="choose your name in Zankoku"
                       className="w-full font-body text-[15px] rounded-[3px] focus:outline-none transition-colors"
                       style={{ background: 'hsl(var(--bg-elevated))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--text-primary))', padding: '14px 18px 14px 44px', borderColor: username && isValidUsername ? 'hsl(var(--neon-green))' : username && !isValidUsername ? 'hsl(var(--neon-red))' : '' }} />
                {username && isValidUsername && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--neon-green))' }} />}
              </div>
              {usernameHasSpace && <div className="font-body text-[13px] mt-1.5 flex items-center gap-1.5" style={{ color: 'hsl(var(--neon-red))' }}><AlertCircle size={14} /> No spaces. Use underscores instead.</div>}
            </div>

            <div>
              <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                       className="w-full font-body text-[15px] rounded-[3px] focus:outline-none focus:border-[hsl(var(--neon-purple))] transition-colors pr-12"
                       style={{ background: 'hsl(var(--bg-elevated))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--text-primary))', padding: '14px 18px 14px 44px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-white transition-colors" style={{ color: 'hsl(var(--text-muted))' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 flex gap-1 h-1 rounded overflow-hidden bg-[var(--bg-elevated)]">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className="flex-1 transition-all duration-300" style={{ background: s <= passwordStrength ? passwordStrengthColor : 'transparent' }} />
                    ))}
                  </div>
                  <div className="font-body text-[12px] uppercase w-12 text-right" style={{ color: passwordStrengthColor }}>{passwordStrengthLabel}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                       className="w-full font-body text-[15px] text-white rounded-[3px] focus:outline-none transition-colors pr-12"
                       style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '14px 18px 14px 44px', borderColor: confirmPassword && doPasswordsMatch ? 'var(--neon-green)' : confirmPassword && !doPasswordsMatch ? 'var(--neon-red)' : '' }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPassword && doPasswordsMatch && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--neon-green)' }} />}
              </div>
              {confirmPassword && !doPasswordsMatch && <div className="font-body text-[13px] mt-1.5 flex items-center gap-1.5" style={{ color: 'var(--neon-red)' }}><AlertCircle size={14} /> Passwords do not match.</div>}
            </div>

            <div className="relative">
              <label className="block font-body font-semibold text-[13px] tracking-[2px] uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>COUNTRY</label>
              <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)}
                className="w-full flex items-center justify-between font-body text-[15px] text-left rounded-[3px] focus:outline-none"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '14px 18px', color: selectedCountry ? 'white' : 'var(--text-muted)' }}>
                <span className="flex items-center gap-2">
                  <Globe size={16} style={{ color: selectedCountry ? 'white' : 'var(--text-muted)' }} />
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Select your country'}
                </span>
              </button>
              
              {isCountryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-[4px] overflow-hidden flex flex-col max-h-[220px]"
                     style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' }}>
                  <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <input type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder="Search..."
                           className="w-full bg-transparent font-body text-[14px] text-white focus:outline-none" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredCountries.map(c => (
                      <button key={c.code} type="button" onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                        className="w-full text-left px-4 py-2 font-body text-[14px] text-white transition-colors hover:bg-[var(--border)]">
                        {c.flag} {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox" className="sr-only" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} />
                  <div className="w-4 h-4 rounded-[2px] transition-colors flex items-center justify-center"
                       style={{ border: '1px solid', borderColor: acceptedTerms ? 'var(--neon-purple)' : 'var(--border)', background: acceptedTerms ? 'var(--neon-purple)' : 'transparent' }}>
                    {acceptedTerms && <CheckCircle size={12} color="white" />}
                  </div>
                </div>
                <div className="font-body text-[14px] leading-tight select-none" style={{ color: 'var(--text-secondary)' }}>
                  I accept the <a href="#" target="_blank" className="underline hover:text-white" style={{ color: 'var(--neon-blue)' }}>Terms of Service</a> and <a href="#" target="_blank" className="underline hover:text-white" style={{ color: 'var(--neon-blue)' }}>Privacy Policy</a>.
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button onClick={() => setStep(2)}
                      className="w-full flex items-center justify-center gap-2 px-[32px] py-[14px] rounded-[3px] font-display font-bold tracking-[2px] text-white uppercase transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-purple) / 0.8))' }}>
                CONTINUE <ArrowRight size={20} />
              </button>
            </div>

            <div className="my-6 flex items-center justify-center relative">
              <div className="absolute left-0 right-0 h-[1px]" style={{ background: 'hsl(var(--border))' }} />
              <div className="relative px-4 font-body text-[13px]" style={{ background: 'hsl(var(--bg-surface))', color: 'hsl(var(--text-muted))' }}>OR</div>
            </div>

            
            {emailError ? (
              <div className="mt-6 p-4 rounded-[4px]" style={{ background: 'hsl(var(--neon-red) / 0.1)', border: '1px solid hsl(var(--neon-red) / 0.3)' }}>
                <div className="text-center">
                  <div className="font-body text-[14px] mb-3" style={{ color: 'hsl(var(--neon-red))' }}>
                    {emailError}
                  </div>
                  <Link 
                    to="/signin" 
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-[3px] font-display font-bold text-sm tracking-[2px] transition-all duration-200"
                    style={{ background: 'hsl(var(--neon-red))', color: 'white' }}
                  >
                    SIGN IN INSTEAD
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/signin" className="hover:underline transition-colors font-bold" style={{ color: 'hsl(var(--neon-purple))' }}>SIGN IN</Link>.
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHOOSE ALIGNMENT */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              { val: 'hero' as Alignment, title: 'HERO', Icon: Swords, color: 'var(--neon-blue)', body: 'You fight with purpose. Protect those who cannot protect themselves. Honour means something to you, even in Zankoku.' },
              { val: 'villain' as Alignment, title: 'VILLAIN', Icon: Skull, color: 'var(--neon-red)', body: 'Power is the only truth that matters. Take what you need. Justify it later or do not bother.' },
              { val: 'wanderer' as Alignment, title: 'WANDERER', Icon: Compass, color: 'var(--neon-gold)', body: 'No allegiance. No one to answer to. The road is yours and you take what it gives you.' }
            ].map(a => {
              const selected = alignment === a.val;
              return (
                <button key={a.val} onClick={() => setAlignment(a.val)}
                        className="w-full text-left p-6 rounded-[4px] relative transition-all duration-200"
                        style={{ background: selected ? `${a.color}0D` : 'transparent', border: '1px solid', borderColor: selected ? a.color : 'var(--border)' }}
                        onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 0 20px ${a.color}26`; } }}
                        onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; } }}>
                  {selected && <CheckCircle size={20} className="absolute right-4 top-4" style={{ color: a.color }} />}
                  <a.Icon size={20} className="mb-3" style={{ color: a.color }} />
                  <div className="font-display font-bold text-[16px] text-white mb-1.5 tracking-wide">{a.title}</div>
                  <div className="font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.body}</div>
                </button>
              );
            })}
            
            <div className="pt-4">
              <button onClick={() => setStep(3)}
                      className="w-full flex items-center justify-center px-[32px] py-[14px] rounded-[3px] font-display font-bold tracking-[2px] text-white uppercase transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)' }}>
                CONTINUE
              </button>
              <button onClick={() => setStep(1)} className="flex items-center justify-center w-8 h-8 font-body text-[14px] py-2 mt-3 rounded-lg bg-[#1A1A2E] hover:bg-[#2A2A4E] hover:text-white transition-colors mx-auto" style={{ color: 'var(--text-muted)' }}>
                ←
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE FACTION */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {ANIMES.map(a => {
                const color = FACTION_COLORS[a].hex;
                const selected = faction === a;
                const speed = ['jjk', 'blackclover', 'dragonball'].includes(a) ? 'Fast' : ['naruto', 'bleach', 'demonslayer'].includes(a) ? 'Medium' : 'Slow';
                return (
                  <button key={a} onClick={() => setFaction(a)}
                          className="text-left py-4 px-4 rounded-[4px] relative transition-all duration-200"
                          style={{ background: selected ? `${color}0D` : 'var(--bg-elevated)', border: '1px solid', borderColor: selected ? color : 'var(--border)' }}
                          onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 20px ${color}26`; } }}
                          onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}>
                    {selected && <CheckCircle size={16} className="absolute right-2 top-2" style={{ color }} />}
                    <div className="font-display font-bold text-[15px] text-white tracking-wide mb-1 leading-tight">{FACTION_NAMES[a]}</div>
                    <div className="font-body font-semibold text-[11px] uppercase tracking-[3px] mb-2" style={{ color }}>{FACTION_RESOURCE[a]}</div>
                    <div className="font-body text-[12px] mb-1.5" style={{ color: 'var(--text-muted)' }}>Free: <span style={{ color: 'var(--text-secondary)' }}>{TECHNIQUES[a][0].name}</span></div>
                    <div className="flex items-center gap-1 font-body text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      <Zap size={11} style={{ color }} /> {speed} refill
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setFaction('physical')}
                    className="w-full text-left py-4 px-4 rounded-[4px] relative transition-all duration-200 mt-1"
                    style={{ background: faction === 'physical' ? `rgba(255,255,255,0.05)` : 'var(--bg-elevated)', border: '1px solid', borderColor: faction === 'physical' ? 'white' : 'var(--border)' }}
                    onMouseEnter={e => { if (faction !== 'physical') { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 20px rgba(255,255,255,0.15)`; } }}
                    onMouseLeave={e => { if (faction !== 'physical') { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}>
              {faction === 'physical' && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />}
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell size={16} className="text-white" />
                <div className="font-display font-bold text-[15px] text-white tracking-wide leading-tight">PHYSICAL FIGHTER</div>
              </div>
              <div className="font-body font-semibold text-[11px] uppercase tracking-[3px] mb-2 text-white opacity-80">WILLPOWER</div>
              <div className="font-body text-[13px] pr-8" style={{ color: 'var(--text-secondary)' }}>
                No anime. No resource drain. Pure willpower that grows with every turn. Starting technique: <span className="text-white opacity-90">Iron Will</span>.
              </div>
            </button>

            <div className="pt-4 relative z-10">
              <button onClick={handleComplete}
                      className="w-full flex items-center justify-center px-[32px] py-[16px] rounded-[3px] font-display font-bold tracking-[2px] text-white uppercase transition-all duration-200 relative z-20"
                      style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)' }}>
                ENTER ZANKOKU
              </button>
              <button onClick={() => setStep(2)} className="w-full font-body text-[14px] py-2 mt-3 transition-colors hover:text-white relative z-20" style={{ color: 'var(--text-muted)' }}>
                BACK ALIGNMENT
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SignUp;
