import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Bell, Clock, TrendingUp, Star, Lock, Sparkles, Mail, ArrowLeft } from 'lucide-react';

const AnimeNews = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--neon-purple) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, var(--neon-blue) 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
          {/* Back Arrow */}
          <button
            onClick={() => navigate('/feed')}
            className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-white/10"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="text-center">
            {/* Lock Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.1), rgba(255, 0, 60, 0.05))',
                border: '2px solid var(--neon-red)',
                boxShadow: '0 0 30px rgba(255, 0, 60, 0.3)',
              }}
            >
              <Lock size={40} style={{ color: 'var(--neon-red)' }} />
            </div>
            
            {/* Main Title */}
            <h1 
              className="text-4xl md:text-6xl font-black mb-6"
              style={{
                fontFamily: 'Orbitron, monospace',
                background: 'linear-gradient(135deg, var(--text-primary), var(--neon-red))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(255, 0, 60, 0.3)',
              }}
            >
              ANIME NEWS
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Your ultimate source for anime updates, manga releases, and industry insights
            </p>
            
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))',
                border: '1px solid var(--neon-gold)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
              }}
            >
              <Clock size={20} style={{ color: 'var(--neon-gold)' }} />
              <span 
                className="font-bold text-lg"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  color: 'var(--neon-gold)',
                  letterSpacing: '2px',
                }}
              >
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature Cards */}
          {[
            {
              icon: Newspaper,
              title: "Latest News",
              description: "Breaking anime announcements, season previews, and industry updates",
              color: "var(--neon-blue)"
            },
            {
              icon: TrendingUp,
              title: "Trending Topics",
              description: "What's hot in the anime community - discussions, theories, and memes",
              color: "var(--neon-purple)"
            },
            {
              icon: Star,
              title: "Reviews & Ratings",
              description: "In-depth analysis, user reviews, and community ratings",
              color: "var(--neon-gold)"
            },
            {
              icon: Bell,
              title: "Release Calendar",
              description: "Never miss an episode - comprehensive release schedules",
              color: "var(--neon-green)"
            },
            {
              icon: Sparkles,
              title: "Exclusive Content",
              description: "Interviews, behind-the-scenes, and creator spotlights",
              color: "var(--neon-orange)"
            },
            {
              icon: Mail,
              title: "Newsletter",
              description: "Weekly digest delivered straight to your inbox",
              color: "var(--neon-red)"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="neon-card card-hover group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${feature.color}20`,
                      border: `1px solid ${feature.color}`,
                    }}
                  >
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 
                    className="text-lg font-bold"
                    style={{
                      fontFamily: 'Orbitron, monospace',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto">
          <div 
            className="neon-card text-center"
            style={{
              background: 'linear-gradient(135deg, var(--bg-surface), rgba(139, 0, 255, 0.05))',
              border: '1px solid var(--border-active)',
            }}
          >
            <div className="mb-6">
              <Mail size={48} style={{ color: 'var(--neon-purple)' }} />
            </div>
            
            <h2 
              className="text-2xl md:text-3xl font-black mb-4"
              style={{
                fontFamily: 'Orbitron, monospace',
                color: 'var(--text-primary)',
              }}
            >
              Get Notified at Launch
            </h2>
            
            <p 
              className="text-base mb-8 max-w-lg mx-auto"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Be the first to know when Anime News goes live. Get exclusive early access and special launch rewards.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="zk-input flex-1"
                    style={{
                      fontSize: '16px', // Prevent zoom on mobile
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="touch-target btn-press px-8 py-3 rounded-md font-bold transition-all duration-200 disabled:opacity-50"
                    style={{
                      fontFamily: 'Orbitron, monospace',
                      background: isLoading 
                        ? 'var(--bg-elevated)' 
                        : 'linear-gradient(135deg, var(--neon-purple), #5500CC)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      letterSpacing: '2px',
                      fontSize: '14px',
                      minWidth: '140px',
                    }}
                  >
                    {isLoading ? 'SUBSCRIBING...' : 'NOTIFY ME'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                  style={{
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid var(--neon-green)',
                  }}
                >
                  <Star size={20} style={{ color: 'var(--neon-green)' }} />
                  <span 
                    className="font-bold"
                    style={{
                      fontFamily: 'Orbitron, monospace',
                      color: 'var(--neon-green)',
                    }}
                  >
                    SUCCESS! You're on the list.
                  </span>
                </div>
                <p 
                  className="mt-4 text-sm"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    color: 'var(--text-secondary)',
                  }}
                >
                  We'll send you an email as soon as Anime News launches.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div 
        className="py-16"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(139, 0, 255, 0.05))',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div 
            className="inline-block"
            style={{
              fontFamily: 'Orbitron, monospace',
              color: 'var(--text-muted)',
              fontSize: '14px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            ZANKOKU ANIME NEWS
          </div>
          <p 
            className="mt-2 text-sm"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--text-muted)',
            }}
          >
            Bringing the anime world to Zankoku
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimeNews;
