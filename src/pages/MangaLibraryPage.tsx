import { useState } from 'react';
import { Search, Book, Star, Lock } from 'lucide-react';

interface Manga {
  id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
  rating: number;
  chapters: number;
  lastUpdated: string;
  isPremium: boolean;
}

const MangaLibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | 'new' | 'completed'>('all');

  const mangaList: Manga[] = [
    {
      id: 1,
      title: 'Shadow Ninja Chronicles',
      author: 'K. Yamamoto',
      cover: '/manga-covers/shadow-ninja.jpg',
      price: 0,
      rating: 4.8,
      chapters: 142,
      lastUpdated: '2 days ago',
      isPremium: false
    },
    {
      id: 2,
      title: 'Cursed Battle Academy',
      author: 'T. Tanaka',
      cover: '/manga-covers/cursed-academy.jpg',
      price: 50,
      rating: 4.6,
      chapters: 89,
      lastUpdated: '1 week ago',
      isPremium: true
    },
    {
      id: 3,
      title: 'Pirate King Adventures',
      author: 'M. Nakamura',
      cover: '/manga-covers/pirate-king.jpg',
      price: 0,
      rating: 4.9,
      chapters: 234,
      lastUpdated: '3 days ago',
      isPremium: false
    },
    {
      id: 4,
      title: 'Demon Slayer Corps',
      author: 'S. Hashimoto',
      cover: '/manga-covers/demon-slayer.jpg',
      price: 75,
      rating: 4.7,
      chapters: 167,
      lastUpdated: '5 days ago',
      isPremium: true
    },
    {
      id: 5,
      title: 'Dragon Ball Z Legacy',
      author: 'A. Watanabe',
      cover: '/manga-covers/dragon-ball.jpg',
      price: 0,
      rating: 5.0,
      chapters: 521,
      lastUpdated: '1 day ago',
      isPremium: false
    }
  ];

  const filteredManga = mangaList.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manga-library-page">
      <div className="manga-search-bar">
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="manga-search-input"
        />
      </div>

      {filteredManga.length === 0 ? (
        <div className="empty-state">
          <Book size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <div className="empty-state-title">NO MANGA FOUND</div>
          <div className="empty-state-body">
            Try adjusting your search terms or browse our collection.
          </div>
        </div>
      ) : (
        <div className="manga-grid">
          {filteredManga.map(manga => (
            <div key={manga.id} className="manga-card">
              <div className="manga-cover">
                {manga.isPremium && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--neon-gold)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Lock size={10} />
                    PREMIUM
                  </div>
                )}
                <img 
                  src={manga.cover} 
                  alt={manga.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.background = 'var(--bg-elevated)';
                  }}
                />
              </div>
              <div className="manga-card-info">
                <div className="manga-title">{manga.title}</div>
                <div className="manga-author">by {manga.author}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Star size={12} style={{ color: 'var(--neon-gold)', fill: 'var(--neon-gold)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {manga.rating.toFixed(1)}
                  </span>
                </div>
                <div className="manga-price">
                  {manga.price === 0 ? 'FREE' : `${manga.price} Gold`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MangaLibraryPage;
