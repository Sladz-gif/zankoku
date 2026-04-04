# Profile Page (/profile)

## Overview
Comprehensive user profile page featuring character information, statistics, techniques, clan details, and manga creation tools. Organized in tabbed interface with rich data visualization.

## Page Structure

### Header Section
- **Profile Banner**: Gradient background with user avatar
- **User Information**: Username, country, alignment, faction
- **Statistics Overview**: Key performance metrics
- **Resource Bar**: Current faction resource display

### Tab Navigation
Five main tabs with dynamic content:

#### 1. Ranking Tab (TrendingUp icon)
**Focus**: Advanced ranking progress and tier information

#### 2. Techniques Tab (Zap icon)  
**Focus**: Owned techniques and technique management

#### 3. History Tab (Clock icon)
**Focus**: Battle history and performance records

#### 4. Clan Tab (Shield icon)
**Focus**: Clan membership and clan activities

#### 5. Create Tab (BookOpen icon)
**Focus**: Manga creation and content management

## Header Components

### Profile Banner
- **Background**: Faction-specific gradient with kanji watermark
- **Avatar**: Large circular avatar with faction color border
- **Bounty Status**: Active bounty indicator with pulsing effect
- **Responsive**: Adapts to different screen sizes

### User Information Display
- **Username**: Large, dramatic font display
- **Country**: Flag emoji and country name
- **Alignment Badge**: Hero/Villain/Wanderer with icon
- **Faction Badge**: Anime faction with color coding
- **Role Tag**: Special role designation (BERSERKER, STRATEGIST, etc.)
- **Rank**: Current rank number with trending icon

### Statistics Grid
Five key performance metrics in responsive grid:

1. **Duels Won**: Total victories count
2. **Duels Lost**: Total defeats count  
3. **Shapes**: Territories captured count
4. **Clan Wars**: Battles participated in
5. **Bounties**: Successful bounty claims

### Reputation Section
- **Coward Stars**: Visual star rating (0-5 stars)
- **Betrayal History**: Previous faction changes
- **Visual Indicators**: Animated stars for cowardice

### Resource Bar
- **Resource Type**: Faction-specific resource (Chakra, Haki, etc.)
- **Current Amount**: Current/max resource display
- **Visual Bar**: Animated progress bar
- **Click Action**: Navigates to resource store

## Tab Content Details

### 1. Ranking Tab
**Advanced ranking progress visualization**

#### Current Tier Display
- **Tier Icon**: Large tier emblem (🥉🥈🥇💎💠👑)
- **Tier Name**: Current rank tier with color coding
- **Points Display**: Current points and rank number
- **Progress Bar**: Visual progress to next tier

#### Performance Metrics Grid
Four key performance indicators:

- **Win Rate**: Percentage with win/loss record
- **Power Score**: Overall strength calculation
- **Shapes Captured**: Territory control metric
- **Clan Wars**: Team battle participation

#### Tier Benefits
- **Current Benefits**: List of unlocked tier benefits
- **Next Tier Preview**: Upcoming tier benefits
- **Progress Indicators**: Visual progress tracking

#### Promotion/Demotion Warnings
- **Promotion Alert**: Green notification when eligible
- **Demotion Warning**: Red alert for performance issues
- **Action Suggestions**: Recommended actions

### 2. Techniques Tab
**Technique collection and management**

#### Technique Grid
3-column responsive grid of owned/available techniques:

- **Owned Techniques**: Fully unlocked with checkmark
- **Locked Techniques**: Grayed out with lock icon
- **Technique Cards**: Detailed technique information

#### Technique Card Details
- **Technique Name**: Bold technique title
- **Description**: Ability description and effects
- **Cost**: Resource cost to use
- **Status**: Owned/Locked indicator
- **Faction Color**: Border color by anime faction

#### Technique Categories
- **Free Technique**: Starting technique (always owned)
- **Purchased Techniques**: Bought from store
- **Locked Techniques**: Available for purchase
- **Exclusive Techniques**: Special/limited techniques

### 3. History Tab
**Battle and activity history**

#### Recent Battles
List of recent battle outcomes with details:
- **Opponent**: Battle opponent username
- **Result**: Win/Loss with color coding
- **Points Gained/Lost**: Point changes
- **Date**: Battle timestamp
- **Technique Used**: Key technique in battle

#### Performance Trends
- **Win Rate Graph**: Visual win rate over time
- **Rank Progression**: Rank change history
- **Point History**: Point accumulation chart
- **Activity Heatmap**: Battle frequency visualization

#### Achievement Records
- **Unlocked Achievements**: Completed achievements
- **Progress Tracking**: In-progress achievement status
- **Milestone Badges**: Special accomplishment indicators

### 4. Clan Tab
**Clan membership and activities**

#### Clan Information (if member)
- **Clan Name**: Current clan with emblem
- **Clan Role**: Member rank/position
- **Clan Stats**: Win/loss record, member count
- **Clan Resources**: Shared resource pool

#### Clan Activities
- **Recent Wars**: Current/past clan wars
- **War Performance**: Individual contribution
- **Clan Chat**: Quick clan communication
- **Upcoming Events**: Scheduled clan activities

#### Clan Management (if leader)
- **Member Management**: Invite/kick members
- **War Declarations**: Start clan wars
- **Resource Distribution**: Manage clan resources
- **Clan Settings**: Configure clan options

#### No Clan State
- **Join Clan**: Browse and join existing clans
- **Create Clan**: Start new clan creation
- **Clan Benefits**: Advantages of clan membership

### 5. Create Tab
**Manga creation and content management**

#### Series Creation Form
- **Title Input**: Manga series title
- **Description**: Series synopsis and story
- **Genre Selection**: Category selection
- **Cover Upload**: Drag-and-drop cover image
- **Pricing**: Set Gold price for access

#### Chapter Management
- **Episode List**: Created episodes/chapters
- **Page Upload**: Grid-based page upload system
- **Chapter Settings**: Episode titles and descriptions
- **Publishing Tools**: Draft/publish controls

#### Content Statistics
- **Views**: Total read count
- **Revenue**: Gold earned from sales
- **Ratings**: User ratings and reviews
- **Comments**: Reader engagement metrics

#### Creation Tools
- **Image Editor**: Basic image editing tools
- **Text Tools**: Add text to pages
- **Layout Options**: Page layout templates
- **Preview Mode**: Preview manga before publishing

## Interactive Features

### Tab Switching
- **Smooth Transitions**: Animated tab content changes
- **Active State**: Purple underline for active tab
- **URL Integration**: Tab state in URL parameters
- **Mobile Optimized**: Touch-friendly tab navigation

### Data Updates
- **Real-time Updates**: Live statistics from game context
- **Auto-refresh**: Periodic data synchronization
- **Change Indicators**: Visual notifications for updates
- **Performance Metrics**: Calculated in real-time

### User Actions
- **Edit Profile**: Modify profile information
- **Change Avatar**: Update profile picture
- **Join/Leave Clan**: Clan membership actions
- **Purchase Techniques**: Direct technique buying

## Visual Design

### Color Scheme
- **Primary**: User's faction color
- **Secondary**: Purple accent for interactive elements
- **Success**: Green for positive indicators
- **Warning**: Orange for caution states
- **Error**: Red for negative indicators

### Typography
- **Headers**: font-display, bold, dramatic
- **Body**: font-body, clean and readable
- **Data**: font-mono for statistics
- **Labels**: Uppercase with tracking

### Animations
- **Tab Transitions**: Smooth fade and slide effects
- **Data Updates**: Subtle number animations
- **Hover Effects**: Interactive element feedback
- **Loading States**: Skeleton loading indicators

## Responsive Design

### Desktop Layout
- **Multi-column**: Optimized desktop grid layouts
- **Full Features**: All hover states and animations
- **Large Screens**: Maximum content utilization
- **Keyboard Support**: Full keyboard navigation

### Tablet Layout
- **Adaptive Grids**: 2-column layouts where appropriate
- **Touch Optimization**: Larger touch targets
- **Simplified Animations**: Performance-optimized
- **Readable Text**: Optimized font sizes

### Mobile Layout
- **Single Column**: Stacked vertical layout
- **Compact Design**: Space-efficient information display
- **Touch Scrolling**: Smooth mobile scrolling
- **Essential Info**: Prioritized content display

## Data Integration

### Game Context Integration
- **User Data**: Direct connection to game state
- **Real-time Updates**: Live synchronization
- **Statistics Calculation**: Dynamic metric computation
- **Achievement Tracking**: Progress monitoring

### External Services
- **Image Upload**: Cloud storage integration
- **Content Delivery**: CDN for manga pages
- **Analytics**: User behavior tracking
- **Notifications**: Real-time update notifications

## Performance Features

### Optimization Techniques
- **Lazy Loading**: Content loads as needed
- **Memoization**: Prevents unnecessary recalculations
- **Virtual Scrolling**: For large data sets
- **Image Optimization**: Compressed images with lazy loading

### Caching Strategy
- **Profile Data**: Cached user information
- **Statistics**: Cached calculation results
- **Images**: Browser and CDN caching
- **API Responses**: Response caching where appropriate

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical navigation through all elements
- **Focus Management**: Visible focus indicators
- **Skip Links**: Quick navigation to main content
- **ARIA Labels**: Descriptive labels for screen readers

### Visual Accessibility
- **High Contrast**: Clear visual hierarchy
- **Color Independence**: Information not solely color-based
- **Text Scaling**: Respects browser text size settings
- **Motion Control**: Respects prefers-reduced-motion

## Security Features

### Data Protection
- **Input Validation**: Sanitized user inputs
- **XSS Prevention**: Secure content rendering
- **CSRF Protection**: Secure form submissions
- **Authentication**: Verified user sessions

### Privacy Controls
- **Profile Visibility**: Control over public information
- **Data Management**: User data export/deletion
- **Content Moderation**: Content review tools
- **Reporting System**: Report inappropriate content
