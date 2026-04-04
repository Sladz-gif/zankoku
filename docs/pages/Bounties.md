# Bounties Page (/bounties)

## Overview
Bounty hunting system where players can place bounties on rivals or hunt active bounties for rewards. Features bounty board, active hunts, claim history, and reputation tracking.

## Page Structure

### Header Section
- **Title**: "BOUNTIES" with Target icon
- **Subtitle**: "Hunt targets or place bounties. Justice has a price."
- **User Stats**: Bounties claimed, active bounties, reputation

### Tab Navigation
Four main bounty categories:

#### 1. Active Bounties Tab
**Current available bounties**
- **Icon**: Target/Crosshair
- **Content**: All active bounties
- **Sorting**: By reward amount

#### 2. My Bounties Tab
**Bounties you've placed**
- **Icon**: DollarSign/Coins
- **Content**: Your placed bounties
- **Status**: Active/Claimed/Expired

#### 3. Hunting Tab
**Bounties you're pursuing**
- **Icon**: Scope/Eye
- **Content**: Targets you're hunting
- **Progress**: Hunt progress tracking

#### 4. History Tab
**Completed bounty history**
- **Icon**: Clock/History
- **Content**: Past bounty claims
- **Stats**: Success rate, earnings

## Active Bounties Section

### Bounty Board
**List of all active bounties:**

#### Bounty Card Information
- **Target Username**: Bounty target name
- **Target Avatar**: Profile picture with faction color
- **Bounty Amount**: Reward in Silver/Gold coins
- **Placer**: Who placed the bounty
- **Reason**: Why bounty was placed
- **Difficulty**: Easy/Medium/Hard/Extreme
- **Time Remaining**: Bounty expiration countdown

#### Target Information
- **Rank**: Target's current rank
- **Points**: Target's point total
- **Faction**: Anime faction
- **Win Rate**: Battle win percentage
- **Last Seen**: Recent activity
- **Clan**: Clan membership

#### Bounty Details
- **Reward**: Exact reward amount
- **Requirements**: Conditions to claim
- **Restrictions**: Special rules
- **Deadline**: Expiration date/time
- **Claims**: Number of hunters pursuing

### Bounty Filtering

#### Filter Options
- **By Reward**: Minimum reward amount
- **By Difficulty**: Easy to Extreme
- **By Faction**: Target faction
- **By Rank**: Target rank range
- **By Time**: Expiring soon

#### Sort Options
- **Highest Reward**: Most lucrative first
- **Lowest Difficulty**: Easiest targets
- **Expiring Soon**: Time-sensitive bounties
- **Most Popular**: Most hunted targets
- **Recently Added**: Newest bounties

### Bounty Actions
- **Accept Hunt**: Start hunting target
- **View Profile**: See target's full profile
- **Challenge**: Send duel challenge
- **Report**: Report fraudulent bounty

## Place Bounty Section

### Bounty Creation Form
**Create new bounty on target:**

#### Target Selection
- **Search User**: Search for target username
- **Recent Opponents**: Quick select recent enemies
- **Clan Enemies**: Select from rival clans
- **Validation**: Verify target exists

#### Bounty Configuration
- **Reward Amount**: Set bounty reward
  - Minimum: 100 Silver or 10 Gold
  - Maximum: Based on your balance
  - Currency: Silver or Gold coins

- **Reason**: Explain why bounty placed
  - Character limit: 200 characters
  - Public display: Visible to all
  - Examples: "Betrayed our clan", "Coward declined duel"

- **Duration**: Bounty active period
  - Options: 24h, 3 days, 7 days, 14 days
  - Auto-expire: Returns reward if unclaimed

- **Requirements**: Conditions to claim
  - Defeat in Duel: Standard battle victory
  - Duel to Death: High-stakes battle
  - Clan War: Defeat in clan war
  - Multiple Defeats: Win X times

#### Bounty Cost
- **Reward Amount**: Coins placed in escrow
- **Placement Fee**: 10% platform fee
- **Total Cost**: Reward + fee
- **Confirmation**: Confirm bounty placement

### Bounty Restrictions
- **Cooldown**: 24h between bounties on same target
- **Max Active**: 5 active bounties per user
- **Minimum Rank**: Rank 50+ to place bounties
- **Fair Play**: No bounties on clan members
- **Abuse Prevention**: System monitors for abuse

## My Bounties Section

### Placed Bounties
**Bounties you've created:**

#### Bounty Status
- **Active**: Currently available for hunters
- **In Progress**: Hunter accepted, pursuing
- **Claimed**: Successfully claimed by hunter
- **Expired**: Time ran out, unclaimed
- **Cancelled**: Manually cancelled (fee lost)

#### Bounty Management
- **View Details**: See full bounty information
- **Edit**: Modify reward or duration (before claimed)
- **Cancel**: Cancel active bounty (lose fee)
- **Extend**: Add more time (additional cost)
- **Increase Reward**: Add to reward pool

#### Bounty Notifications
- **Hunter Accepted**: Alert when hunter starts
- **Progress Updates**: Battle result notifications
- **Claim Alert**: Notification when claimed
- **Expiry Warning**: Reminder before expiration

## Hunting Section

### Active Hunts
**Bounties you're pursuing:**

#### Hunt Card
- **Target Info**: Target details and stats
- **Reward**: Potential earnings
- **Progress**: Wins/losses against target
- **Requirements**: Remaining conditions
- **Time Left**: Deadline countdown

#### Hunt Progress Tracking
- **Battles Fought**: Total encounters
- **Wins**: Victories against target
- **Losses**: Defeats by target
- **Win Rate**: Success percentage
- **Closest Call**: Closest match result

#### Hunt Actions
- **Challenge**: Send duel challenge to target
- **Track**: Monitor target activity
- **Abandon**: Give up hunt (no penalty)
- **Claim**: Claim bounty when requirements met

### Claim Process
**Claiming completed bounty:**

#### Claim Requirements
- **Verification**: System verifies conditions met
- **Proof**: Battle result evidence
- **Validation**: Anti-fraud checks
- **Approval**: Automatic or manual approval

#### Claim Rewards
- **Reward Payout**: Instant coin delivery
- **Reputation Gain**: Hunter reputation increase
- **Achievement**: Bounty hunter achievements
- **Leaderboard**: Bounty hunter rankings

## History Section

### Bounty History
**Past bounty activity:**

#### Claimed Bounties
- **Target**: Who was hunted
- **Reward**: Amount earned
- **Date**: When claimed
- **Difficulty**: Bounty difficulty
- **Battles**: Number of attempts

#### Placed Bounties
- **Target**: Who was targeted
- **Outcome**: Claimed/Expired/Cancelled
- **Hunter**: Who claimed (if applicable)
- **Cost**: Total cost paid
- **Duration**: How long it lasted

### Statistics Dashboard
- **Total Bounties Claimed**: Lifetime claims
- **Total Earned**: Total rewards earned
- **Success Rate**: Claim success percentage
- **Average Reward**: Average bounty value
- **Reputation Level**: Hunter reputation tier

## Bounty Hunter Reputation

### Reputation Tiers
**Progressive reputation system:**

1. **Novice Hunter** (0-4 claims)
   - Basic bounty access
   - Standard rewards

2. **Skilled Hunter** (5-14 claims)
   - 5% reward bonus
   - Priority notifications

3. **Expert Hunter** (15-29 claims)
   - 10% reward bonus
   - Exclusive bounties

4. **Master Hunter** (30-49 claims)
   - 15% reward bonus
   - Special hunter badge

5. **Legendary Hunter** (50+ claims)
   - 25% reward bonus
   - Legendary status
   - Custom hunter title

### Reputation Benefits
- **Reward Bonuses**: Extra earnings per claim
- **Priority Access**: See bounties first
- **Exclusive Bounties**: High-value targets
- **Hunter Badge**: Special profile badge
- **Leaderboard**: Top hunter rankings

## Visual Design

### Color Scheme
- **Primary**: Target red (#FF003C)
- **Secondary**: Gold rewards (#FFD700)
- **Success**: Claim green (#00FF88)
- **Warning**: Danger orange (#FF6B35)
- **Neutral**: Hunter gray (#808080)

### Typography
- **Bounty Amounts**: Large, bold numbers
- **Target Names**: font-display, dramatic
- **Details**: font-body, readable
- **Stats**: font-mono, clear numbers

### Animations
- **Bounty Card**: Hover elevation effect
- **Countdown**: Animated timer
- **Claim Success**: Celebration animation
- **New Bounty**: Pulse notification

## Responsive Design

### Desktop Layout
- **Grid Layout**: Multi-column bounty grid
- **Full Details**: All bounty information
- **Hover Effects**: Rich interactive feedback
- **Filters**: Advanced filtering options

### Tablet Layout
- **Two Column**: Balanced grid layout
- **Touch Optimization**: Larger touch targets
- **Simplified Filters**: Streamlined options
- **Readable**: Optimized font sizes

### Mobile Layout
- **Single Column**: Vertical card stacking
- **Compact Cards**: Space-efficient design
- **Swipe Actions**: Gesture navigation
- **Bottom Actions**: Easy thumb access

## Game Integration

### Battle System
- **Duel Challenges**: Direct challenge from bounty
- **Battle Results**: Auto-track bounty progress
- **Win Verification**: Automatic win detection
- **Claim Trigger**: Auto-claim when eligible

### Economy System
- **Escrow**: Bounty rewards held in escrow
- **Payouts**: Instant reward delivery
- **Fees**: Platform fee collection
- **Refunds**: Expired bounty refunds

### Social System
- **Notifications**: Bounty-related alerts
- **Messages**: Bounty challenge messages
- **Feed Posts**: Bounty placement/claim posts
- **Reputation**: Social proof system

## Anti-Abuse Measures

### Fraud Prevention
- **Collusion Detection**: Detect fake bounties
- **Win Trading**: Prevent arranged losses
- **Multiple Accounts**: Block multi-accounting
- **Suspicious Activity**: Flag unusual patterns

### Fair Play Rules
- **No Self-Bounties**: Can't bounty yourself
- **No Clan Bounties**: Can't bounty clanmates
- **Rank Restrictions**: Minimum rank requirements
- **Cooldowns**: Prevent spam bounties
- **Report System**: Community reporting

## Performance Features

### Real-time Updates
- **Live Bounties**: Real-time bounty board
- **Instant Claims**: Immediate claim processing
- **Countdown Timers**: Accurate time tracking
- **Status Updates**: Live status changes

### Optimization
- **Lazy Loading**: Load bounties as needed
- **Caching**: Cache bounty data
- **Pagination**: Paginated bounty lists
- **Efficient Queries**: Optimized database queries
