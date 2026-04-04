import { useEffect, useRef } from 'react';

interface UseClickOutsideProps {
  isOpen: boolean;
  onClose: () => void;
  excludeRefs?: React.RefObject<HTMLElement | HTMLButtonElement | HTMLDivElement | HTMLTextAreaElement>[];
}

export const useClickOutside = ({ isOpen, onClose, excludeRefs = [] }: UseClickOutsideProps) => {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the container
      if (containerRef.current && !containerRef.current.contains(target)) {
        // Check if click is not in any excluded refs
        const isExcluded = excludeRefs.some(ref => 
          ref.current && ref.current.contains(target)
        );
        
        if (!isExcluded) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, excludeRefs]);

  return containerRef;
};
