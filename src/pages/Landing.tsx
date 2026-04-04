import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Swords, Shield, BookOpen, User, Zap, ShoppingBag, Users, Heart, MessageCircle, Play, ArrowRight, Menu, Skull, ChevronRight, Lock, Globe } from 'lucide-react';
import { AnimeFaction, FACTION_COLORS, FACTION_NAMES, FACTION_RESOURCE } from '@/types/game';

// Section 1: Navbar
const NavBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{ background: 'rgba(3, 3, 8, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      <div className="relative cursor-pointer" onClick={() => scrollTo('hero')}>
        <span className="font-serif absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hover:opacity-25"
          style={{ fontSize: '32px', color: 'var(--neon-purple)', opacity: 0.15, zIndex: 0 }}>残酷</span>
        <span className="font-display font-black text-xl tracking-widest relative z-10 text-white">ZANKOKU</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {['What It Is', 'Factions', 'The Game', 'Creators'].map(link => (
          <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
            className="font-body font-semibold text-sm uppercase tracking-widest transition-colors hover:text-white"
            style={{ color: 'var(--text-secondary)', letterSpacing: '2px' }}>
            {link}
          </button>
        ))}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/signin')}
            className="font-display text-sm px-6 py-2.5 rounded-[3px] transition-all duration-200"
            style={{ border: '1px solid var(--border-active)', color: 'var(--text-primary)' }}>
            SIGN IN
          </button>
          <button onClick={() => navigate('/signup')}
            className="font-display font-bold text-sm tracking-widest px-8 py-2.5 rounded-[3px] hover:brightness-110 hover:shadow-[0_0_20px_rgba(139,0,255,0.4)] transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)', color: 'white', letterSpacing: '2px' }}>
            ENTER ZANKOKU
          </button>
        </div>
      </div>

      <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={24} />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 p-4 border-b flex flex-col gap-4 shadow-xl"
          style={{ background: 'rgba(3, 3, 8, 0.95)', backdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>
          {['What It Is', 'Factions', 'The Game', 'Creators'].map(link => (
            <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
              className="font-body font-semibold text-sm uppercase tracking-widest text-left py-2"
              style={{ color: 'var(--text-primary)', letterSpacing: '2px' }}>
              {link}
            </button>
          ))}
          <button onClick={() => navigate('/signin')} className="w-full font-display text-sm py-3 border rounded-[3px]" style={{ borderColor: 'var(--border-active)', color: 'white' }}>SIGN IN</button>
          <button onClick={() => navigate('/signup')} className="w-full font-display font-bold text-sm py-3 rounded-[3px]" style={{ background: 'linear-gradient(135deg, var(--neon-purple), #5500CC)', color: 'white', letterSpacing: '2px' }}>ENTER ZANKOKU</button>
        </div>
      )}
    </nav>
  );
};

// Section 2: Hero
const Hero = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; opacity: number }[] = [];
    const colors = ['#8B00FF', '#00C8FF', '#FF003C', '#00FF88', '#FFD700'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.3
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 40%, hsl(var(--neon-purple) / 0.12) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 60%, hsl(var(--neon-blue) / 0.08) 0%, transparent 55%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <span className="font-serif leading-none" style={{ fontSize: '40vw', color: 'white', opacity: 0.03 }}>残酷</span>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-[-40px]">
        <div className="font-body font-semibold text-xs tracking-[6px] mb-4" style={{ color: 'var(--text-muted)' }}>FOR ANIME FANS WHO WANT MORE THAN A FORUM</div>
        <h1 className="font-display font-black leading-[1.1] mb-2" style={{ fontSize: 'clamp(52px, 9vw, 96px)', color: 'hsl(var(--text-primary))' }}>ZANKOKU</h1>
        <h2 className="font-display font-black mb-6" style={{ fontSize: 'clamp(18px, 3vw, 36px)', color: 'var(--text-secondary)' }}>WHERE YOUR FACTION IS YOUR IDENTITY</h2>
        
        <p className="font-body mb-10 max-w-[560px] mx-auto" style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Pick your anime. Earn your rank. Post, fight, sell your work, and build a following inside a world that remembers everything you do.
          
          Not a game. Not just a forum. A social platform where being a One Piece fan means something different than being a JJK fan, and both of you have something to prove.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto px-4">
          <button onClick={() => navigate('/signup')}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-3.5 rounded-[3px] font-display font-bold tracking-[2px] text-white transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-purple) / 0.8))', boxShadow: '0 0 0 hsl(var(--neon-purple) / 0)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px hsl(var(--neon-purple) / 0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 hsl(var(--neon-purple) / 0)'}>
            CHOOSE YOUR FACTION <ArrowRight size={18} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-[3px] font-display font-bold tracking-[2px] transition-all duration-200"
            style={{ background: 'transparent', border: '1px solid hsl(var(--neon-blue))', color: 'hsl(var(--neon-blue))' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'hsl(var(--neon-blue) / 0.08)'; e.currentTarget.style.boxShadow = '0 0 20px hsl(var(--neon-blue) / 0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
            <Play size={18} fill="currentColor" /> SEE HOW IT WORKS
          </button>
        </div>
        
        <div className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          14,280 fighters active. 893 clan wars in progress. Your faction is waiting.
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ animation: 'bounce 1.4s infinite ease-in-out' }}>
        <ChevronDown size={24} style={{ color: 'var(--neon-red)' }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

// Section 3: What It Is
const ThreePillars = () => {
  return (
    <section id="what-it-is" className="relative py-12 md:py-20 px-6" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="font-body font-semibold text-xs tracking-[6px] text-center mb-12" style={{ color: 'var(--text-muted)' }}>WHAT ZANKOKU IS</div>
        <h2 className="font-display font-bold text-white mb-16 text-center" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Not one thing. Everything anime fans actually want.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-[4px] p-8 relative overflow-hidden transition-all duration-250 hover:brightness-110" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-red)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,60,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'var(--neon-red)' }} />
            <Swords size={28} style={{ color: 'var(--neon-red)' }} className="mb-6" />
            <h3 className="font-display font-bold text-xl text-white mb-4">A SOCIAL FEED WITH STAKES</h3>
            <p className="font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Post your thoughts, reactions, and victories. Follow other fighters. Repost with commentary. But your alignment and rank are always visible. A villain ranked 12 bragging about a duel-to-death win reads differently than a hero ranked 67 asking for help. Context is everything here.
            </p>
          </div>

          <div className="group rounded-[4px] p-8 relative overflow-hidden transition-all duration-250 hover:brightness-110" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-blue)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,200,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'var(--neon-blue)' }} />
            <Shield size={28} style={{ color: 'var(--neon-blue)' }} className="mb-6" />
            <h3 className="font-display font-bold text-xl text-white mb-4">CLANS THAT ACTUALLY FIGHT</h3>
            <p className="font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Create or join a clan. Recruit fighters from any faction. Declare war on rival clans. Send spies to gather intel. Place bounties on enemies. A clan in Zankoku is not a Discord server. It is a team with a war record, a reputation, and enemies.
            </p>
          </div>

          <div className="group rounded-[4px] p-8 relative overflow-hidden transition-all duration-250 hover:brightness-110" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-gold)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'var(--neon-gold)' }} />
            <BookOpen size={28} style={{ color: 'var(--neon-gold)' }} className="mb-6" />
            <h3 className="font-display font-bold text-xl text-white mb-4">A MARKET FOR ANIME CREATORS</h3>
            <p className="font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Sell your manga, manhwa, comics, and fan art directly to people who already understand the culture. Set your price in Silver or Gold. Your buyers do not need you to explain the reference. They lived it too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Section 4: How It Works
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-20 px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="font-body font-semibold text-xs tracking-[6px] mb-6" style={{ color: 'var(--text-muted)' }}>HOW IT WORKS</div>
        <h2 className="font-display font-bold text-white mb-16" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Four decisions. One world.</h2>
        
        <div className="flex flex-col md:flex-row relative">
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[1px]" style={{ background: 'var(--border)', zIndex: 0 }} />
          
          {[
            { num: '1', icon: User, color: 'var(--neon-purple)', title: 'PICK YOUR SIDE', body: 'Choose your alignment first. Hero, villain, or wanderer. This is not cosmetic. It shapes how other users read you, who will trust you, and who will hunt you.' },
            { num: '2', icon: Zap, color: 'var(--neon-orange)', title: 'CHOOSE YOUR ANIME', body: 'Your faction determines your resource. Naruto gives you Chakra. JJK gives you Cursed Energy. One Piece gives you Haki. Your resource powers every technique you use in duels and clan wars. Choose the universe you know.' },
            { num: '3', icon: ShoppingBag, color: 'var(--neon-blue)', title: 'BUILD YOUR TECHNIQUE SET', body: 'One technique is free when you sign up, pulled from your faction\'s canon. Buy more with Silver or Gold. Techniques expire each season so the meta stays fresh. Your loadout is your fingerprint.' },
            { num: '4', icon: Swords, color: 'var(--neon-red)', title: 'FIGHT, POST, AND RISE', body: 'Duel other players in Dot Wars. Win their points. Climb the rank. Post on the feed. Join a clan. Sell your work. Get followed. Get hunted. Zankoku rewards everyone differently depending on how they play.' },
          ].map((step, i) => (
            <div key={i} className="flex-1 px-4 relative z-10 flex flex-col items-center mb-12 md:mb-0">
              <div className="font-display font-black text-[48px] leading-none mb-4" style={{ color: 'var(--border-active)' }}>{step.num}</div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                <step.icon size={24} style={{ color: step.color }} />
              </div>
              <h3 className="font-display font-bold text-[16px] text-white mb-3 tracking-wide text-center">{step.title}</h3>
              <p className="font-body text-[15px] leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section 5: The Game Preview
const GamePreview = () => {
  return (
    <section id="the-game" className="py-12 md:py-20 px-6" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="font-body font-semibold text-xs tracking-[6px] mb-6" style={{ color: 'var(--text-muted)' }}>THE GAME</div>
          <h2 className="font-display font-bold text-white mb-6" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Dot Wars. The arena inside the world.</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--neon-purple)' }}>HOW IT WORKS</h3>
              <p className="font-body text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>A grid of dots. Two players take turns drawing lines between adjacent dots. Close a shape and you own it. Own the most shapes when the board fills up and you win. Simple to understand. Brutal to master on a 14x14 TITAN grid against someone with Domain Expansion and three turns of Nen Restriction on you.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--neon-purple)' }}>YOUR TECHNIQUES MATTER</h3>
              <p className="font-body text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Every technique you buy in the store has an effect on the board. Conqueror's Haki makes your opponent skip their next turn. Bankai steals a shape they already own. Ope Ope no Mi (if you can afford 75 Haki) swaps the entire score instantly. The right technique at the right moment changes the outcome of every match.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--neon-purple)' }}>THE STAKES</h3>
              <p className="font-body text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Lose a normal duel and you lose all your points. Your opponent gets them. Both players lose half their own points as the cost of fighting, win or lose. Accept a Duel to Death and there is no coming back from a loss. Your rank drops permanently. The winner gets everything and a temporary SLAYER tag with your name on it.</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md relative pb-10">
            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
              <div className="font-display font-bold tracking-widest text-xl px-4 py-1 rounded" style={{ color: 'var(--neon-green)', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--neon-green)', boxShadow: '0 0 15px rgba(0,255,136,0.3)' }}>DOMAIN EXPANSION</div>
            </div>
            <div className="relative w-full aspect-square border rounded-lg p-6 bg-[#030308]" style={{ borderColor: 'var(--border-active)', boxShadow: '0 0 40px rgba(139,0,255,0.1)' }}>
               {/* Static SVG representation of 6x6 grid */}
               <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Grid Dots */}
                  {[0,1,2,3,4,5].map(x => [0,1,2,3,4,5].map(y => (
                    <circle key={`${x}-${y}`} cx={x*20} cy={y*20} r="2" fill="#333355" />
                  )))}
                  
                  {/* Lines P1 (Purple) */}
                  <line x1="20" y1="20" x2="40" y2="20" stroke="var(--neon-purple)" strokeWidth="2" />
                  <line x1="20" y1="20" x2="20" y2="40" stroke="var(--neon-purple)" strokeWidth="2" />
                  <line x1="40" y1="20" x2="40" y2="40" stroke="var(--neon-purple)" strokeWidth="2" />
                  <line x1="20" y1="40" x2="40" y2="40" stroke="var(--neon-purple)" strokeWidth="2" />
                  <line x1="40" y1="40" x2="60" y2="40" stroke="var(--neon-purple)" strokeWidth="2" />
                  
                  {/* Lines P2 (Blue) */}
                  <line x1="60" y1="60" x2="80" y2="60" stroke="var(--neon-blue)" strokeWidth="2" />
                  <line x1="60" y1="60" x2="60" y2="80" stroke="var(--neon-blue)" strokeWidth="2" />
                  <line x1="80" y1="60" x2="80" y2="80" stroke="var(--neon-blue)" strokeWidth="2" />
                  <line x1="60" y1="80" x2="80" y2="80" stroke="var(--neon-blue)" strokeWidth="2" />
                  
                  {/* Fills */}
                  <rect x="21" y="21" width="18" height="18" fill="var(--neon-purple)" opacity="0.3" />
                  <rect x="61" y="61" width="18" height="18" fill="var(--neon-blue)" opacity="0.3" />
                  <rect x="21" y="41" width="18" height="18" fill="var(--neon-purple)" opacity="0.1" />
               </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Section 6: Factions
const Factions = () => {
  const navigate = useNavigate();
  const factionDescriptions: Record<AnimeFaction, string> = {
    naruto: 'The most stubborn fighters on the platform. Chakra depletes fast but refills steadily. Shadow Clone Jutsu gives you two lines in one turn. Rasengan destroys a shape your opponent already owns.',
    jjk: 'High risk, high damage. Cursed Energy depletes fast and refills fast. Domain Expansion locks your opponent to the center zone for two turns. Black Flash steals a shape outright.',
    onepiece: 'Slow burn. Haki depletes slowly and refills slowly. Conqueror\'s Haki makes your opponent skip their next turn. Ope Ope no Mi, if you can afford it, swaps both scores instantly.',
    bleach: 'Large pool, steady pace. Reiatsu is the most forgiving resource. Bankai steals a shape. Getsuga Tensho destroys one. Flash Step gives you two lines this turn.',
    blackclover: 'Fast refill, limited depth. Mana refills faster than any other resource but caps low. Mana Zone lets you connect dots two spaces apart. Black Asta removes your opponent\'s last line.',
    dragonball: 'Pure aggression. Ki depletes and refills fast. Kamehameha wipes the entire middle row of lines for both players. Spirit Bomb steals a shape.',
    demonslayer: 'Balanced and precise. Flame Breathing doubles your lines this turn. Water Breathing doubles the cost of your opponent\'s next technique. Thunder Clap Flash steals a shape.',
    hxh: 'The smallest faction and the most dangerous. Nen depletes slowly with a long refill. Nen Restriction locks your opponent out of techniques for three turns. Jajanken picks a random devastating effect. Gyo reveals which lines would complete a shape for the next two turns.',
    physical: ''
  };

  const factionCounts: Record<AnimeFaction, string> = {
    naruto: '3,200', jjk: '2,900', onepiece: '2,400', bleach: '1,800',
    blackclover: '1,600', dragonball: '2,100', demonslayer: '1,400', hxh: '980', physical: ''
  };

  const animeList = Object.keys(factionDescriptions).filter(k => k !== 'physical') as AnimeFaction[];

  return (
    <section id="factions" className="py-12 md:py-20 px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto text-center mb-12">
        <div className="font-body font-semibold text-xs tracking-[6px] mb-6" style={{ color: 'var(--text-muted)' }}>THE FACTIONS</div>
        <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Eight anime universes. One platform. Pick the one that raised you.</h2>
        <p className="font-body mt-6 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Your faction is not decoration. It determines your resource type, your starting technique, your refill speed, and the techniques available to you in the store. Switching factions is possible but it costs everything you built. Your betrayal is recorded permanently on your profile and your old faction can place a bounty on you the moment you switch.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {animeList.map(anime => {
          const color = FACTION_COLORS[anime].hex;
          return (
            <div key={anime} className="group cursor-pointer relative rounded-[4px] p-6 text-left transition-all duration-200 hover:-translate-y-1"
                 style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 24px ${color}33`; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                 onClick={() => navigate('/signup')}>
              <h3 className="font-display font-bold text-[18px] text-white mb-1">{FACTION_NAMES[anime]}</h3>
              <div className="font-body font-semibold text-[13px] tracking-[3px] uppercase mb-4" style={{ color }}>{FACTION_RESOURCE[anime]}</div>
              <p className="font-body text-[14px] leading-relaxed mb-6 h-[60px]" style={{ color: 'var(--text-secondary)' }}>{factionDescriptions[anime]}</p>
              <div className="flex items-center gap-1.5 font-body text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <Users size={12} /> {factionCounts[anime]}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: color }} />
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <button onClick={() => navigate('/signup')}
          className="font-display font-bold text-sm tracking-widest px-8 py-3 rounded-[3px] transition-all duration-200 hover:brightness-110"
          style={{ border: '1px solid var(--border-active)', color: 'white', background: 'var(--bg-elevated)' }}>
          CHOOSE YOUR FACTION
        </button>
      </div>
    </section>
  );
};

// Section 7: Stats Section
const SocialProof = () => {
  return (
    <section className="relative py-20 px-6" style={{ background: 'var(--bg-surface)' }}>
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <span className="font-serif leading-none" style={{ fontSize: '30vw', color: 'white', opacity: 0.04 }}>残酷</span>
      </div>
      
      <div className="text-center relative z-10 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="font-display font-black text-[48px] text-white mb-2">14,280</div>
            <div className="font-body text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>FIGHTERS ACTIVE</div>
          </div>
          <div>
            <div className="font-display font-black text-[48px] text-white mb-2">893</div>
            <div className="font-body text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>CLAN WARS IN PROGRESS</div>
          </div>
          <div>
            <div className="font-display font-black text-[48px] text-white mb-2">47,200</div>
            <div className="font-body text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>TECHNIQUES PURCHASED</div>
          </div>
        </div>
        <p className="font-body italic text-[18px] max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Every rank you see was taken from someone. Every technique on that profile was bought or earned. Nothing here is given.
        </p>
      </div>
    </section>
  );
};

// Section 8: Community Feed Preview
const Testimonials = () => {
  return (
    <section id="from-the-feed" className="py-12 md:py-20 px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="font-body font-semibold text-xs tracking-[6px] text-center mb-12" style={{ color: 'var(--text-muted)' }}>FROM THE FEED</div>
        <h2 className="font-display font-bold text-white mb-16 text-center" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>This is what it looks like when anime fans have something at stake.</h2>
        
        <div className="font-body text-center mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          These are real post types from inside Zankoku. No moderation theater. No sanitized highlights. This is what the feed actually looks like.
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[4px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full" style={{ background: '#0D0D1A', border: '1px solid var(--neon-red)', boxShadow: '0 0 10px rgba(255,0,60,0.4)' }} />
              <div>
                <div className="font-body font-bold text-white text-[15px] leading-tight">ShadowAkira</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body font-semibold text-[11px] tracking-[2px]" style={{ color: 'var(--neon-red)' }}>JJK</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}>VILLAIN</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}>BERSERKER</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}>RANK 12</span>
                </div>
              </div>
            </div>
            <p className="font-body text-[15px] leading-[1.6] mb-6" style={{ color: 'var(--text-primary)' }}>
              Just ran a TITAN grid against VoidHunter. 14 shapes to their 3. They used Domain Expansion on turn 4. I waited them out and hit Ope Ope no Mi when they were up by 6. Final score: me 14, them 3. I took 840 points. The bounty I placed on them is still active. Come claim it if you think you can.
            </p>
            <div className="flex items-center gap-4 font-body text-[13px]" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5"><Heart size={14} /> 234 likes</span>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} /> 18 comments</span>
            </div>
          </div>

          <div className="p-6 rounded-[4px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full" style={{ background: '#0D0D1A', border: '1px solid var(--neon-blue)', boxShadow: '0 0 10px rgba(0,200,255,0.4)' }} />
              <div>
                <div className="font-body font-bold text-white text-[15px] leading-tight">NullBlade</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body font-semibold text-[11px] tracking-[2px]" style={{ color: 'var(--neon-blue)' }}>BLEACH</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>HERO</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>STRATEGIST</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>RANK 34</span>
                </div>
              </div>
            </div>
            <p className="font-body text-[15px] leading-[1.6] mb-6" style={{ color: 'var(--text-primary)' }}>
              Cursed Dominion declared war on us yesterday. They have 47 members to our 31. They sent a spy in two weeks ago. We found them on day 9. The intel they got was a decoy. We knew every technique they were planning. Final score: Null Throne 23 wins, Cursed Dominion 4. Looking for two more fighters who know how to hold a flank. Bleach or mixed faction. Message me.
            </p>
            <div className="flex items-center gap-4 font-body text-[13px]" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5"><Heart size={14} /> 88 likes</span>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} /> 31 comments</span>
            </div>
          </div>

          <div className="p-6 rounded-[4px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full" style={{ background: '#0D0D1A', border: '1px solid var(--neon-gold)', boxShadow: '0 0 10px rgba(255,215,0,0.4)' }} />
              <div>
                <div className="font-body font-bold text-white text-[15px] leading-tight">GhostSeraph</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body font-semibold text-[11px] tracking-[2px]" style={{ color: 'var(--neon-gold)' }}>ONE PIECE</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-gold)', color: 'var(--neon-gold)' }}>WANDERER</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-gold)', color: 'var(--neon-gold)' }}>GHOST</span>
                  <span className="px-1.5 py-0.5 text-[10px] border rounded-sm" style={{ borderColor: 'var(--neon-gold)', color: 'var(--neon-gold)' }}>RANK 67</span>
                </div>
              </div>
            </div>
            <p className="font-body text-[15px] leading-[1.6] mb-6" style={{ color: 'var(--text-primary)' }}>
              Yes I switched twice. Yes I have two coward stars. Yes there are three bounties on my head right now. I have been rank 67 for six weeks using nothing but Observation Haki and patience. Two of those bounty hunters gave up. The third one I beat in a best-of-3. Come find me if you want to try. I am not hard to locate. I just never lose.
            </p>
            <div className="flex items-center gap-4 font-body text-[13px]" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5"><Heart size={14} /> 192 likes</span>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} /> 67 comments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Section 10: For Creators
const Creators = () => {
  const navigate = useNavigate();
  return (
    <section id="creators" className="py-12 md:py-20 px-6" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="font-body font-semibold text-xs tracking-[6px] text-center mb-12" style={{ color: 'var(--text-muted)' }}>FOR CREATORS</div>
        <h2 className="font-display font-bold text-white mb-16 text-center" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Your audience is already here. They just do not know your name yet.</h2>
        
        <div className="font-body text-center mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          If you make manga, manhwa, comics, or fan art, Zankoku is the only platform where your buyers are already immersed in the culture you are drawing from. You do not have to market to casual fans. Everyone on Zankoku chose a faction. Everyone here reads. Set your price in Silver or Gold. First episode or chapter free to hook readers. The rest is yours.
          
          Platform takes 30 percent. You keep 70. No withdrawal to cash. Earnings stay as Gold and Silver in your account to spend on techniques, bounties, or clan creation. Your work funds your war chest.
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-3xl mx-auto">
          <div className="text-center p-8 rounded-[4px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="font-display font-black text-[36px] text-white mb-4">70%</div>
            <div className="font-body text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>of every sale goes directly to the creator</div>
          </div>
          <div className="text-center p-8 rounded-[4px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="font-display font-black text-[36px] text-white mb-4">FREE</div>
            <div className="font-body text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>First chapter or episode is always free. Readers decide if your work is worth continuing.</div>
          </div>
        </div>
        
        <div className="text-center">
          <button onClick={() => navigate('/signup')}
            className="font-display font-bold text-sm tracking-widest px-8 py-3 rounded-[3px] transition-all duration-200 hover:brightness-110"
            style={{ border: '1px solid var(--neon-gold)', color: 'var(--neon-gold)', background: 'var(--bg-elevated)' }}>
            UPLOAD YOUR FIRST WORK
          </button>
        </div>
      </div>
    </section>
  );
};

// Section 11: Final CTA
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-[120px] px-6 text-center" style={{ background: 'var(--bg-surface)' }}>
      <div className="font-body font-semibold text-xs tracking-[6px] mb-6" style={{ color: 'var(--text-muted)' }}>YOUR ARC STARTS HERE</div>
      <h2 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>Enter Zankoku.</h2>
      <p className="font-body text-[18px] max-w-[480px] mx-auto mb-10 leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
        Sign up free. Choose your faction. Pick your alignment. One technique on the house from your anime's canon. Everything else you earn, buy, steal in a duel, or claim from someone who could not hold onto it.
        
        Your rank starts at zero. Your betrayal history is clean. Your profile is empty. That changes the moment you make your first move.
      </p>
      <button onClick={() => navigate('/signup')}
        className="group inline-flex items-center justify-center gap-2 px-[48px] py-[18px] rounded-[3px] font-display font-bold tracking-[2px] text-white transition-all duration-200"
        style={{ background: 'linear-gradient(135deg, #8B00FF 0%, #5500CC 100%)' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 0, 255, 0.5)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
        CHOOSE YOUR FACTION <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
      </button>
      <div className="font-body text-[13px] mt-6" style={{ color: 'var(--text-muted)' }}>
        No withdrawals. All coins stay in Zankoku. By signing up you accept the terms of service.
      </div>
    </section>
  );
};

// Section 10: Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <div className="font-display font-black text-[24px] text-white leading-none mb-2">ZANKOKU</div>
              <div className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                No mercy. No refuge. Only rank.
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              {[
                { name: 'Twitter', icon: '📱', color: '#1DA1F2' },
                { name: 'Discord', icon: '💬', color: '#5865F2' },
                { name: 'YouTube', icon: '🎮', color: '#FF0000' },
                { name: 'TikTok', icon: '🎵', color: '#000000' }
              ].map(social => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ 
                    background: `${social.color}20`, 
                    border: `1px solid ${social.color}40`,
                    color: social.color
                  }}
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <h3 className="font-display font-bold text-[14px] text-white mb-4 tracking-wider uppercase">PLATFORM</h3>
            <ul className="space-y-2">
              {[
                { name: 'Battle Lobby', href: '/battle-lobby' },
                { name: 'Manga Library', href: '/manga' },
                { name: 'Clan Wars', href: '/clans' },
                { name: 'Leaderboard', href: '/leaderboard' },
                { name: 'Store', href: '/store' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-body text-[13px] transition-colors hover:text-white flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronRight size={12} className="opacity-50" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="font-display font-bold text-[14px] text-white mb-4 tracking-wider uppercase">COMMUNITY</h3>
            <ul className="space-y-2">
              {[
                { name: 'Social Feed', href: '/feed' },
                { name: 'Messages', href: '/messages' },
                { name: 'Creator Hub', href: '/profile?tab=create' },
                { name: 'Tournaments', href: '/battle-lobby' },
                { name: 'Bounty Board', href: '/bounties' },
                { name: 'Support', href: '/support' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-body text-[13px] transition-colors hover:text-white flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronRight size={12} className="opacity-50" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-display font-bold text-[14px] text-white mb-4 tracking-wider uppercase">RESOURCES</h3>
            <ul className="space-y-2">
              {[
                { name: 'Game Guide', href: '/guide' },
                { name: 'Technique Database', href: '/techniques' },
                { name: 'Faction Overview', href: '/factions' },
                { name: 'Economy System', href: '/economy' },
                { name: 'Developer API', href: '/api' },
                { name: 'Status Page', href: '/status' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-body text-[13px] transition-colors hover:text-white flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <ChevronRight size={12} className="opacity-50" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'var(--border)' }} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-body text-[12px]" style={{ color: 'var(--text-muted)' }}>
              2026 Zankoku. All rights reserved.
            </div>
            <div className="font-body text-[11px] mt-1" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              All coins and resources are in-platform only and cannot be withdrawn as real currency.
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: 'About', href: '/about' },
              { name: 'Privacy', href: '/privacy' },
              { name: 'Terms', href: '/terms' },
              { name: 'Support', href: '/support' }
            ].map(link => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-[12px] transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Shield size={14} />
            <span>Secure Platform</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Lock size={14} />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Globe size={14} />
            <span>Global Community</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Zap size={14} />
            <span>24/7 Battles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Landing = () => {
  useEffect(() => {
    // Inject the scanline overlay style safely here
    const styleId = 'landing-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .scanline-overlay-fixed {
          position: fixed;
          top: 0; left: 0; right: 0; height: 1px;
          background: rgba(255, 255, 255, 0.02);
          animation: scan 8s linear infinite;
          pointer-events: none;
          z-index: 1000;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100vh; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="min-h-screen zankoku-bg relative">
      <div className="scanline-overlay-fixed" />
      <NavBar />
      <Hero />
      <ThreePillars />
      <HowItWorks />
      <GamePreview />
      <Factions />
      <SocialProof />
      <Testimonials />
      <Creators />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
