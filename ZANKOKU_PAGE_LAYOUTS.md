# Zankoku Platform - Complete Page Layouts & Responsiveness Documentation

## 📋 Table of Contents
- [Profile Page](#profile-page)
- [Feed Page](#feed-page)
- [Battle Lobby](#battle-lobby)
- [DotWars Game](#dotwars-game)
- [Clans Page](#clans-page)
- [Store Page](#store-page)
- [Messages Page](#messages-page)
- [Leaderboard Page](#leaderboard-page)
- [Bounties Page](#bounties-page)
- [Notifications Page](#notifications-page)
- [Manga Library](#manga-library)
- [Manga Reader](#manga-reader)
- [Spy Network](#spy-network)
- [Support Page](#support-page)
- [General Responsive Patterns](#general-responsive-patterns)

---

## 📱 Profile Page

### Layout Structure
```
Profile Header (Full Width)
├── Profile Banner with Kanji Watermark
├── User Avatar + Basic Info
└── Points/Alignment/Faction/Rank Display

Main Content (Full Width - No Constraints)
├── Top Section (7:1 Grid - 87.5% Bio, 12.5% Actions)
│   ├── Bio Section (7/8 width) - Editable textarea
│   └── Actions & Stats (1/8 width) - Compact sidebar
├── Middle Section (6:1 Grid - 86% Anime, 14% Battle Stats)
│   ├── Favorite Anime (6/7 width) - 16 cards in 8-column grid
│   └── Battle Statistics (1/7 width) - Compact stats
└── Bottom Section (Full Width)
    └── Discover Users - 18 users in auto-fit grid
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column stacked layout
- **Tablet (640px-1024px)**: 2-column layout with reduced content
- **Desktop (1024px-1280px)**: 6-7 column grids
- **XL Desktop (1280px+)**: 8-9 column grids with maximum content density

### Key Features
- **Zero padding/margins**: Edge-to-edge content utilization
- **Inline styling**: Pure CSS for maximum control
- **Auto-fit grids**: Responsive anime and user discovery sections
- **Dynamic content**: Bio editing, follow/unfollow, interactive elements

---

## 📰 Feed Page

### Layout Structure
```
Feed Container (Full Width)
├── Desktop Composer (Hidden on Mobile)
│   ├── Textarea (500 char limit)
│   └── Character count + Post button
├── Mobile FAB (Fixed bottom-right)
├── Feed Tabs (Full Width)
│   └── For You | Trending | Clan Feed | Following
├── Hashtag Filter (Conditional)
└── Main Content Area
    ├── Posts Column (flex-1)
    │   └── Feed posts with full interactions
    └── Sidebar (320px min-width, Hidden <lg)
        └── Trending Clans
```

### Responsive Breakpoints
- **Mobile (<768px)**: 
  - FAB composer only
  - Full-width posts
  - No sidebar
- **Tablet (768px-1024px)**:
  - Desktop composer visible
  - Posts with sidebar
  - Optimized spacing
- **Desktop (1024px+)**:
  - Full layout with sidebar
  - Maximum content density

### Optimized Spacing
- **Composer**: p-4 mb-4 (reduced from p-5 mb-6)
- **Posts**: space-y-2 (reduced from space-y-3)
- **Hashtag filter**: p-2 mb-3 (reduced from p-3 mb-4)
- **Sidebar**: w-80 p-4 (expanded from w-72 p-6)

### Key Features
- **Real-time interactions**: Like, comment, repost, bookmark
- **Rich media**: Image uploads, mentions, hashtags
- **Advanced filtering**: Tab-based content organization
- **Social features**: Follow, block, user interactions

---

## ⚔️ Battle Lobby

### Layout Structure
```
Lobby Container (Max Width Container)
├── Section Tabs
│   └── Duel | Clan War | Dojo | Dungeon
├── Dynamic Content Area
└── Configuration Panels
    ├── Player Selection
    ├── Grid Size Selection (4×4 to 14×14 TITAN)
    ├── Shape Mode (Square/Triangle)
    ├── Difficulty Settings
    └── Start Game Button
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, stacked controls
- **Tablet (640px-1024px)**: 2-column layout
- **Desktop (1024px+)**: Multi-column grid layout

### Game Modes
- **Duel**: PvP battles with user selection
- **Clan War**: Clan-based conflicts
- **Dojo**: AI training with difficulty levels
- **Dungeon**: Solo challenges

### Key Features
- **Grid sizes**: 4×4 to 14×14 (TITAN mode)
- **AI opponents**: Multiple difficulty levels
- **User filtering**: Block/unblock functionality
- **Game customization**: Shape modes, duel types

---

## 🎮 DotWars Game

### Layout Structure
```
Game Container (Full Viewport)
├── Game Header
│   ├── Player Info Panels (2)
│   ├── Resource Status Bars
│   └── Battle State Indicators
├── Game Board (Dynamic Grid)
│   └── Responsive grid cells
├── Action Panel
│   ├── Technique Selection
│   ├── Resource Management
│   └── Special Abilities
└── Game Controls
    ├── Turn Indicators
    ├── Battle Effects
    └── End Game Options
```

### Responsive Breakpoints
- **Mobile (<640px)**: Compact grid, minimal UI
- **Tablet (640px-1024px)**: Medium grid, enhanced controls
- **Desktop (1024px+)**: Full grid, complete UI

### Game Systems
- **Battle System**: Energy overload, awakening, last stand
- **Sharingan System**: Naruto faction special abilities
- **Forbidden Techniques**: High-risk ultimate moves
- **Visual Effects**: Screen shake, animations, callouts

### Grid Sizes
- **Small**: 4×4, 6×6
- **Medium**: 8×8, 10×10
- **Large**: 12×12
- **TITAN**: 14×14 (special mode)

### Key Features
- **Real-time battles**: Turn-based strategic gameplay
- **Advanced AI**: Multiple difficulty levels
- **Visual effects**: Battle animations and callouts
- **Resource management**: Strategic resource allocation

---

## 🛡️ Clans Page

### Layout Structure
```
Clans Container (Max Width Container)
├── Search & Filter Bar
│   ├── Search Input
│   ├── Alignment Filter
│   ├── Faction Filter
│   └── Join Type Filter
├── Clan Grid/List
│   └── Clan Cards with member counts
└── Clan Detail Modal (Conditional)
    ├── Clan Info
    ├── Member List
    ├── Clan Posts
    └── Management Controls
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column clan cards
- **Tablet (640px-1024px)**: 2-column grid
- **Desktop (1024px+)**: 3-4 column grid

### Clan Features
- **Creation**: Custom clans with tags and mottos
- **Join Types**: Open, approval, invite only
- **Hierarchy**: Leader, officers, members
- **Communication**: Clan posts and announcements

### Filter Options
- **Alignment**: Hero, villain, neutral
- **Faction**: All anime factions
- **Join Type**: Open, approval, invite
- **Sort By**: Members, wins, points, activity

### Key Features
- **Clan management**: Create, join, leave clans
- **Social features**: Clan posts, member interactions
- **Ranking system**: Clan leaderboards
- **Role system**: Leadership hierarchy

---

## 🛒 Store Page

### Layout Structure
```
Store Container (Max Width Container)
├── Tab Navigation
│   └── Resources | Unlimited | Content
├── Resource Packages
│   ├── Faction-specific resources
│   ├── Package tiers (Small to XL)
│   └── Purchase buttons with checkout
├── Unlimited Subscriptions
│   ├── Weekly/Monthly/Season passes
│   ├── Feature comparisons
│   └── Subscription management
└── Content Subscriptions
    ├── Creator content
    ├── Individual pricing
    └── Gold coin purchases
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: 2-column grid
- **Desktop (1024px+)**: 3-column grid with detailed info

### Currency System
- **Real Money**: USD/EUR etc. for coin purchases
- **Gold Coins**: Premium currency for manga/content
- **Silver Coins**: Standard currency for battles/resources

### Package Types
- **Resources**: Chakra, Cursed Energy, Haki, etc.
- **Unlimited**: Weekly, monthly, season passes
- **Content**: Creator subscriptions, manga access

### Key Features
- **Multi-currency**: Three-tier economic system
- **Global payments**: Card + Ghana MoMo support
- **Dynamic pricing**: Tier-based package system
- **Content monetization**: Creator economy integration

---

## 💬 Messages Page

### Layout Structure
```
Messages Container (Full Height)
├── Conversation List (Sidebar)
│   ├── Search bar
│   ├── User conversations
│   ├── Unread indicators
│   └── Last message preview
└── Chat Window (Main Area)
    ├── Chat header with user info
    ├── Message history
    ├── Message input area
    └── Send button
```

### Responsive Breakpoints
- **Mobile (<640px)**: Full-screen chat with back navigation
- **Tablet (640px-1024px)**: Split view with conversation list
- **Desktop (1024px+)**: Full sidebar + chat window

### Message Features
- **Real-time messaging**: Instant message delivery
- **Conversation management**: Multiple chat windows
- **Search functionality**: Find specific conversations
- **User interactions**: Direct messaging from profiles

### Chat Interface
- **Message types**: Text with emoji support
- **User profiles**: Click to view sender profile
- **Timestamps**: Relative time display
- **Read status**: Message read indicators

### Key Features
- **Private messaging**: One-on-one conversations
- **User discovery**: Message from user profiles
- **Conversation history**: Persistent chat storage
- **Mobile optimization**: Touch-friendly interface

---

## 🏆 Leaderboard Page

### Layout Structure
```
Leaderboard Container (Max Width Container)
├── Tab Navigation
│   └── Global | Bounty | Gamblers | Clans | Shame | Country
├── Ranking Display
│   ├── User rankings with points
│   ├── Rank change indicators
│   ├── Faction colors
│   └── Country flags
└── Ranking Details
    ├── Tier information
    ├── Performance metrics
    └── Historical data
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column rankings
- **Tablet (640px-1024px)**: 2-column layout
- **Desktop (1024px+)**: Multi-column with detailed info

### Ranking Categories
- **Global**: Overall player rankings
- **Bounty**: Most bounties claimed
- **Gamblers**: Highest Gold coin holders
- **Clans**: Clan performance rankings
- **Shame**: Coward stars leaderboard
- **Country**: Regional rankings

### Ranking Features
- **Dynamic calculation**: Real-time ranking updates
- **Tier system**: Performance-based tiers
- **Rank tracking**: Position changes over time
- **Visual indicators**: Icons and color coding

### Key Features
- **Comprehensive rankings**: Multiple ranking categories
- **Performance tracking**: Historical rank changes
- **Regional competition**: Country-based leaderboards
- **Social comparison**: User vs friends rankings

---

## 🎯 Bounties Page

### Layout Structure
```
Bounties Container (Max Width Container)
├── Tab Navigation
│   └── Active | Place | My Bounties
├── Active Bounties List
│   ├── Target information
│   ├── Bounty amounts
│   ├── Placer info (or anonymous)
│   └── Claim status
├── Place Bounty Form
│   ├── Target selection
│   ├── Amount setting
│   ├── Anonymous option
│   └── Place button
└── My Bounties
    ├── Placed bounties
    ├── Claim status
    └── Management options
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column bounty cards
- **Tablet (640px-1024px)**: 2-column layout
- **Desktop (1024px+)**: Multi-column with detailed info

### Bounty System
- **Placement**: Gold coin-based bounty system
- **Targets**: User selection with validation
- **Anonymous**: Option for anonymous placement
- **Claims**: Bounty claim tracking

### Bounty Features
- **Active tracking**: Real-time bounty status
- **User interaction**: Direct from user profiles
- **Economic system**: Gold coin transactions
- **Risk/reward**: Strategic bounty placement

### Key Features
- **Bounty economy**: Gold-based system
- **User targeting**: Strategic player selection
- **Anonymous options**: Privacy controls
- **Claim tracking**: Real-time status updates

---

## 🔔 Notifications Page

### Layout Structure
```
Notifications Container (Max Width Container)
├── Header Actions
│   ├── Mark all as read
│   └── Unread count
├── Notification Groups
│   ├── Today
│   ├── Yesterday
│   └── This Week
└── Notification Items
    ├── Icon mapping by type
    ├── User information
    ├── Action links
    └── Timestamp display
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column notifications
- **Tablet (640px-1024px)**: 2-column layout
- **Desktop (1024px+)**: Multi-column with detailed info

### Notification Types
- **Social**: Follows, likes, comments, reposts
- **Battle**: Duel challenges, bounty updates
- **System**: Rank ups, role changes
- **Clan**: War declarations, member updates

### Notification Features
- **Real-time updates**: Instant notification delivery
- **Grouped display**: Time-based organization
- **Action links**: Direct navigation to related content
- **Read management**: Mark as read functionality

### Key Features
- **Comprehensive alerts**: All system notifications
- **Interactive elements**: Click-to-navigate actions
- **Time grouping**: Organized by recency
- **Visual indicators**: Icon and color coding

---

## 📚 Manga Library

### Layout Structure
```
Library Container (Max Width Container)
├── Header
│   ├── Back navigation
│   └── Library title
├── Search & Filters
│   ├── Search input
│   ├── Genre filter
│   └── Tab navigation
├── Featured Series
│   ├── Hero cards
│   ├── Rating displays
│   └── Pricing information
└── Series Grid
    ├── Cover art
    ├── Title/author
    ├── Rating/views
    └── Gold pricing
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, touch-friendly
- **Tablet (640px-1024px)**: 2-3 column grid
- **Desktop (1024px+)**: 4-5 column grid

### Library Features
- **Search functionality**: Real-time title/author search
- **Genre filtering**: Action, romance, fantasy, etc.
- **Tab navigation**: Trending, new, popular, following
- **Gold pricing**: Creator-set content pricing

### Series Information
- **Cover art**: Visual series representation
- **Metadata**: Title, author, rating, views
- **Pricing**: Gold coin costs
- **Progress**: Reading progress indicators

### Key Features
- **Webtoon interface**: Mobile-first design
- **Content discovery**: Advanced search and filtering
- **Creator economy**: Gold-based monetization
- **Social features**: Like, share, comment systems

---

## 📖 Manga Reader

### Layout Structure
```
Reader Container (Full Screen)
├── Reader Header
│   ├── Back navigation
│   ├── Series title
│   └── Settings button
├── Reading Area
│   ├── Page display
│   ├── Navigation controls
│   └── Progress indicator
├── Episode Navigation
│   ├── Previous/Next episode
│   ├── Episode list
│   └── Page controls
└── Comments Sidebar (Toggle)
    ├── Per-episode comments
    ├── User reactions
    └── Reply system
```

### Responsive Breakpoints
- **Mobile (<640px)**: Full-screen reading with swipe controls
- **Tablet (640px-1024px)**: Reading area with sidebar
- **Desktop (1024px+)**: Full interface with comments

### Reading Features
- **Vertical scrolling**: Webtoon-style reading
- **Page navigation**: Previous/next controls
- **Episode management**: Multi-episode series
- **Fullscreen mode**: Immersive reading experience

### Interactive Elements
- **Comments**: Per-episode discussion
- **Reactions**: Like, share functionality
- **Progress tracking**: Reading history
- **Settings**: Reading preferences

### Key Features
- **Webtoon optimization**: Vertical reading format
- **Social engagement**: Comment and reaction systems
- **Progress tracking**: Reading history and bookmarks
- **Mobile optimization**: Touch-friendly controls

---

## 🕵️ Spy Network

### Layout Structure
```
Spy Container (Max Width Container)
├── Header
│   └── Spy Network title
├── Result Display (Conditional)
│   └── Mission success/failure
└── Mission List
    ├── Target clan information
    ├── Mission details
    ├── Risk/reward display
    └── Execute button
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column mission cards
- **Tablet (640px-1024px)**: 2-column layout
- **Desktop (1024px+)**: Multi-column with detailed info

### Spy Features
- **Mission system**: Risk-based intelligence gathering
- **Clan targeting**: Strategic target selection
- **Risk assessment**: Success probability calculation
- **Reward system**: Bronze coin earnings

### Mission Types
- **Infiltration**: Clan intelligence gathering
- **Sabotage**: Disrupt clan operations
- **Espionage**: Steal clan secrets
- **Reconnaissance**: Gather strategic information

### Key Features
- **Strategic gameplay**: Risk vs reward mechanics
- **Clan interaction**: Cross-clan conflict system
- **Economic integration**: Bronze coin rewards
- **Success tracking**: Mission history and statistics

---

## 🆘 Support Page

### Layout Structure
```
Support Container (Max Width Container)
├── Header
│   ├── Search bar
│   └── Support title
├── Category Grid
│   ├── Account Issues
│   ├── Battle System
│   ├── Currency & Payments
│   └── Technical Support
├── Article List
│   ├── Help articles
│   ├── Guides
│   └── FAQ items
└── Contact Form
    ├── Issue description
    ├── Category selection
    └── Submit button
```

### Responsive Breakpoints
- **Mobile (<640px)**: Single column categories
- **Tablet (640px-1024px)**: 2-column grid
- **Desktop (1024px+)**: 3-4 column grid

### Support Categories
- **Account Issues**: Password, recovery, deletion
- **Battle System**: Rules, techniques, ranking
- **Currency**: Payments, refunds, transactions
- **Technical**: Bugs, connection, performance

### Support Features
- **Search functionality**: Find help articles
- **Category browsing**: Organized help content
- **Contact form**: Direct support requests
- **FAQ system**: Common questions answered

### Key Features
- **Comprehensive help**: Full documentation coverage
- **Search optimization**: Quick issue resolution
- **Contact support**: Direct help requests
- **User-friendly**: Easy navigation and discovery

---

## 📐 General Responsive Patterns

### Breakpoint System
```css
/* Mobile First Approach */
Mobile:      < 640px   (single column, touch-first)
Tablet:       640px - 1024px  (2-3 columns, enhanced UI)
Desktop:      1024px - 1280px (multi-column, full features)
XL Desktop:   > 1280px  (maximum density, premium features)
2XL Desktop:  > 1536px  (ultra-wide optimization)
```

### Common UI Patterns
- **Container Sizing**: Max-width containers with responsive padding
- **Grid Systems**: CSS Grid with auto-fit and minmax
- **Typography**: Responsive font sizes (clamp() function)
- **Spacing**: Consistent spacing scale (4px, 8px, 16px, 24px, 32px)
- **Touch Targets**: Minimum 44px touch targets on mobile

### Design System
- **Colors**: CSS custom properties for theme consistency
- **Typography**: System fonts with fallbacks
- **Components**: Reusable UI components
- **Animations**: Hardware-accelerated transitions
- **Accessibility**: ARIA labels, keyboard navigation

### Performance Optimizations
- **Lazy Loading**: Images and components
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Responsive images with WebP
- **Bundle Optimization**: Tree shaking and minification

### Mobile-First Features
- **Touch Gestures**: Swipe, tap, long press
- **Native Integration**: Camera, geolocation, notifications
- **Progressive Web App**: Offline functionality
- **Responsive Images**: Art direction and resolution switching

---

## 🎨 Visual Design System

### Color Palette
```css
/* Primary Colors */
--neon-purple: #8B00FF
--neon-blue: #00C8FF
--neon-green: #00FF88
--neon-red: #FF003C
--neon-orange: #FF6B00
--neon-gold: #FFD700

/* Background Colors */
--bg-primary: #030308
--bg-surface: #080812
--bg-elevated: #1A1A2E

/* Text Colors */
--text-primary: #E8E8FF
--text-secondary: #6666AA
--text-muted: #333355

/* Border Colors */
--border: #1A1A2E
--border-light: #2A2A4E
```

### Typography Scale
```css
/* Font Sizes */
--text-xs: 0.75rem    (12px)
--text-sm: 0.875rem   (14px)
--text-base: 1rem     (16px)
--text-lg: 1.125rem   (18px)
--text-xl: 1.25rem    (20px)
--text-2xl: 1.5rem    (24px)
--text-3xl: 1.875rem  (30px)

/* Font Families */
--font-display: 'Inter', sans-serif
--font-body: 'Inter', sans-serif
```

### Spacing Scale
```css
--space-1: 0.25rem   (4px)
--space-2: 0.5rem    (8px)
--space-3: 0.75rem   (12px)
--space-4: 1rem      (16px)
--space-5: 1.25rem   (20px)
--space-6: 1.5rem    (24px)
--space-8: 2rem      (32px)
```

---

## 🔧 Technical Implementation

### Framework & Libraries
- **React 18**: Component-based architecture
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Lucide React**: Icon system

### State Management
- **React Context**: Global state management
- **Local State**: Component-level state with useState
- **Custom Hooks**: Reusable state logic
- **Optimization**: useMemo and useCallback for performance

### Performance Features
- **Code Splitting**: Lazy loading with React.lazy()
- **Memoization**: Component memoization
- **Virtual Scrolling**: For large lists (future)
- **Image Optimization**: Responsive images and lazy loading

### Accessibility Features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical focus flow
- **Color Contrast**: WCAG AA compliance
- **Semantic HTML**: Proper HTML5 structure

---

## 📱 Mobile Optimization

### Touch Interactions
- **Touch Targets**: Minimum 44px targets
- **Gesture Support**: Swipe, tap, long press
- **Haptic Feedback**: Vibration on interactions
- **Native Feel**: Smooth animations and transitions

### Mobile UI Adaptations
- **Bottom Navigation**: Thumb-friendly navigation
- **Collapsible Menus**: Space-saving interfaces
- **Mobile-First Forms**: Optimized input types
- **Progressive Enhancement**: Core functionality without JS

### Performance on Mobile
- **Bundle Size**: Optimized for mobile networks
- **Loading States**: Skeleton screens and spinners
- **Offline Support**: Service worker implementation
- **Battery Optimization**: Efficient animations and updates

---

## 🌐 Cross-Browser Compatibility

### Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile Safari**: iOS 12+
- **Chrome Mobile**: Android 8+

### Feature Support
- **CSS Grid**: Modern layout system
- **Flexbox**: Flexible box layouts
- **CSS Custom Properties**: Dynamic theming
- **ES6+**: Modern JavaScript features
- **Web APIs**: Modern browser APIs

### Fallbacks
- **CSS Fallbacks**: Graceful degradation
- **Polyfills**: Missing feature support
- **Browser Hacks**: Specific browser fixes
- **Progressive Enhancement**: Core functionality everywhere

---

## 🚀 Future Enhancements

### Planned Features
- **PWA Implementation**: Offline functionality
- **WebSockets**: Real-time updates
- **WebGL**: Advanced visual effects
- **WebAssembly**: Performance-critical computations
- **Service Workers**: Advanced caching strategies

### Scalability Considerations
- **Microservices**: Backend service separation
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query performance
- **Load Balancing**: Traffic distribution
- **Monitoring**: Performance and error tracking

### User Experience Improvements
- **AI Features**: Smart recommendations
- **Personalization**: Customized user experience
- **Social Features**: Enhanced community features
- **Gamification**: Advanced achievement systems
- **Accessibility**: WCAG AAA compliance

---

## 📊 Performance Metrics

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Bundle Size Targets
- **Initial Load**: < 250KB gzipped
- **Route Chunks**: < 100KB each
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: Efficient font loading strategy

### Runtime Performance
- **Frame Rate**: 60fps animations
- **Memory Usage**: < 50MB on mobile
- **CPU Usage**: < 30% on average
- **Network Efficiency**: Minimal API calls

---

*This documentation covers all major pages and their responsive implementations in the Zankoku platform. Each page is designed with mobile-first principles, progressive enhancement, and optimal user experience across all device types.*
