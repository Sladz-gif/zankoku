import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, MessageCircle, Share2, Star, Clock, TrendingUp, Plus, Filter, Search } from 'lucide-react';

const MangaLibrary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'popular' | 'following'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = ['all', 'action', 'romance', 'fantasy', 'sci-fi', 'horror', 'comedy', 'drama', 'thriller'];

  const featuredSeries: any[] = [];

  const filteredSeries = featuredSeries.filter(series => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         series.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || series.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      <div className="max-w-7xl mx-auto p-4 md:p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/store')}
            className="p-2 rounded-lg transition-colors"
            style={{ background: '#080812', border: '1px solid #1A1A2E' }}
          >
            <ArrowLeft size={20} style={{ color: '#6666AA' }} />
          </button>
          <div>
            <h1 className="font-display text-3xl font-black tracking-wider" style={{ color: '#E8E8FF' }}>Manga Library</h1>
            <p className="font-body text-sm" style={{ color: '#6666AA' }}>Webtoon-style reading experience</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6666AA' }} />
            <input
              type="text"
              placeholder="Search manga, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg font-body text-sm"
              style={{ background: '#080812', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 rounded-lg font-body text-sm"
              style={{ background: '#080812', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
            <button 
              onClick={() => navigate('/profile?tab=create')}
              className="px-4 py-3 rounded-lg font-display text-sm font-bold tracking-wider flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)', color: '#FFFFFF', border: '1px solid #FF6B35' }}
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-8" style={{ borderColor: '#1A1A2E' }}>
          {(['trending', 'new', 'popular', 'following'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-3 font-body text-sm font-semibold capitalize flex items-center gap-2 transition-colors"
              style={{ 
                color: activeTab === tab ? '#FF6B35' : '#6666AA', 
                borderBottom: activeTab === tab ? '2px solid #FF6B35' : '2px solid transparent' 
              }}
            >
              {tab === 'trending' && <TrendingUp size={14} />}
              {tab === 'new' && <Clock size={14} />}
              {tab === 'popular' && <Star size={14} />}
              {tab === 'following' && <Heart size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSeries.map(series => (
            <div 
              key={series.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/manga/series/${series.id}`)}
            >
              <div className="relative overflow-hidden rounded-lg mb-3" style={{ height: '280px' }}>
                <div 
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  style={{ background: series.cover }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold"
                     style={{ 
                       background: series.status === 'ongoing' ? '#00FF88' : '#6666AA',
                       color: '#030308'
                     }}>
                  {series.status}
                </div>
                
                {/* Episode Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                     style={{ background: '#FFD700', color: '#030308' }}>
                  {series.episodes}/{series.totalEpisodes}
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display text-sm font-bold text-white mb-1">{series.title}</h3>
                  <p className="font-body text-xs text-gray-300">by {series.author}</p>
                </div>
              </div>
              
              {/* Series Info */}
              <div className="space-y-2">
                <p className="font-body text-xs line-clamp-2" style={{ color: '#6666AA' }}>
                  {series.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} style={{ color: '#FFD700' }} />
                      <span className="font-body text-xs font-bold" style={{ color: '#FFD700' }}>{series.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} style={{ color: '#6666AA' }} />
                      <span className="font-body text-xs" style={{ color: '#6666AA' }}>{series.views}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xs font-bold" style={{ color: '#FFD700' }}>{series.price}</span>
                    <span className="font-body text-xs" style={{ color: '#FFD700' }}> Gold</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #1A1A2E' }}>
                  <span className="font-body text-xs" style={{ color: '#6666AA' }}>{series.lastUpdated}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Handle like */ }}
                      className="p-1 rounded transition-colors hover:bg-opacity-20"
                      style={{ color: '#6666AA' }}
                    >
                      <Heart size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); /* Handle share */ }}
                      className="p-1 rounded transition-colors hover:bg-opacity-20"
                      style={{ color: '#6666AA' }}
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredSeries.length === 0 && (
          <div className="text-center p-12">
            <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#6666AA' }} />
            <h3 className="font-display text-lg font-bold tracking-wider" style={{ color: '#E8E8FF' }}>No manga found</h3>
            <p className="font-body text-sm mb-6" style={{ color: '#6666AA' }}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => navigate('/profile?tab=create')}
              className="mt-4 px-6 py-3 rounded font-display text-sm font-bold tracking-wider"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)', color: '#FFFFFF', border: '1px solid #FF6B35' }}
            >
              Create Your Own Manga
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaLibrary;
