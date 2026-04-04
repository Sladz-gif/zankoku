import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Star, Clock, ChevronLeft, ChevronRight, Bookmark, Settings } from 'lucide-react';

const MangaReader = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Series data would come from API/manga context
  const series = id ? { id, title: `Manga ${id}` } : null;
  const episodes: any[] = [];
  const comments: any[] = [];
  const currentEpisodeData = episodes.find(ep => ep.id === currentEpisode) || { pages: 1 };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < currentEpisodeData.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
      setCurrentPage(1);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisode < series.totalEpisodes) {
      setCurrentEpisode(currentEpisode + 1);
      setCurrentPage(1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-lg" style={{ background: '#080812CC', borderBottom: '1px solid #1A1A2E' }}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/manga')}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}
                >
                  <ArrowLeft size={20} style={{ color: '#6666AA' }} />
                </button>
                <div>
                  <h1 className="font-display text-lg font-bold" style={{ color: '#E8E8FF' }}>{series.title}</h1>
                  <p className="font-body text-xs" style={{ color: '#6666AA' }}>
                    Episode {currentEpisode}: {currentEpisodeData.title} • Page {currentPage}/{currentEpisodeData.pages}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}
                >
                  <MessageCircle size={18} style={{ color: '#6666AA' }} />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}
                >
                  <Settings size={18} style={{ color: '#6666AA' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Reading Area */}
          <div className={`flex-1 ${showComments ? 'mr-80' : ''} transition-all duration-300`}>
            {/* Episode Navigation */}
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={handlePrevEpisode}
                  disabled={currentEpisode === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors"
                  style={{ 
                    background: currentEpisode === 1 ? '#0D0D1A' : '#1A1A2E',
                    color: currentEpisode === 1 ? '#6666AA' : '#E8E8FF',
                    border: '1px solid #1A1A2E'
                  }}
                >
                  <ChevronLeft size={16} />
                  Prev Episode
                </button>
                
                <select
                  value={currentEpisode}
                  onChange={(e) => {
                    setCurrentEpisode(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg font-body text-sm font-semibold"
                  style={{ background: '#1A1A2E', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                >
                  {episodes.map(episode => (
                    <option key={episode.id} value={episode.id}>
                      Episode {episode.id}: {episode.title}
                    </option>
                  ))}
                </select>
                
                <button 
                  onClick={handleNextEpisode}
                  disabled={currentEpisode === series.totalEpisodes}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors"
                  style={{ 
                    background: currentEpisode === series.totalEpisodes ? '#0D0D1A' : '#1A1A2E',
                    color: currentEpisode === series.totalEpisodes ? '#6666AA' : '#E8E8FF',
                    border: '1px solid #1A1A2E'
                  }}
                >
                  Next Episode
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Manga Page */}
              <div className="relative bg-white rounded-lg overflow-hidden mb-6" style={{ minHeight: '600px' }}>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-lg flex items-center justify-center" 
                         style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}>
                      <span className="text-4xl font-bold text-white">{currentPage}</span>
                    </div>
                    <p className="text-gray-600 mb-2">Page {currentPage} of {currentEpisodeData.pages}</p>
                    <p className="text-gray-500 text-sm">Manga content would be displayed here</p>
                  </div>
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm font-bold tracking-wider transition-colors"
                  style={{ 
                    background: currentPage === 1 ? '#0D0D1A' : 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                    color: currentPage === 1 ? '#6666AA' : '#FFFFFF',
                    border: currentPage === 1 ? '1px solid #1A1A2E' : '1px solid #FF6B35'
                  }}
                >
                  <ChevronLeft size={18} />
                  Previous Page
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm" style={{ color: '#6666AA' }}>Page</span>
                  <span className="font-display text-sm font-bold" style={{ color: '#E8E8FF' }}>{currentPage}</span>
                  <span className="font-body text-sm" style={{ color: '#6666AA' }}>of {currentEpisodeData.pages}</span>
                </div>
                
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === currentEpisodeData.pages}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm font-bold tracking-wider transition-colors"
                  style={{ 
                    background: currentPage === currentEpisodeData.pages ? '#0D0D1A' : 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                    color: currentPage === currentEpisodeData.pages ? '#6666AA' : '#FFFFFF',
                    border: currentPage === currentEpisodeData.pages ? '1px solid #1A1A2E' : '1px solid #FF6B35'
                  }}
                >
                  Next Page
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          {showComments && (
            <div className="fixed right-0 top-0 h-full w-80 overflow-y-auto" style={{ background: '#080812', borderLeft: '1px solid #1A1A2E' }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold" style={{ color: '#E8E8FF' }}>Comments</h3>
                  <button 
                    onClick={() => setShowComments(false)}
                    className="p-1 rounded transition-colors"
                    style={{ color: '#6666AA' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 rounded-lg font-body text-sm resize-none"
                    style={{ background: '#0D0D1A', color: '#E8E8FF', border: '1px solid #1A1A2E' }}
                    rows={3}
                  />
                  <button className="mt-2 w-full px-3 py-2 rounded font-display text-xs font-bold tracking-wider"
                          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)', color: '#FFFFFF', border: '1px solid #FF6B35' }}>
                    Post Comment
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="p-3 rounded-lg" style={{ background: '#0D0D1A', border: '1px solid #1A1A2E' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body text-sm font-bold" style={{ color: '#E8E8FF' }}>{comment.user}</span>
                        <span className="font-body text-xs" style={{ color: '#6666AA' }}>{comment.time}</span>
                      </div>
                      <p className="font-body text-sm mb-2" style={{ color: '#E8E8FF' }}>{comment.text}</p>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-xs transition-colors" style={{ color: '#6666AA' }}>
                          <Heart size={12} />
                          {comment.likes}
                        </button>
                        <button className="text-xs transition-colors" style={{ color: '#6666AA' }}>Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaReader;
