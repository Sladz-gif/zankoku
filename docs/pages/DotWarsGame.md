# Dot Wars Game Page (/game)

## Overview
Core battle game page featuring strategic grid-based gameplay with anime techniques, real-time combat, and advanced battle systems. Immersive anime battle experience with visual effects and tactical depth.

## Game Structure

### Battle Arena
- **Grid System**: 6x6 dot grid for territory control
- **Two-Player Layout**: Opponent and player panels
- **Center Stage**: Interactive game board
- **Visual Effects**: Dynamic battle animations and effects

### Player Panels
Left (Opponent) and Right (Player) panels with:

#### Player Information
- **Avatar**: Circular avatar with faction color
- **Username**: Player display name
- **Rank**: Current rank number
- **Points**: Current point total

#### Battle Status
- **Resource Bar**: Faction-specific resource (Chakra, Haki, etc.)
- **Shapes Count**: Territories controlled
- **Battle States**: Awakening, Last Stand, Overload indicators
- **Momentum Level**: 6-level momentum indicator

#### Technique Display
- **Available Techniques**: Player's equipped techniques
- **Cost Indicators**: Resource cost for each technique
- **Cooldown Status**: Technique availability
- **Activation Buttons**: Click to use techniques

## Core Gameplay Mechanics

### Grid-Based Territory Control
- **Dot Grid**: 36 intersection points (6x6)
- **Line Drawing**: Connect adjacent dots to create shapes
- **Shape Completion**: Close shapes to claim territory
- **Extra Turns**: Gain additional turn when completing shapes

### Turn System
- **Alternating Turns**: Players alternate moves
- **Time Limit**: Turn timer (configurable)
- **Pass Option**: Pass turn (with penalty)
- **Surrender**: forfeit option available

### Scoring System
- **Shape Points**: Points based on shape size
- **Technique Bonuses**: Extra points from technique usage
- **Combo Multipliers**: Consecutive shape bonuses
- **Victory Conditions**: First to target score or time limit

## Advanced Battle Systems

### 1. Energy Instability/Overload
- **Trigger**: Resources > 150 points
- **Effects**: 
  - 20% increased technique costs
  - 10% backfire chance on techniques
  - Visual warning indicators
- **Strategy**: Risk/reward resource management

### 2. Territory Instability/Decay
- **Trigger**: Player controls >60% of board
- **Effects**:
  - Shapes become cracked (visual effect)
  - Opponent gains advantage
  - Balanced gameplay mechanism
- **Visual**: Cracked shape rendering with dashed lines

### 3. Awakening Mode
- **Trigger Conditions**:
  - Low resources (<30)
  - Losing position
  - Late game (>75% complete)
- **Effects**:
  - 50% cost reduction on techniques
  - Visual awakening aura
  - Comeback mechanic
- **Duration**: 3 turns or until victory

### 4. Last Stand System
- **Trigger**: Critical resource/shapes deficit
- **Effects**:
  - Instant 50 resource boost
  - Desperate battle state
  - Visual last stand indicators
- **Strategy**: Final comeback opportunity

### 5. Momentum System
**6-level progression system:**
1. **Critical** (Level 1) - Red, basic state
2. **Endangered** (Level 2) - Orange, struggling
3. **Stable** (Level 3) - Yellow, balanced
4. **Advantage** (Level 4) - Green, winning
5. **Dominating** (Level 5) - Blue, strong lead
6. **Legendary** (Level 6) - Purple, overwhelming

- **Effects**: Influences technique effectiveness
- **Visual**: Color-coded momentum indicators
- **Callouts**: Generates dynamic battle commentary

### 6. Universal Callout System
**Dynamic battle commentary with intensity levels:**

#### Minor Callouts
- "Nice move!"
- "Good strategy!"
- "Well played!"

#### Major Callouts
- "INCREDIBLE TECHNIQUE!"
- "DOMINATING PERFORMANCE!"
- "UNSTOPPABLE FORCE!"

#### Legendary Callouts
- "LEGENDARY BATTLE UNFOLDING!"
- "TRANSCENDENT SKILL DISPLAY!"
- "MASTERCLASS IN TACTICS!"

### 7. Battlefield Shift
- **Trigger**: Late game random events
- **Effects**: Random board modifications
- **Visual**: Screen effects and animations
- **Strategy**: Adaptable gameplay required

### 8. Forbidden Technique Framework
- **High Risk**: Severe penalties for failure
- **High Reward**: Game-changing effects
- **Conditions**: Specific trigger requirements
- **Visual**: Dramatic technique animations

## Technique System

### Technique Categories
**Faction-specific abilities:**

#### Naruto Techniques
- **Shadow Clone Jutsu**: Create duplicate shapes
- **Rasengan**: Powerful area effect
- **Sage Mode**: Enhanced perception

#### JJK Techniques
- **Domain Expansion**: Lock opponent in zone
- **Black Flash**: Critical hit technique
- **Hollow Technique**: Void manipulation

#### One Piece Techniques
- **Conqueror's Haki**: Skip opponent turn
- **Gear Second**: Speed enhancement
- **Advanced Haki**: Multiple effects

#### Bleach Techniques
- **Bankai**: Steal opponent shape
- **Flash Step**: Extra turn ability
- **Getsuga Tensho**: Line destruction

#### Black Clover Techniques
- **Mana Zone**: Area control
- **Black Asta**: Power boost
- **Spirit Dive**: Flying ability

#### Dragon Ball Techniques
- **Kamehameha**: Beam attack
- **Instant Transmission**: Teleport
- **Spirit Bomb**: Ultimate technique

#### Demon Slayer Techniques
- **Flame Breathing**: Fire attacks
- **Water Breathing**: Flow control
- **Thunder Breathing**: Speed attacks

#### Hunter X Hunter Techniques
- **Nen Mastery**: Energy control
- **Emperor Time**: Time manipulation
- **100-Type Guanyin**: Ultimate defense

### Technique Mechanics
- **Resource Cost**: Varies by technique power
- **Cooldown Period**: Prevents spam usage
- **Success Rate**: Based on resource levels
- **Visual Effects**: Unique animations per technique

## Visual Design

### Battle Arena
- **Grid Rendering**: Clean dot grid with lines
- **Shape Visualization**: Color-coded territories
- **Player Colors**: Purple (P1), Blue (P2)
- **Background**: Dark with subtle gradients

### Visual Effects
- **Screen Shake**: Impact feedback
- **Flash Effects**: Technique activation
- **Slow Motion**: Dramatic moments
- **Particle Effects**: Energy and explosions
- **Glow Effects**: Power-up indicators

### Shape States
- **Normal**: Solid fill with player color
- **Cracked**: Dashed lines, reduced opacity
- **Corrupted**: Purple/pink color scheme
- **Animated**: Pulsing and glow effects

### UI Elements
- **Player Panels**: Dark theme with faction accents
- **Resource Bars**: Animated progress bars
- **Technique Cards**: Interactive technique display
- **Status Indicators**: Battle state visualizations

## Interactive Features

### Grid Interaction
- **Click to Connect**: Click dots to draw lines
- **Hover Preview**: Preview line placement
- **Invalid Moves**: Visual feedback for illegal moves
- **Shape Completion**: Celebration animation

### Technique Activation
- **Technique Cards**: Click to activate
- **Cost Display**: Clear resource requirements
- **Cooldown Indicators**: Visual availability status
- **Confirmation Dialog**: Important technique confirmations

### Battle Controls
- **Turn Indicator**: Clear whose turn it is
- **Timer Display**: Remaining turn time
- **Pass Button**: Pass turn option
- **Surrender Option**: Forfeit game
- **Settings**: Game configuration options

## Game States

### Pre-Battle
- **Opponent Matching**: Find opponent
- **Technique Selection**: Choose loadout
- **Battle Settings**: Configure rules
- **Countdown**: Battle start sequence

### Active Battle
- **Turn Management**: Alternating gameplay
- **Resource Management**: Strategic resource use
- **Technique Usage**: Tactical ability deployment
- **Score Tracking**: Real-time score updates

### Battle End
- **Victory Conditions**: Score/time/surrender
- **Results Display**: Battle summary
- **Rewards**: Points and experience
- **Statistics**: Performance metrics

## Responsive Design

### Desktop Layout
- **Full Arena**: Maximum grid size utilization
- **Side Panels**: Detailed player information
- **Rich Animations**: All visual effects enabled
- **Keyboard Support**: Full keyboard controls

### Tablet Layout
- **Adaptive Grid**: Slightly smaller grid
- **Compact Panels**: Condensed player info
- **Touch Controls**: Optimized touch targets
- **Simplified Effects**: Performance optimization

### Mobile Layout
- **Vertical Layout**: Stacked arrangement
- **Smaller Grid**: Compact grid size
- **Swipe Controls**: Touch gesture support
- **Essential UI**: Critical information only

## Performance Features

### Rendering Optimization
- **Canvas Rendering**: Efficient grid drawing
- **Animation Frames**: 60fps animations
- **Memory Management**: Optimized asset loading
- **Battery Efficiency**: Reduced resource usage

### Network Optimization
- **Real-time Sync**: Efficient battle synchronization
- **Compression**: Compressed game data
- **Latency Handling**: Smooth network play
- **Offline Mode**: Single-player capability

## Audio Features

### Sound Effects
- **Move Sounds**: Line drawing feedback
- **Technique Sounds**: Ability activation
- **Victory Sounds**: Game completion
- **Ambient Sounds**: Battle atmosphere

### Voice Lines
- **Character Voices**: Technique callouts
- **Announcer Voice**: Battle commentary
- **Reaction Sounds**: Player reactions
- **Victory Lines**: Winning statements

## Accessibility Features

### Visual Accessibility
- **High Contrast**: Clear visual boundaries
- **Color Blind Mode**: Alternative color schemes
- **Text Scaling**: Adjustable text sizes
- **Reduced Motion**: Option for fewer animations

### Motor Accessibility
- **Large Targets**: Large click targets
- **Keyboard Controls**: Full keyboard navigation
- **Touch Assistance**: Touch-friendly controls
- **Timing Assistance**: Adjustable timers

### Cognitive Accessibility
- **Clear Instructions**: Tutorial system
- **Visual Cues**: Clear feedback systems
- **Simple Controls**: Streamlined interface
- **Help System**: In-game assistance

## Multiplayer Features

### Real-time Battles
- **Matchmaking**: Skill-based opponent matching
- **Spectator Mode**: Watch other battles
- **Tournament Mode**: Competitive play
- **Friend Battles**: Challenge specific players

### Social Features
- **Chat System**: In-battle communication
- **Emotes**: Quick reactions
- **Replay System**: Save and share battles
- **Statistics Tracking**: Performance history
