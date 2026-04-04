# Messages Page (/messages)

## Overview
Private messaging system for direct communication between fighters. Features duel challenges, clan invites, threats, alliances, and general communication with real-time updates.

## Page Structure

### Layout
**Two-panel messaging interface:**

#### Left Panel - Conversation List
- **Width**: 30-40% of screen
- **Content**: List of all conversations
- **Sorting**: Recent messages first
- **Search**: Search conversations

#### Right Panel - Active Conversation
- **Width**: 60-70% of screen
- **Content**: Selected conversation messages
- **Input**: Message composition area
- **Actions**: Conversation actions

## Conversation List

### Conversation Card
**Individual conversation preview:**

#### User Information
- **Avatar**: Circular profile picture with faction color
- **Username**: Conversation partner name
- **Faction Badge**: Anime faction indicator
- **Online Status**: Green dot for online users

#### Message Preview
- **Last Message**: Preview of most recent message
- **Timestamp**: Relative time (e.g., "2h ago")
- **Unread Badge**: Red badge with unread count
- **Message Type**: Icon for special messages (duel, invite, etc.)

#### Conversation Status
- **Unread Indicator**: Bold text for unread
- **Typing Indicator**: "typing..." animation
- **Pinned**: Pin important conversations
- **Archived**: Archive old conversations

### Conversation Filtering

#### Filter Tabs
- **All Messages**: All conversations
- **Unread**: Unread messages only
- **Duel Challenges**: Battle-related messages
- **Clan Invites**: Clan invitation messages
- **Archived**: Archived conversations

#### Search Functionality
- **Search Bar**: Search by username or content
- **Real-time Search**: Instant results
- **Highlight**: Highlight search terms
- **Clear**: Quick search clearing

## Message Thread

### Message Display
**Chronological message history:**

#### Message Bubble
- **Sent Messages**: Right-aligned, purple theme
- **Received Messages**: Left-aligned, dark theme
- **Timestamp**: Message time on hover
- **Read Status**: Double checkmark when read

#### Message Types

##### Text Messages
- **Content**: Plain text messages
- **Formatting**: Basic text formatting
- **Links**: Clickable URLs
- **Mentions**: @username highlighting

##### Duel Challenge Messages
- **Header**: "DUEL CHALLENGE" badge
- **Details**: Challenge type and stakes
- **Actions**: Accept/Decline buttons
- **Expiry**: Challenge expiration time

##### Clan Invite Messages
- **Header**: "CLAN INVITE" badge
- **Clan Info**: Clan name and details
- **Actions**: Accept/Decline buttons
- **Expiry**: Invite expiration time

##### Bounty Messages
- **Header**: "BOUNTY PLACED" badge
- **Amount**: Bounty reward amount
- **Reason**: Bounty justification
- **Status**: Active/Claimed indicator

##### Alliance Proposals
- **Header**: "ALLIANCE PROPOSAL" badge
- **Terms**: Alliance terms and conditions
- **Actions**: Accept/Decline/Negotiate buttons
- **Duration**: Alliance duration

##### Threat Messages
- **Header**: "THREAT" badge with skull icon
- **Content**: Threatening message
- **Warning**: System warning about threats
- **Report**: Quick report option

### Message Composition

#### Input Area
- **Text Field**: Multi-line message input
- **Placeholder**: "Send a message..."
- **Character Limit**: 1000 characters
- **Auto-resize**: Expands with content

#### Composition Tools
- **Emoji Picker**: Emoji selection menu
- **Mention**: @username autocomplete
- **Formatting**: Bold, italic, code
- **Attachments**: Image attachments (future)

#### Send Options
- **Send Button**: Primary send action
- **Keyboard Shortcut**: Enter to send, Shift+Enter for new line
- **Draft Save**: Auto-save drafts
- **Send on Enter**: Toggle setting

## Special Message Types

### Duel Challenge
**Formal battle challenge system:**

#### Challenge Creation
- **Challenge Type**: Ranked/Friendly/Death Duel
- **Stakes**: Points or resources wagered
- **Time Limit**: Challenge acceptance deadline
- **Message**: Optional challenge message

#### Challenge Display
- **Challenge Card**: Formatted challenge display
- **Challenger Info**: Challenger stats and rank
- **Stakes Display**: Clear stake information
- **Accept Button**: Green "ACCEPT DUEL" button
- **Decline Button**: Red "DECLINE" button

#### Challenge Response
- **Accept**: Navigate to battle setup
- **Decline**: Send decline notification
- **Counter**: Propose different terms
- **Ignore**: Challenge expires after 24h

### Clan Invitation
**Clan recruitment messages:**

#### Invitation Details
- **Clan Name**: Inviting clan name
- **Clan Stats**: Win/loss record, members
- **Inviter**: Clan member sending invite
- **Message**: Personal invitation message

#### Invitation Actions
- **Accept**: Join clan immediately
- **Decline**: Politely decline
- **View Clan**: See full clan details
- **Ask Questions**: Reply with questions

### Bounty Notification
**Bounty-related alerts:**

#### Bounty Placed
- **Target**: You or someone else
- **Amount**: Bounty reward
- **Placer**: Who placed bounty
- **Reason**: Why bounty was placed

#### Bounty Claimed
- **Hunter**: Who claimed bounty
- **Target**: Bounty target
- **Reward**: Payout amount
- **Proof**: Battle result link

## Real-time Features

### Live Updates
- **New Messages**: Instant message delivery
- **Typing Indicators**: See when user is typing
- **Read Receipts**: See when messages are read
- **Online Status**: Real-time online/offline status

### Notifications
- **Desktop Notifications**: Browser notifications
- **Sound Alerts**: Optional message sounds
- **Badge Count**: Unread message count
- **Push Notifications**: Mobile push alerts

### Presence System
- **Online**: Green indicator
- **Away**: Yellow indicator
- **Offline**: Gray indicator
- **Last Seen**: "Last seen 5m ago"

## Conversation Actions

### Message Actions
- **Reply**: Reply to specific message
- **Forward**: Forward to another user
- **Copy**: Copy message text
- **Delete**: Delete message (both sides option)
- **Report**: Report inappropriate message

### Conversation Actions
- **Pin**: Pin important conversations
- **Mute**: Mute notifications
- **Archive**: Archive conversation
- **Block**: Block user
- **Delete**: Delete entire conversation

## Visual Design

### Color Scheme
- **Sent Messages**: Purple gradient (#8B00FF)
- **Received Messages**: Dark gray (#1A1A2E)
- **Duel Challenges**: Red accent (#FF003C)
- **Clan Invites**: Blue accent (#00C8FF)
- **Threats**: Dark red (#8B0000)

### Typography
- **Usernames**: font-display, bold
- **Messages**: font-body, readable
- **Timestamps**: Small, muted text
- **Badges**: Uppercase, tracking

### Animations
- **Message Send**: Slide-in animation
- **Typing Indicator**: Pulsing dots
- **New Message**: Fade-in effect
- **Scroll**: Smooth auto-scroll

## Responsive Design

### Desktop Layout
- **Two-Panel**: Side-by-side layout
- **Full Features**: All messaging features
- **Hover States**: Rich hover effects
- **Keyboard Shortcuts**: Full keyboard support

### Tablet Layout
- **Adaptive**: Responsive panel sizing
- **Touch Optimization**: Larger touch targets
- **Swipe**: Swipe between panels
- **Readable**: Optimized font sizes

### Mobile Layout
- **Single Panel**: Toggle between list and conversation
- **Full Screen**: Conversation takes full screen
- **Back Button**: Return to conversation list
- **Bottom Input**: Input at bottom for thumb access

## Privacy and Security

### Message Encryption
- **End-to-End**: Encrypted messages (future)
- **Secure Storage**: Encrypted database storage
- **Privacy**: Messages not visible to admins
- **Deletion**: Permanent message deletion

### Blocking System
- **Block User**: Prevent all communication
- **Unblock**: Restore communication
- **Block List**: View blocked users
- **Report**: Report before blocking

### Message Reporting
- **Report Types**: Harassment, spam, threats
- **Evidence**: Screenshot and context
- **Moderation**: Admin review queue
- **Action**: Warning, suspension, ban

## Performance Features

### Loading Optimization
- **Lazy Loading**: Messages load as needed
- **Pagination**: Load older messages on scroll
- **Image Compression**: Optimized images
- **Caching**: Cache recent conversations

### Real-time Optimization
- **WebSocket**: Efficient real-time connection
- **Batching**: Batch multiple updates
- **Reconnection**: Auto-reconnect on disconnect
- **Offline Queue**: Queue messages when offline

## Integration Features

### Game Integration
- **Duel System**: Direct duel challenge integration
- **Clan System**: Clan invite integration
- **Bounty System**: Bounty notification integration
- **Profile**: Link to user profiles

### Notification Integration
- **In-app**: In-app notification alerts
- **Email**: Email notification option
- **Push**: Mobile push notifications
- **Settings**: Notification preferences

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Navigate with keyboard
- **Shortcuts**: Keyboard shortcuts
- **Focus Management**: Clear focus indicators
- **Screen Reader**: Full screen reader support

### Visual Accessibility
- **High Contrast**: Clear visual hierarchy
- **Color Independence**: Not solely color-dependent
- **Text Scaling**: Respects user preferences
- **Reduced Motion**: Respects motion preferences
