# Feed Page (/feed)

## Overview
Social media-style feed featuring user posts, battle updates, clan activities, and community interactions. Real-time content stream with engagement features and content creation tools.

## Page Structure

### Header Section
- **Title**: "FEED" with MessageCircle icon
- **Subtitle**: "See what fighters are saying"
- **Create Post Button**: Quick post creation access

### Feed Filters
Tab-based content filtering:

#### 1. Following Tab
**Content from followed users**
- **Icon**: Users/Heart
- **Content**: Posts from followed fighters
- **Sorting**: Chronological order

#### 2. Trending Tab
**Popular and viral content**
- **Icon**: TrendingUp/Fire
- **Content**: Most engaged posts
- **Sorting**: By engagement metrics

#### 3. Clan Tab
**Clan-specific updates**
- **Icon**: Shield
- **Content**: Clan member posts and activities
- **Sorting**: Clan relevance

#### 4. Global Tab
**All platform content**
- **Icon**: Globe
- **Content**: All public posts
- **Sorting**: Recent first

## Post Types

### Battle Updates
**Automatic battle result posts:**

#### Victory Posts
- **Header**: "Victory in Dot Wars!"
- **Details**: Opponent, score, techniques used
- **Stats**: Points gained, shapes captured
- **Visual**: Victory badge and highlights

#### Defeat Posts
- **Header**: "Defeated in battle"
- **Details**: Opponent, score, lessons learned
- **Stats**: Points lost, performance metrics
- **Visual**: Defeat indicator

#### Epic Battle Posts
- **Header**: "LEGENDARY BATTLE!"
- **Details**: Close match highlights
- **Replay**: Battle replay link
- **Visual**: Epic battle effects

### User-Created Posts
**Manual content creation:**

#### Text Posts
- **Content**: Up to 500 characters
- **Formatting**: Basic text formatting
- **Mentions**: @username mentions
- **Hashtags**: #tag support

#### Image Posts
- **Images**: Up to 4 images per post
- **Captions**: Image descriptions
- **Filters**: Basic image filters
- **Gallery**: Swipeable image gallery

#### Achievement Posts
- **Achievements**: Unlocked achievements
- **Progress**: Milestone celebrations
- **Stats**: Achievement statistics
- **Visual**: Achievement badges

### Clan Activity Posts
**Automated clan updates:**

#### War Declarations
- **Content**: "Clan declared war on [opponent]"
- **Details**: War stakes and schedule
- **Participants**: War roster
- **Call to Action**: Join war button

#### War Results
- **Content**: "Clan victory/defeat in war"
- **Details**: Final score and MVP
- **Rewards**: War rewards distributed
- **Highlights**: Best moments

#### Member Joins
- **Content**: "New member joined clan"
- **Welcome**: Clan welcome message
- **Member Info**: New member details
- **Engagement**: Welcome comments

### Bounty Posts
**Bounty-related content:**

#### Bounty Placed
- **Content**: "Bounty placed on [target]"
- **Amount**: Bounty reward
- **Reason**: Bounty justification
- **Status**: Active bounty indicator

#### Bounty Claimed
- **Content**: "Bounty claimed!"
- **Hunter**: Bounty hunter username
- **Target**: Bounty target
- **Reward**: Bounty payout

## Post Components

### Post Header
**User information and metadata:**

#### User Identity
- **Avatar**: Circular profile picture
- **Username**: Clickable username
- **Faction Badge**: Anime faction indicator
- **Role Tag**: Special role (BERSERKER, etc.)
- **Timestamp**: Post creation time

#### Post Actions Menu
- **Edit**: Edit own posts
- **Delete**: Remove own posts
- **Report**: Report inappropriate content
- **Pin**: Pin important posts (clan leaders)

### Post Content
**Main post body:**

#### Text Content
- **Body Text**: Main post content
- **Mentions**: Highlighted @mentions
- **Hashtags**: Clickable hashtags
- **Links**: Clickable URLs
- **Formatting**: Bold, italic, code blocks

#### Media Content
- **Images**: Embedded images
- **Videos**: Video embeds (future)
- **GIFs**: Animated GIF support
- **Embeds**: Rich link previews

### Post Engagement

#### Interaction Buttons
- **Like**: Heart icon with count
- **Comment**: Comment icon with count
- **Share**: Share icon with count
- **Bookmark**: Save for later

#### Engagement Stats
- **Like Count**: Total likes
- **Comment Count**: Total comments
- **Share Count**: Total shares
- **View Count**: Total views

### Comment Section
**Threaded comment system:**

#### Comment Display
- **User Avatar**: Commenter profile picture
- **Username**: Commenter name
- **Comment Text**: Comment content
- **Timestamp**: Comment time
- **Like Count**: Comment likes

#### Comment Actions
- **Reply**: Reply to comment
- **Like**: Like comment
- **Report**: Report comment
- **Delete**: Delete own comment

#### Comment Features
- **Threading**: Nested replies
- **Mentions**: @mention in comments
- **Reactions**: Emoji reactions
- **Load More**: Paginated comments

## Content Creation

### Create Post Modal
**Post creation interface:**

#### Post Composer
- **Text Area**: Multi-line text input
- **Character Count**: 500 character limit
- **Placeholder**: "What's on your mind, fighter?"
- **Auto-save**: Draft auto-saving

#### Media Upload
- **Image Upload**: Drag-and-drop or browse
- **Multiple Images**: Up to 4 images
- **Image Preview**: Preview before posting
- **Remove Images**: Delete uploaded images

#### Post Options
- **Visibility**: Public/Clan-only/Private
- **Mentions**: Tag other users
- **Hashtags**: Add trending hashtags
- **Location**: Add location tag (optional)

#### Post Actions
- **Post Button**: Publish post
- **Save Draft**: Save for later
- **Cancel**: Discard post
- **Preview**: Preview before posting

## Feed Features

### Infinite Scroll
- **Auto-load**: Automatic content loading
- **Smooth Scrolling**: Optimized scroll performance
- **Load Indicator**: Loading spinner
- **End Indicator**: "You're all caught up"

### Real-time Updates
- **Live Updates**: New posts appear automatically
- **Notification Badge**: New content indicator
- **Refresh Button**: Manual refresh option
- **Auto-refresh**: Periodic content updates

### Content Filtering
- **Hide Posts**: Hide specific posts
- **Mute Users**: Mute specific users
- **Block Users**: Block users completely
- **Report Content**: Report violations

## Visual Design

### Color Scheme
- **Primary**: Purple accent (#8B00FF)
- **Secondary**: Blue highlights (#00C8FF)
- **Success**: Green for victories (#00FF88)
- **Warning**: Orange for alerts (#FF6B35)
- **Danger**: Red for defeats (#FF003C)

### Typography
- **Usernames**: font-display, bold
- **Post Content**: font-body, readable
- **Timestamps**: Small, muted text
- **Engagement**: font-mono for counts

### Animations
- **Post Entry**: Fade-in animation
- **Like Animation**: Heart pop effect
- **Comment Expand**: Smooth expansion
- **Image Gallery**: Swipe transitions

## Responsive Design

### Desktop Layout
- **Center Feed**: Fixed-width content column
- **Side Panels**: Trending and suggestions
- **Full Features**: All interaction options
- **Hover States**: Rich hover effects

### Tablet Layout
- **Adaptive Width**: Responsive content width
- **Simplified Panels**: Collapsible sidebars
- **Touch Optimization**: Larger touch targets
- **Readable Text**: Optimized font sizes

### Mobile Layout
- **Full Width**: Edge-to-edge content
- **Bottom Navigation**: Easy thumb access
- **Swipe Gestures**: Gesture navigation
- **Compact Design**: Space-efficient layout

## Social Features

### Following System
- **Follow Users**: Follow other fighters
- **Follower Count**: Display follower count
- **Following Count**: Display following count
- **Mutual Follows**: Friend indicators

### Trending System
- **Trending Posts**: Popular content
- **Trending Hashtags**: Popular tags
- **Trending Users**: Popular fighters
- **Trending Topics**: Hot discussions

### Notification Integration
- **Like Notifications**: Post like alerts
- **Comment Notifications**: New comment alerts
- **Mention Notifications**: @mention alerts
- **Follow Notifications**: New follower alerts

## Content Moderation

### Automated Moderation
- **Profanity Filter**: Automatic filtering
- **Spam Detection**: Spam post detection
- **Link Scanning**: Malicious link detection
- **Image Scanning**: Inappropriate image detection

### User Reporting
- **Report Post**: Report inappropriate posts
- **Report User**: Report user violations
- **Report Reasons**: Categorized report types
- **Moderation Queue**: Admin review system

### Community Guidelines
- **No Harassment**: Anti-harassment policy
- **No Spam**: Anti-spam rules
- **No Hate Speech**: Hate speech prohibition
- **Respect Others**: General conduct rules

## Performance Features

### Loading Optimization
- **Lazy Loading**: Images load as needed
- **Virtual Scrolling**: Efficient scroll rendering
- **Image Compression**: Optimized images
- **Code Splitting**: Separate feed bundle

### Caching Strategy
- **Feed Cache**: Cached feed content
- **Image Cache**: Browser image caching
- **Offline Support**: Basic offline viewing
- **Background Sync**: Sync when online

## Integration Features

### Game Integration
- **Battle Results**: Auto-post battle results
- **Achievements**: Auto-post achievements
- **Clan Events**: Auto-post clan activities
- **Rank Changes**: Auto-post rank updates

### External Sharing
- **Social Media**: Share to external platforms
- **Copy Link**: Copy post link
- **Embed Code**: Embed posts externally
- **Screenshot**: Share as image

## Analytics Features

### User Analytics
- **Post Performance**: View post statistics
- **Engagement Metrics**: Like, comment, share data
- **Follower Growth**: Follower trend analysis
- **Best Times**: Optimal posting times

### Content Insights
- **Popular Content**: Best performing posts
- **Trending Topics**: Hot discussion topics
- **User Behavior**: Engagement patterns
- **Content Types**: Most engaging formats
