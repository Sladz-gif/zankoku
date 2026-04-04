# Sign Up Page (/signup)

## Overview
Multi-step registration process for joining Zankoku with anime faction selection, character alignment, and country selection. Features a dark, immersive design with validation and animated completion.

## Step Structure
3-step registration process with progress indicator and validation at each step.

### Step 1: Account Information
**Basic user details and account creation**

#### Form Fields
- **Email Address** (`email`)
  - Input field with Mail icon
  - Validation: Standard email format regex
  - Real-time validation feedback

- **Username** (`username`)
  - Input field with User icon
  - Validation: 3-20 characters, no spaces
  - Real-time validation with error message for spaces

- **Password** (`password`)
  - Input field with Lock icon
  - Eye/EyeOff toggle for visibility
  - Password strength indicator (4 levels):
    - Empty (gray)
    - Weak (red) - < 8 characters
    - Fair (orange) - 8+ characters
    - Good (blue) - 8+ + uppercase + numbers
    - Strong (green) - 8+ + uppercase + numbers + special chars
  - Visual strength bar with color coding

- **Confirm Password** (`confirmPassword`)
  - Input field with Lock icon
  - Eye/EyeOff toggle for visibility
  - Validation: Must match password
  - Visual checkmark when matching

- **Country Selection** (`selectedCountry`)
  - Searchable dropdown with Globe icon
  - 200+ countries with flags
  - Real-time search filtering
  - Required field

- **Terms Acceptance** (`acceptedTerms`)
  - Checkbox with "I accept the terms and conditions"
  - Required to proceed

#### Navigation Buttons
- **Back Button**: Not visible on step 1
- **Continue Button**: 
  - Text: "Continue"
  - Enabled only when all validations pass
  - ArrowRight icon

### Step 2: Choose Your Alignment
**Character path selection with visual cards**

#### Alignment Options
Three alignment choices with detailed descriptions:

1. **HERO** (Swords icon)
   - **Description**: "Fight for justice. Protect the weak. Build alliances. Heroes gain reputation faster and can create clans. But everyone knows your weakness."
   - **Color**: Blue theme
   - **Implication**: Higher reputation, clan creation ability, known weaknesses

2. **VILLAIN** (Skull icon)
   - **Description**: "Power is everything. Take what you want. Betrayal is just strategy. Villains earn more from victories and can place bounties. But the world will hunt you."
   - **Color**: Red theme
   - **Implication**: Higher victory rewards, bounty placement, hunted status

3. **WANDERER** (Compass icon)
   - **Description**: "No allegiance. No master. Freedom is your only code. Wanderers switch factions without penalty and keep techniques from former allies. But you start with no reputation."
   - **Color**: Green theme
   - **Implication**: Faction switching freedom, technique retention, no starting reputation

#### Navigation Buttons
- **Back Button**: "Back" (returns to step 1)
- **Continue Button**: "Continue" (enabled when alignment selected)

### Step 3: Choose Your Faction
**Anime faction selection with resource types**

#### Available Factions
8 anime factions with unique resources and starting techniques:

1. **NARUTO** - Chakra
   - Shadow Clone Jutsu (free starting technique)
   - Rasengan
   - Sage Mode

2. **JUJUTSU KAISEN** - Cursed Energy
   - Domain Expansion (free starting technique)
   - Black Flash
   - Hollow Technique

3. **ONE PIECE** - Haki
   - Conqueror's Haki (free starting technique)
   - Gear Second
   - Advanced Haki

4. **BLEACH** - Spiritual Pressure
   - Bankai (free starting technique)
   - Flash Step
   - Getsuga Tensho

5. **BLACK CLOVER** - Mana
   - Mana Zone (free starting technique)
   - Black Asta
   - Spirit Dive

6. **DRAGON BALL** - Ki
   - Kamehameha (free starting technique)
   - Instant Transmission
   - Spirit Bomb

7. **DEMON SLAYER** - Total Concentration
   - Flame Breathing (free starting technique)
   - Water Breathing
   - Thunder Breathing

8. **HUNTER X HUNTER** - Nen
   - Nen Mastery (free starting technique)
   - Emperor Time
   - 100-Type Guanyin

#### Faction Card Features
- **Faction Name** (large, bold)
- **Resource Type** (colored, uppercase)
- **Starting Technique** (highlighted)
- **Additional Techniques** (2 more techniques)
- **Hover Effects**: Border glow and elevation
- **Selection**: Click to select with visual feedback

#### Navigation Buttons
- **Back Button**: "Back" (returns to step 2)
- **ENTER ZANKOKU Button**:
  - Large, prominent button with gradient background
  - Text: "ENTER ZANKOKU"
  - ArrowRight icon
  - Triggers completion animation

## Completion Sequence

### Animation Overlay
Full-screen overlay with completion effects:
- **Background**: Dark overlay with z-index 9999
- **Animation**: Dramatic entrance sequence
- **Duration**: 1.5 seconds
- **Navigation**: Auto-redirects to `/dashboard` after completion

### User Creation
During completion, creates new user with:
- **ID**: Timestamp-based
- **Username**: Chosen username or default "Fighter" + 4 digits
- **Faction**: Selected anime faction
- **Alignment**: Chosen alignment
- **Starting Rank**: 1000
- **Starting Points**: 0
- **Free Technique**: First technique from selected faction
- **Resources**: 100/100 max
- **Country**: Selected country with flag
- **Login Status**: Logged in

## Visual Design

### Color Scheme
- **Primary**: Neon purple (#8B00FF)
- **Secondary**: Faction-specific colors
- **Success**: Green (#00FF88)
- **Error**: Red (#FF003C)
- **Warning**: Orange (#FF6B35)
- **Background**: Dark theme (#030308, #080812)

### Typography
- **Headings**: font-display (bold, dramatic)
- **Body**: font-body (clean, readable)
- **Buttons**: Tracking and letter-spacing for dramatic effect

### Animations
- **Progress Indicator**: Smooth transitions between steps
- **Card Hovers**: Elevation and border glow effects
- **Button States**: Scale and brightness changes
- **Completion**: Full-screen animated sequence
- **Validation**: Real-time feedback animations

## Form Validation

### Real-time Validation
- **Email**: Format checking with regex
- **Username**: Length and character validation
- **Password**: Strength calculation and visual feedback
- **Password Match**: Comparison with confirm field
- **Country**: Required selection
- **Terms**: Required acceptance

### Error States
- **Invalid Fields**: Red borders and error messages
- **Weak Password**: Orange warning indicator
- **Mismatched Passwords**: Red error state
- **Missing Fields**: Disabled continue button

## User Experience

### Progress Flow
1. **Step 1** → Account creation with validation
2. **Step 2** → Alignment choice with narrative
3. **Step 3** → Faction selection with techniques
4. **Completion** → Animated user creation
5. **Redirect** → Dashboard with new account

### Accessibility
- **Keyboard Navigation**: Full tab navigation support
- **Screen Reader**: Semantic HTML and ARIA labels
- **Focus States**: Visible focus indicators
- **High Contrast**: Clear visual hierarchy

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Multi-column layout where appropriate

## Technical Features

### State Management
- **Step State**: Current registration step
- **Form State**: All form fields tracked
- **Validation State**: Real-time validation results
- **Completion State**: Animation and user creation

### Security Features
- **Password Strength**: Visual strength indicator
- **Input Sanitization**: Username validation
- **Terms Agreement**: Required acceptance
- **Email Validation**: Format checking

### Performance
- **Debounced Search**: Country search optimization
- **Lazy Loading**: Components load as needed
- **Optimized Animations**: CSS transitions for smoothness
- **Form Caching**: State preserved during navigation
