import { ReactNode } from 'react';
import { AlertCircle, Info, CheckCircle, XCircle, Shield, Users, Cookie, FileText, Zap, Lock, Eye, Mail } from 'lucide-react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const Section = ({ id, title, children, icon }: SectionProps) => (
  <section id={id} className="mb-12 scroll-mt-24">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{title}</h2>
    </div>
    <div className="space-y-4" style={{ color: '#4b5563', lineHeight: 1.7 }}>
      {children}
    </div>
  </section>
);

interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  children: ReactNode;
}

const calloutStyles = {
  info: { bg: '#eff6ff', border: '#3b82f6', icon: Info, color: '#1e40af' },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: AlertCircle, color: '#d97706' },
  success: { bg: '#f0fdf4', border: '#22c55e', icon: CheckCircle, color: '#16a34a' },
  error: { bg: '#fef2f2', border: '#ef4444', icon: XCircle, color: '#dc2626' },
};

export const Callout = ({ type, title, children }: CalloutProps) => {
  const style = calloutStyles[type];
  const Icon = style.icon;

  return (
    <div 
      className="rounded-lg p-4 border-l-4 my-6"
      style={{ 
        background: style.bg, 
        borderColor: style.border,
        borderLeftWidth: '4px'
      }}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} style={{ color: style.color, flexShrink: 0 }} />
        <div>
          <h4 className="font-semibold mb-2" style={{ color: style.color }}>
            {title}
          </h4>
          <div style={{ color: '#4b5563', lineHeight: 1.6 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ListItemProps {
  children: ReactNode;
  icon?: ReactNode;
}

export const ListItem = ({ children, icon }: ListItemProps) => (
  <div className="flex items-start gap-3">
    {icon && <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>}
    <div style={{ color: '#4b5563', lineHeight: 1.6 }}>
      {children}
    </div>
  </div>
);

interface ListProps {
  items: ReactNode[];
  numbered?: boolean;
}

export const List = ({ items, numbered = false }: ListProps) => (
  <div className="space-y-3 my-6">
    {items.map((item, index) => (
      <div key={index} className="flex items-start gap-3">
        {numbered ? (
          <span className="font-semibold text-blue-600" style={{ flexShrink: 0, minWidth: '24px' }}>
            {index + 1}.
          </span>
        ) : (
          <ChevronRight size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '4px' }} />
        )}
        <div style={{ color: '#4b5563', lineHeight: 1.6 }}>
          {item}
        </div>
      </div>
    ))}
  </div>
);

export const ChevronRight = ({ size, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Feature Cards
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-6 rounded-lg border" style={{ background: '#ffffff', borderColor: '#e5e5e5' }}>
    <div className="flex items-center gap-3 mb-3">
      <div style={{ color: '#3b82f6' }}>{icon}</div>
      <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>{title}</h3>
    </div>
    <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{description}</p>
  </div>
);

// Contact Info
interface ContactInfoProps {
  email?: string;
  address?: string;
  phone?: string;
}

export const ContactInfo = ({ email, address, phone }: ContactInfoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
    {email && (
      <div className="flex items-center gap-3">
        <Mail size={20} style={{ color: '#3b82f6' }} />
        <div>
          <div className="font-medium" style={{ color: '#1a1a1a' }}>Email</div>
          <div style={{ color: '#6b7280' }}>{email}</div>
        </div>
      </div>
    )}
    {phone && (
      <div className="flex items-center gap-3">
        <Zap size={20} style={{ color: '#3b82f6' }} />
        <div>
          <div className="font-medium" style={{ color: '#1a1a1a' }}>Phone</div>
          <div style={{ color: '#6b7280' }}>{phone}</div>
        </div>
      </div>
    )}
    {address && (
      <div className="flex items-center gap-3">
        <Users size={20} style={{ color: '#3b82f6' }} />
        <div>
          <div className="font-medium" style={{ color: '#1a1a1a' }}>Address</div>
          <div style={{ color: '#6b7280' }}>{address}</div>
        </div>
      </div>
    )}
  </div>
);

// Data Rights Table
interface DataRightProps {
  title: string;
  description: string;
  howTo: string;
}

export const DataRightsTable = ({ rights }: { rights: DataRightProps[] }) => (
  <div className="overflow-x-auto my-8">
    <table className="w-full border-collapse">
      <thead>
        <tr style={{ background: '#f9fafb' }}>
          <th className="text-left p-4 border" style={{ borderColor: '#e5e5e5', color: '#1a1a1a' }}>Right</th>
          <th className="text-left p-4 border" style={{ borderColor: '#e5e5e5', color: '#1a1a1a' }}>Description</th>
          <th className="text-left p-4 border" style={{ borderColor: '#e5e5e5', color: '#1a1a1a' }}>How to Exercise</th>
        </tr>
      </thead>
      <tbody>
        {rights.map((right, index) => (
          <tr key={index}>
            <td className="p-4 border font-medium" style={{ borderColor: '#e5e5e5', color: '#1a1a1a' }}>
              {right.title}
            </td>
            <td className="p-4 border" style={{ borderColor: '#e5e5e5', color: '#4b5563' }}>
              {right.description}
            </td>
            <td className="p-4 border" style={{ borderColor: '#e5e5e5', color: '#4b5563' }}>
              {right.howTo}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Cookie Categories
interface CookieCategoryProps {
  name: string;
  purpose: string;
  essential?: boolean;
}

export const CookieCategories = ({ categories }: { categories: CookieCategoryProps[] }) => (
  <div className="space-y-4 my-8">
    {categories.map((category, index) => (
      <div key={index} className="p-4 rounded-lg border" style={{ background: '#ffffff', borderColor: '#e5e5e5' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold flex items-center gap-2" style={{ color: '#1a1a1a' }}>
            <Cookie size={16} style={{ color: '#3b82f6' }} />
            {category.name}
            {category.essential && (
              <span className="px-2 py-1 text-xs rounded" style={{ background: '#dcfce7', color: '#16a34a' }}>
                Essential
              </span>
            )}
          </h4>
        </div>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{category.purpose}</p>
      </div>
    ))}
  </div>
);
