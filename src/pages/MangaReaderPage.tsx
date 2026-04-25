import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, Maximize2, Minimize2 } from 'lucide-react';

const MangaReaderPage = () => {
  const { mangaId } = useParams<{ mangaId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout>();
  const readerRef = useRef<HTMLDivElement>(null);

  const totalPages = 156; // Example page count
  const mangaTitle = "Shadow Ninja Chronicles";

  useEffect(() => {
    const handleActivity = () => {
      setIsHeaderVisible(true);
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      setInactivityTimer(
        setTimeout(() => {
          setIsHeaderVisible(false);
        }, 3000)
      );
    };

    const handleScroll = () => {
      handleActivity();
    };

    const readerElement = readerRef.current;
    if (readerElement) {
      readerElement.addEventListener('scroll', handleScroll);
      readerElement.addEventListener('touchstart', handleActivity);
      readerElement.addEventListener('touchmove', handleActivity);
      readerElement.addEventListener('click', handleActivity);
    }

    return () => {
      if (readerElement) {
        readerElement.removeEventListener('scroll', handleScroll);
        readerElement.removeEventListener('touchstart', handleActivity);
        readerElement.removeEventListener('touchmove', handleActivity);
        readerElement.removeEventListener('click', handleActivity);
      }
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [inactivityTimer]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const goBack = () => {
    navigate('/manga');
  };

  return (
    <div className="manga-reader">
      <div 
        className={`manga-reader-header ${isHeaderVisible ? '' : 'hidden'}`}
        style={{ opacity: isHeaderVisible ? 1 : 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={goBack}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {mangaTitle}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleFullscreen}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <Maximize2 size={18} />
            </button>
            <button 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="manga-reader-pages" ref={readerRef}>
        <img 
          src={`/manga-pages/${mangaId}/${currentPage}.jpg`}
          alt={`Page ${currentPage}`}
          className="manga-page-img"
          onError={(e) => {
            console.error(`Failed to load page ${currentPage}:`, e);
          }}
        />
      </div>

      {/* Page Navigation */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '12px 20px',
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        zIndex: 30
      }}>
        <button 
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          style={{
            background: currentPage <= 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ChevronLeft size={18} />
          Previous
        </button>
        
        <div style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '100px',
          textAlign: 'center'
        }}>
          {currentPage} / {totalPages}
        </div>
        
        <button 
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          style={{
            background: currentPage >= totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MangaReaderPage;
