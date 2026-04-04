import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, FileText, Shield, Cookie, Users, ArrowUp } from 'lucide-react';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    icon?: React.ReactNode;
  }>;
}

const LegalLayout = ({ children, title, description, sections }: LegalLayoutProps) => {
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      );
      
      for (const element of sectionElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(element.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const legalPages = [
    { path: '/privacy', title: 'Privacy Policy', icon: <Shield size={16} /> },
    { path: '/terms', title: 'Terms of Service', icon: <FileText size={16} /> },
    { path: '/cookies', title: 'Cookie Policy', icon: <Cookie size={16} /> },
    { path: '/guidelines', title: 'Community Guidelines', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#ffffff', color: '#1a1a1a' }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#ffffff', borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>{title}</h1>
              <p className="text-sm" style={{ color: '#6b7280' }}>{description}</p>
            </div>
            <nav className="hidden md:flex space-x-6">
              {legalPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    location.pathname === page.path 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page.icon}
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>
                  Contents
                </h3>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-gray max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16" style={{ background: '#f9fafb', borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {legalPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  location.pathname === page.path 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {page.icon}
                {page.title}
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e5e5e5' }}>
            <p className="text-sm text-center" style={{ color: '#6b7280' }}>
              © {new Date().getFullYear()} Zankoku. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all hover:scale-110"
          style={{ background: '#3b82f6', color: '#ffffff' }}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t" style={{ borderColor: '#e5e5e5' }}>
        <div className="grid grid-cols-4 gap-1">
          {legalPages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={`flex flex-col items-center gap-1 py-2 text-xs ${
                location.pathname === page.path 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              {page.icon}
              <span className="truncate max-w-full">{page.title.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
