# ZANKOKU UI BUILD PLAN

## IMPLEMENTATION STRATEGY

This document tracks the systematic build of all UI screens for Zankoku, wired to the existing GameContext.

---

## PHASE 1: FOUNDATION (IN PROGRESS)

### Shared Components ✅
- [x] FactionBadge - Anime faction display
- [x] RoleTag - Shimmer role tag badge
- [x] AlignmentIcon - Hero/Villain/Wanderer icons
- [x] CoinBalance - Bronze/Silver/Gold coin display
- [x] ResourceBar - Faction-colored resource bar
- [x] TierBadge - Tier progression badge
- [x] ProgressBar - Generic progress indicator
- [x] Modal - Centered overlay dialog
- [x] Toast - Bottom-right notification
- [x] CountdownTimer - Live countdown display

### Remaining Shared Components (NEXT)
- [ ] UserRow - Avatar, username, faction, role, action button
- [ ] FloatingText - Technique floats and quote floats
- [ ] Button - Styled button with variants
- [ ] Input - Form input with validation
- [ ] Select - Dropdown selector
- [ ] Tabs - Tab navigation system

---

## PHASE 2: LAYOUT SHELL

### Components to Build
- [ ] Sidebar - Desktop navigation (240px fixed)
- [ ] TopBar - Mobile header with notifications
- [ ] MobileNav - Bottom glassmorphism navbar
- [ ] PageWrapper - Consistent page structure

---

## PHASE 3: CORE PAGES

### Feed Page
- [ ] PostComposer - Desktop post creation
- [ ] PostCard - Reusable post display
- [ ] CommentThread - Inline expandable comments
- [ ] Feed tabs - For You, Trending, Clan, Following
- [ ] Right sidebar - Trending clans, active bounties, live wars

### Profile Page
- [ ] Profile header - Banner, avatar, stats
- [ ] Reputation section - Coward stars, betrayal history
- [ ] Tab: Ranking - Tier progress and benefits
- [ ] Tab: Techniques - Grid of technique cards
- [ ] Tab: History - Battle history and achievements
- [ ] Tab: Clan - Clan info and management
- [ ] Tab: Create - Manga series creation
- [ ] Tab: Following/Followers - User lists

### Messages Page
- [ ] Conversation list - All active chats
- [ ] Conversation view - Message bubbles
- [ ] Special message cards - Duel, clan invite, threat, alliance
- [ ] Typing indicators - Live typing status
- [ ] Presence system - Online/idle/offline
- [ ] Quick actions - Duel, clan invite, bounty, alliance
- [ ] Psychological warfare - "Seen... no response"

### Notifications Page
- [ ] Notification list - Grouped by time
- [ ] Notification item - Icon, text, timestamp
- [ ] Mark all read button
- [ ] Empty state

---

## PHASE 4: SOCIAL FEATURES

### Clans Page
- [ ] Clan discovery - Search, filter, sort
- [ ] Clan cards - Grid display
- [ ] Clan detail view - Full info, posts, members
- [ ] Reddit-style posts - Upvote/downvote
- [ ] Create clan modal - Full customization
- [ ] Join workflows - Open, approval, invite

### Battle Lobby
- [ ] Duel tab - Challenge system
- [ ] Clan War tab - 10-member selector
- [ ] Dungeon Raid tab - Difficulty tiers
- [ ] Challenge forms - Target, type, message

---

## PHASE 5: GAME ENGINE

### Dot Wars Game
- [ ] Game setup screen - Faction, grid, shape mode
- [ ] Game board - SVG rendering
- [ ] Line click handler - Shape detection
- [ ] Power moves panel - Technique buttons
- [ ] Floating technique text - CSS animations
- [ ] Shape completion effects - Particles, flash
- [ ] Special effects - Steal, destroy, swap
- [ ] Battle quotes - Mood-based drift
- [ ] Game over screen - Victory overlay
- [ ] AI opponent logic - Beginner, Intermediate, Hard

### Dojo
- [ ] Dojo entry - Tutorial, Practice, Master
- [ ] Tutorial - 8-step guided flow
- [ ] Practice match - Difficulty selector
- [ ] Master trial - Unforgiving AI
- [ ] Progress tracking - Step completion

---

## PHASE 6: ECONOMY & CONTENT

### Bounties Page
- [ ] Tab: Active Bounties - Bounty board
- [ ] Tab: My Bounties - Placed bounties
- [ ] Tab: Hunting - Active hunts
- [ ] Tab: History - Past claims
- [ ] Bounty cards - Target info, difficulty, reward
- [ ] Place bounty modal - Full validation
- [ ] Hunter tier display - Badge and reputation

### Store Page
- [ ] Tab: Techniques - Faction-filtered grid
- [ ] Tab: Coins and Resources - Purchase packages
- [ ] Tab: Bundles - Promo cards
- [ ] Purchase flow - Confirmation modal
- [ ] Best value badges - Shimmer animation
- [ ] Insufficient funds - Disabled state

### Manga Library
- [ ] Series grid - Card-based layout
- [ ] Search and filters - Real-time
- [ ] Genre chips - Multiple selection
- [ ] Tabs - Trending, New, Popular, Following
- [ ] Series cards - Cover, title, author, stats
- [ ] Create series button - Upload flow

### Manga Reader
- [ ] Reading area - Vertical scrolling
- [ ] Episode selector - Dropdown
- [ ] Customization panel - Settings
- [ ] Comments sidebar - Threaded
- [ ] Navigation - Previous/next episode
- [ ] Access control - Purchase overlay
- [ ] Creator tip - Gold payment
- [ ] Share modal - URL, QR code

---

## PHASE 7: COMPETITIVE FEATURES

### Leaderboard
- [ ] Category tabs - Overall, Duels, Clans, Bounties, Manga
- [ ] Time filters - Daily, Weekly, Monthly, All-time
- [ ] Ranking list - Top 100
- [ ] Faction filter - Dropdown
- [ ] Search - Find specific user
- [ ] Shame Board - Coward stars ranking
- [ ] By Country - Top per country

### Spectate
- [ ] Live wars list - Ongoing matches
- [ ] War cards - Clans, score, viewers
- [ ] Live war view - Read-only board
- [ ] Commentary feed - Scrolling events
- [ ] Betting panel - Currency tabs, odds
- [ ] Active bet card - Potential payout

### Spy Network
- [ ] Mission list - Available targets
- [ ] Mission cards - Clan, type, difficulty, reward
- [ ] Spy reputation panel - Stats and rank
- [ ] Outcome overlays - Success/caught
- [ ] GHOST tag progress - Achievement tracking

---

## TECHNICAL REQUIREMENTS

### CSS Animations (Add to index.css)
```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes float-up {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; transform: translateY(-15px) scale(1.1); }
  80% { opacity: 1; transform: translateY(-40px); }
  100% { opacity: 0; transform: translateY(-70px); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes legend-pulse {
  0%, 100% { box-shadow: 0 0 12px var(--neon-gold); }
  50% { box-shadow: 0 0 24px var(--neon-gold); }
}

@keyframes urgent-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.shimmer-animation {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.legend-pulse {
  animation: legend-pulse 2s infinite;
}

.urgent-pulse {
  animation: urgent-pulse 1s infinite;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

### Faction Color Map (Use in components)
```typescript
export const FACTION_COLORS: Record<string, { primary: string; glow: string }> = {
  naruto: { primary: '#FF6B00', glow: '#FF9500' },
  jjk: { primary: '#8B00FF', glow: '#BF5FFF' },
  onepiece: { primary: '#00C8FF', glow: '#00E5FF' },
  bleach: { primary: '#00FF88', glow: '#00FFAA' },
  blackclover: { primary: '#FFD700', glow: '#FFEC60' },
  dragonball: { primary: '#FF4400', glow: '#FF7700' },
  demonslayer: { primary: '#FF1744', glow: '#FF6D00' },
  hunterxhunter: { primary: '#76FF03', glow: '#CCFF90' },
  physical: { primary: '#FFFFFF', glow: '#AAAAAA' }
};
```

---

## WIRING CHECKLIST

For each component that calls GameContext:
- [ ] Import useGame hook
- [ ] Destructure needed methods and state
- [ ] Wire all buttons to correct methods
- [ ] Add stub methods if not implemented
- [ ] Show toast on action completion
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Optimistic UI updates where appropriate

---

## CURRENT STATUS

**Phase 1: Foundation** - IN PROGRESS (60% complete)
- Shared components: 10/16 complete
- Next: UserRow, FloatingText, Button, Input, Select, Tabs

**Total Progress: 6%**

---

## NEXT STEPS

1. Complete remaining shared components
2. Build layout shell (Sidebar, TopBar, MobileNav)
3. Build Feed page (most complex social feature)
4. Build Profile page (all 7 tabs)
5. Continue systematically through all pages

**Estimated Total Components: 150+**
**Estimated Total Lines: 15,000+**
