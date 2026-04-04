# Dashboard Page (/dashboard)

## Overview
Main dashboard page that serves as the central hub for Zankoku users. Features a grid layout of main features, user stats overview, and quick access to all major platform functions.

## Layout Structure
Responsive grid layout with feature cards organized by category:
- **Header**: User welcome and quick stats
- **Main Grid**: 3x3 grid of feature cards
- **Responsive**: Adapts from 3-column on desktop to single column on mobile

## Header Section

### User Welcome
- **Greeting**: "Welcome back, [username]"
- **Subtitle**: "Your rank: #[rank] • [points] points"
- **Faction Badge**: Shows current anime faction with color coding

### Quick Stats Bar
Horizontal stats display with icons:
- **Duels Won**: Trophy icon with count
- **Win Rate**: Percentage with trend indicator
- **Clan**: Clan name or "No Clan"
- **Bounty**: Status indicator if active bounty

## Feature Cards Grid

### Battle Section (Top Row)

#### 1. Quick Match
- **Icon**: Swords (purple glow)
- **Title**: "QUICK MATCH"
- **Description**: "Jump into a random duel. Rank points on the line."
- **Button**: "FIND OPPONENT" (purple gradient)
- **Features**: 
  - Matchmaking based on rank
  - Random opponent selection
  - Immediate battle start

#### 2. Clan Wars
- **Icon**: Shield (blue glow)
- **Title**: "CLAN WARS"
- **Description**: "Lead your clan to victory. Team battles matter."
- **Button**: "VIEW CLANS" (blue gradient)
- **Features**:
  - Clan statistics
  - War declarations
  - Team coordination

#### 3. Bounties
- **Icon**: Target (red glow)
- **Title**: "BOUNTIES"
- **Description**: "Hunt targets or place bounties. Justice has a price."
- **Button**: "BOUNTY BOARD" (red gradient)
- **Features**:
  - Active bounty list
  - Place new bounties
  - Claim rewards

### Progress Section (Middle Row)

#### 4. Techniques
- **Icon**: Zap (orange glow)
- **Title**: "TECHNIQUES"
- **Description**: "Master your faction's abilities. Buy new techniques."
- **Button**: "TECHNIQUE STORE" (orange gradient)
- **Features**:
  - Available techniques
  - Purchase options
  - Technique mastery

#### 5. Ranking
- **Icon**: Crown (gold glow)
- **Title**: "RANKING"
- **Description**: "Climb the leaderboard. Show your dominance."
- **Button**: "LEADERBOARD" (gold gradient)
- **Features**:
  - Global rankings
  - Faction rankings
  - Rank progress

#### 6. Profile
- **Icon**: User (green glow)
- **Title**: "PROFILE"
- **Description**: "Customize your fighter. Track your progress."
- **Button**: "MY PROFILE" (green gradient)
- **Features**:
  - Character customization
  - Statistics tracking
  - Achievement display

### Community Section (Bottom Row)

#### 7. Social Feed
- **Icon**: MessageCircle (cyan glow)
- **Title**: "SOCIAL FEED"
- **Description**: "See what fighters are saying. Post updates."
- **Button**: "VIEW FEED" (cyan gradient)
- **Features**:
  - Community posts
  - User interactions
  - Trending topics

#### 8. Manga Library
- **Icon**: BookOpen (magenta glow)
- **Title**: "MANGA"
- **Description**: "Read and create manga. Build your following."
- **Button**: "BROWSE MANGA" (magenta gradient)
- **Features**:
  - Manga library
  - Creator tools
  - Reading progress

#### 9. Messages
- **Icon**: Mail (yellow glow)
- **Title**: "MESSAGES"
- **Description**: "Duel challenges, clan invites, and threats."
- **Button**: "INBOX" (yellow gradient)
- **Features**:
  - Private messages
  - Duel challenges
  - Clan communications

## Card Interactions

### Hover Effects
- **Elevation**: Cards lift up with shadow
- **Border Glow**: Faction-colored border illumination
- **Icon Animation**: Icons scale and brighten
- **Button Brightness**: Call-to-action buttons brighten

### Active States
- **Pressed**: Scale down animation
- **Focus**: Visible focus outline
- **Loading**: Button loading state with spinner

## Visual Design

### Color Scheme
- **Background**: Dark gradient with subtle patterns
- **Cards**: Elevated surfaces with colored borders
- **Icons**: Faction-specific glow effects
- **Text**: High contrast for readability

### Typography
- **Titles**: font-display, bold, uppercase
- **Descriptions**: font-body, regular size
- **Buttons**: font-display, tracking, uppercase

### Animations
- **Card Entry**: Staggered fade-in animation
- **Hover Transitions**: Smooth 0.2s transitions
- **Button Press**: Scale and brightness effects
- **Icon Pulses**: Subtle pulsing for important cards

## Responsive Behavior

### Desktop (≥1024px)
- **Grid**: 3x3 layout with equal spacing
- **Card Size**: Fixed dimensions for consistency
- **Hover States**: Full hover effects enabled
- **Typography**: Larger text sizes

### Tablet (768px - 1023px)
- **Grid**: 2x2 with additional row
- **Card Size**: Slightly smaller
- **Touch Targets**: Larger for touch interaction
- **Spacing**: Optimized for tablet viewing

### Mobile (<768px)
- **Grid**: Single column layout
- **Card Size**: Full width with padding
- **Text Size**: Optimized for mobile
- **Buttons**: Larger touch targets

## Navigation Integration

### Quick Actions
- **Direct Navigation**: Each button navigates to specific page
- **Deep Links**: Some cards link to specific sections
- **Context**: Maintains user context across navigation

### Page Transitions
- **Smooth Routing**: React Router transitions
- **Loading States**: Loading indicators during navigation
- **Back Navigation**: Browser back button support

## User Personalization

### Dynamic Content
- **User Stats**: Real-time statistics display
- **Faction Colors**: Cards colored by user's faction
- **Progress Indicators**: Visual progress bars where relevant
- **Recommendations**: Personalized content suggestions

### State Management
- **User Context**: Integrated with GameContext
- **Real-time Updates**: Stats update from game actions
- **Session Persistence**: Maintains state across sessions
- **Cache Optimization**: Efficient data loading

## Performance Features

### Lazy Loading
- **Card Content**: Loads content as needed
- **Images**: Optimized image loading
- **Animations**: Hardware-accelerated CSS
- **Data Fetching**: Efficient API calls

### Optimization
- **Component Memoization**: Prevents unnecessary re-renders
- **Virtualization**: For large lists (if applicable)
- **Code Splitting**: Loads components on demand
- **Bundle Optimization**: Minimized JavaScript bundles

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical navigation through cards
- **Enter Key**: Activates card buttons
- **Focus Management**: Visible focus indicators
- **Skip Links**: Quick navigation options

### Screen Reader Support
- **Semantic HTML**: Proper heading structure
- **ARIA Labels**: Descriptive labels for interactive elements
- **Role Attributes**: Correct landmark roles
- **Alt Text**: Descriptive text for icons

### Visual Accessibility
- **High Contrast**: Clear text/background contrast
- **Color Independence**: Information not color-dependent
- **Text Scaling**: Respects browser text size settings
- **Motion Reduction**: Respects prefers-reduced-motion

## Integration Points

### Game Systems
- **Battle System**: Direct integration with Quick Match
- **Ranking System**: Real-time rank updates
- **Clan System**: Clan statistics and management
- **Economy System**: Currency and purchases

### Social Features
- **Feed Integration**: Social feed connectivity
- **Messaging**: Direct message access
- **Profile System**: User profile management
- **Community**: Community engagement features

### Content Systems
- **Manga Platform**: Direct manga library access
- **Creator Tools**: Content creation integration
- **Store System**: Technique and resource purchasing
- **Notification System**: Real-time updates
