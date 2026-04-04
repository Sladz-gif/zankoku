# Zankoku Page Documentation Index

## Overview
Comprehensive documentation for all pages in the Zankoku platform. Each document includes detailed information about features, buttons, text content, visual design, and user interactions.

## Documentation Structure

### Public Pages (Unauthenticated)
Pages accessible without login:

1. **[Landing.md](./Landing.md)** - `/`
   - Hero section with animated background
   - Three pillars: Battle, Belong, Create
   - How it works (4-step process)
   - Game preview with Dot Wars demonstration
   - 8 anime faction cards
   - Social proof statistics
   - Testimonials from fighters
   - Final CTA and footer
   - **Buttons**: "BEGIN YOUR ARC", "SIGN IN", "WATCH A BATTLE", "SEE ALL FACTIONS"

2. **[SignUp.md](./SignUp.md)** - `/signup`
   - Step 1: Account information (email, username, password, country)
   - Step 2: Alignment selection (Hero, Villain, Wanderer)
   - Step 3: Faction selection (8 anime factions)
   - Completion animation and user creation
   - **Buttons**: "Continue", "Back", "ENTER ZANKOKU"

3. **[SignIn.md](./SignIn.md)** - `/signin`
   - Email/username and password fields
   - Remember me checkbox
   - Forgot password link
   - Authentication animation
   - **Buttons**: "SIGN IN", "Forgot password?", "START YOUR ARC"

### Core Application Pages (Authenticated)

4. **[Dashboard.md](./Dashboard.md)** - `/dashboard`
   - User welcome and quick stats
   - 3x3 grid of feature cards:
     - Quick Match, Clan Wars, Bounties
     - Techniques, Ranking, Profile
     - Social Feed, Manga, Messages
   - **Buttons**: "FIND OPPONENT", "VIEW CLANS", "BOUNTY BOARD", "TECHNIQUE STORE", "LEADERBOARD", "MY PROFILE", "VIEW FEED", "BROWSE MANGA", "INBOX"

5. **[Profile.md](./Profile.md)** - `/profile`
   - Profile banner with avatar and stats
   - 5 tabs: Ranking, Techniques, History, Clan, Create
   - Ranking: Tier progress, performance metrics, benefits
   - Techniques: Owned/locked technique grid
   - History: Battle records and achievements
   - Clan: Membership and activities
   - Create: Manga creation tools
   - **Buttons**: "Edit Profile", "Change Avatar", "Join/Leave Clan", "Purchase Techniques"

6. **[Leaderboard.md](./Leaderboard.md)** - `/leaderboard`
   - 6 category tabs: Global, Bounty Hunters, Gamblers, Clan Wars, By Country, Shame
   - Advanced ranking algorithm with 7-tier system
   - Rank change indicators (↑↓−)
   - Player rows with avatars, stats, tier badges
   - **Buttons**: Tab navigation buttons

### Game Pages

7. **[DotWarsGame.md](./DotWarsGame.md)** - `/game`
   - 6x6 dot grid battle arena
   - Player panels with resources and techniques
   - Advanced battle systems (Awakening, Last Stand, Momentum, etc.)
   - Visual effects and callouts
   - Technique activation cards
   - **Buttons**: Technique activation, "Pass", "Surrender", Settings

### Manga Platform

8. **[MangaLibrary.md](./MangaLibrary.md)** - `/manga`
   - 4 tabs: Trending, New, Popular, Following
   - Search and genre filtering (8 genres)
   - Series cards with cover, rating, price
   - Featured carousel
   - **Buttons**: "READ NOW", Purchase buttons, "Like", "Share", "Bookmark"

9. **[MangaReader.md](./MangaReader.md)** - `/manga/series/:id`
   - Vertical webtoon-style reading
   - Episode navigation and selection
   - Real-time comment system
   - Reader settings and controls
   - **Buttons**: "Previous/Next Episode", "Fullscreen", "Settings", "Share", "Comment"

### Social Features

10. **[Feed.md](./Feed.md)** - `/feed`
    - 4 tabs: Following, Trending, Clan, Global
    - Post types: Battle updates, user posts, clan activities, bounties
    - Like, comment, share functionality
    - Create post modal
    - **Buttons**: "Create Post", "Like", "Comment", "Share", "Post"

11. **[Messages.md](./Messages.md)** - `/messages`
    - Two-panel layout: conversation list + active chat
    - Message types: Text, duel challenges, clan invites, bounties, threats
    - Real-time messaging with typing indicators
    - **Buttons**: "Send", "Accept/Decline" (challenges), "Reply", "Delete"

12. **[Notifications.md](./Notifications.md)** - `/notifications`
    - 5 tabs: All, Battles, Social, Clan, System
    - Notification types: Battles, social, clan, bounties, system
    - Quick actions and bulk operations
    - **Buttons**: "Mark All Read", "Accept/Decline", "View", "Delete", "Archive"

### Team Features

13. **[Clans.md](./Clans.md)** - `/clans`
    - 3 tabs: All Clans, My Clan, Create Clan
    - Clan list with stats and filtering
    - Member management and roles
    - Clan wars system
    - **Buttons**: "Apply to Join", "Create Clan", "Declare War", "Promote/Kick", "Donate"

14. **[Bounties.md](./Bounties.md)** - `/bounties`
    - 4 tabs: Active Bounties, My Bounties, Hunting, History
    - Bounty board with filtering
    - Place bounty form
    - Hunt tracking and claiming
    - **Buttons**: "Accept Hunt", "Place Bounty", "Challenge", "Claim", "Abandon"

### Commerce

15. **[Store.md](./Store.md)** - `/store`
    - 3 tabs: Resources, Unlimited, Content
    - Resource packages ($0.50-$4.00)
    - Subscription plans ($2.50-$20.00)
    - Creator content (Gold pricing)
    - **Buttons**: "BUY NOW", "SUBSCRIBE", "ACCESS"

16. **[Checkout.md](./Checkout.md)** - `/checkout`
    - Dynamic UI: Store purchase vs Spy Network pre-order
    - Global card payments
    - Ghana Mobile Money (MTN, Vodafone, AirtelTigo)
    - Order summary and confirmation
    - **Buttons**: "COMPLETE PURCHASE" / "COMPLETE PRE-ORDER"

## Page Categories

### By User Flow
- **Onboarding**: Landing → SignUp → Dashboard
- **Battle Flow**: Dashboard → Game → Leaderboard → Profile
- **Social Flow**: Feed → Messages → Notifications → Profile
- **Team Flow**: Clans → Bounties → Messages
- **Content Flow**: Manga Library → Manga Reader → Profile (Create)
- **Commerce Flow**: Store → Checkout → Dashboard

### By Feature Type
- **Authentication**: Landing, SignIn, SignUp
- **Core Gameplay**: Dashboard, DotWarsGame, Leaderboard
- **Social**: Feed, Messages, Notifications
- **Teams**: Clans, Bounties
- **Content**: MangaLibrary, MangaReader
- **User Management**: Profile
- **Commerce**: Store, Checkout

## Common Elements Across Pages

### Navigation
- **Sidebar**: Main navigation (authenticated pages)
- **Top Bar**: User info and quick actions
- **Breadcrumbs**: Page hierarchy (where applicable)
- **Back Buttons**: Return to previous page

### Interactive Elements
- **Tabs**: Category switching within pages
- **Filters**: Content filtering options
- **Sort**: Sorting controls
- **Search**: Search functionality
- **Pagination**: Multi-page content

### Visual Design
- **Color Scheme**: Dark theme with neon accents
- **Typography**: font-display (headers), font-body (content)
- **Icons**: Lucide React icon library
- **Animations**: Hover effects, transitions, loading states
- **Responsive**: Mobile, tablet, desktop layouts

### User Feedback
- **Loading States**: Spinners, skeleton screens
- **Success Messages**: Confirmation dialogs
- **Error Messages**: Clear error feedback
- **Notifications**: Real-time alerts
- **Tooltips**: Contextual help

## Button Text Reference

### Primary Actions
- "BEGIN YOUR ARC" - Main signup CTA
- "SIGN IN" - Login action
- "ENTER ZANKOKU" - Complete signup
- "FIND OPPONENT" - Start matchmaking
- "BUY NOW" - Purchase items
- "SUBSCRIBE" - Start subscription
- "COMPLETE PURCHASE" - Finalize payment

### Secondary Actions
- "Continue" - Proceed to next step
- "Back" - Return to previous step
- "Cancel" - Abort action
- "Save" - Save changes
- "Edit" - Modify content
- "Delete" - Remove content

### Social Actions
- "Like" - Like content
- "Comment" - Add comment
- "Share" - Share content
- "Follow" - Follow user
- "Reply" - Reply to message

### Game Actions
- "Accept" - Accept challenge
- "Decline" - Decline challenge
- "Challenge" - Send challenge
- "Claim" - Claim reward
- "Surrender" - Give up

## Text Content Patterns

### Headers
- Page titles: UPPERCASE, bold, dramatic
- Section titles: Title Case, bold
- Subsection titles: Sentence case

### Descriptions
- Feature descriptions: Clear, concise, action-oriented
- Error messages: Specific, helpful, actionable
- Success messages: Positive, confirming

### Labels
- Form labels: UPPERCASE, tracking
- Stat labels: Uppercase, spaced
- Button labels: UPPERCASE, bold

## Documentation Usage

### For Developers
- Reference for implementing features
- Button text and label specifications
- User flow understanding
- Integration requirements

### For Designers
- Visual design specifications
- Color scheme reference
- Typography guidelines
- Animation details

### For Product Managers
- Feature completeness verification
- User experience flows
- Content requirements
- Business logic understanding

### For QA Testing
- Feature verification checklist
- Button and interaction testing
- User flow validation
- Edge case identification

## Last Updated
March 31, 2026
