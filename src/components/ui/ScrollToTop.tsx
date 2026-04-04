import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      style={{
        background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
        border: '1px solid #FF6B35',
        color: '#FFFFFF'
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} strokeWidth={2} />
    </button>
  );
};

export default ScrollToTop;
