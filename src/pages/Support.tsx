import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, HelpCircle, Bug, AlertTriangle, ChevronRight, Send, Search } from 'lucide-react';

const Support = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    {
      id: 'account',
      name: 'Account Issues',
      icon: '👤',
      color: 'var(--neon-blue)',
      articles: [
        'How to reset password',
        'Account recovery',
        'Changing username',
        'Deleting account'
      ]
    },
    {
      id: 'battles',
      name: 'Battle System',
      icon: '⚔️',
      color: 'var(--neon-red)',
      articles: [
        'Battle rules explained',
        'Technique system guide',
        'Ranking system',
        'Connection issues'
      ]
    },
    {
      id: 'currency',
      name: 'Currency & Payments',
      icon: '💰',
      color: 'var(--neon-gold)',
      articles: [
        'Gold vs Silver coins',
        'Payment methods',
        'Refund policy',
        'Transaction issues'
      ]
    },
    {
      id: 'clans',
      name: 'Clan System',
      icon: '🏰',
      color: 'var(--neon-purple)',
      articles: [
        'Creating a clan',
        'Clan wars guide',
        'Managing members',
        'Clan permissions'
      ]
    },
    {
      id: 'manga',
      name: 'Manga Platform',
      icon: '📚',
      color: '#FF6B35',
      articles: [
        'Creating manga',
        'Publishing guide',
        'Earning Gold',
        'Content guidelines'
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: '🔧',
      color: 'var(--neon-green)',
      articles: [
        'Browser compatibility',
        'Performance issues',
        'Bug reporting',
        'Feature requests'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with Zankoku?',
      answer: 'Simply sign up for an account, choose your anime faction, and jump into the Battle Lobby to start your first match!'
    },
    {
      question: 'What are Gold and Silver coins?',
      answer: 'Gold coins are premium currency used for manga access and premium features. Silver coins are used for battle techniques and game progression.'
    },
    {
      question: 'Can I play with friends?',
      answer: 'Yes! You can join clans together, participate in clan wars, and battle against each other.'
    },
    {
      question: 'How do I create manga?',
      answer: 'Visit your profile, click the "Create" tab, and use our manga creation tools to upload your stories and earn Gold!'
    },
    {
      question: 'Is Zankoku free to play?',
      answer: 'Yes! Zankoku is free to play. You can purchase optional currency and features, but all core gameplay is free.'
    }
  ];

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.articles.some(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 font-body text-sm flex items-center gap-2 transition-colors hover:text-white"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Back
          </button>
          <h1 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Support Center
          </h1>
          <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
            Find answers to common questions or get help from our support team
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2" 
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg font-body text-lg"
              style={{ 
                background: 'var(--bg-elevated)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Help Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    borderColor: selectedCategory === category.id ? category.color : 'var(--border)',
                    boxShadow: selectedCategory === category.id ? `0 0 20px ${category.color}30` : 'none'
                  }}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-display font-bold text-lg" style={{ color: category.color }}>
                      {category.name}
                    </h3>
                  </div>
                  
                  {selectedCategory === category.id && (
                    <div className="space-y-2">
                      {category.articles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded transition-colors hover:bg-gray-800 cursor-pointer"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <ChevronRight size={14} />
                          <span className="font-body text-sm">{article}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & FAQ */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] flex items-center gap-3"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    borderColor: 'var(--border)'
                  }}
                >
                  <MessageCircle size={20} style={{ color: 'var(--neon-blue)' }} />
                  <div className="text-left">
                    <div className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                      Live Chat
                    </div>
                    <div className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                      Chat with our support team
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] flex items-center gap-3"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    borderColor: 'var(--border)'
                  }}
                >
                  <Bug size={20} style={{ color: 'var(--neon-green)' }} />
                  <div className="text-left">
                    <div className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                      Report a Bug
                    </div>
                    <div className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                      Help us improve Zankoku
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] flex items-center gap-3"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    borderColor: 'var(--border)'
                  }}
                >
                  <AlertTriangle size={20} style={{ color: 'var(--neon-red)' }} />
                  <div className="text-left">
                    <div className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                      Report an Issue
                    </div>
                    <div className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                      Report inappropriate content
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <h3 className="font-display font-bold text-sm mb-2" style={{ color: 'var(--neon-blue)' }}>
                      {faq.question}
                    </h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Still Need Help?
            </h2>
            <p className="font-body text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all"
                style={{ 
                  background: 'var(--neon-blue)20', 
                  color: 'var(--neon-blue)',
                  border: '1px solid var(--neon-blue)'
                }}
              >
                <MessageCircle size={18} />
                Start Live Chat
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all"
                style={{ 
                  background: 'var(--neon-gold)20', 
                  color: 'var(--neon-gold)',
                  border: '1px solid var(--neon-gold)'
                }}
              >
                <Send size={18} />
                Email Support
              </button>
            </div>
            <div className="mt-6 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>Response time: Usually within 2-4 hours</p>
              <p>Email: support@zankoku.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
