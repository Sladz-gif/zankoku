# Sign In Page (/signin)

## Overview
Clean, minimalist sign-in page with dark anime aesthetic. Features email/username login, password visibility toggle, and animated authentication sequence.

## Visual Design

### Background
- **Base**: Dark gradient background (`zankoku-bg`)
- **Radial Gradients**: Purple and blue overlay effects
- **Watermark**: Large Japanese kanji "残酷" (Zankoku) with low opacity
- **Atmosphere**: Immersive, dramatic lighting

### Layout
- **Centered Form**: Fixed width (420px max) card design
- **Logo**: "ZANKOKU" header linking to home page
- **Responsive**: Mobile-friendly with padding adjustments

## Form Components

### Header Section
- **Welcome Text**: "WELCOME BACK" (small, uppercase, tracking)
- **Main Title**: "Sign in to Zankoku." (large, dramatic font)

### Input Fields

#### Email or Username Field
- **Label**: "EMAIL OR USERNAME" (uppercase, tracking)
- **Icon**: User icon (left side, muted color)
- **Placeholder**: "email or username"
- **Validation**: Real-time error state (red border when error present)
- **Styling**: Dark background with purple focus state

#### Password Field
- **Label**: "PASSWORD" (uppercase, tracking)
- **Icon**: Lock icon (left side, muted color)
- **Visibility Toggle**: Eye/EyeOff button (right side)
- **Placeholder**: No placeholder (secure by default)
- **Validation**: Real-time error state (red border when error present)
- **Styling**: Dark background with purple focus state

### Additional Options

#### Remember Me Checkbox
- **Label**: "Keep me signed in"
- **Custom Checkbox**: Styled purple checkmark when selected
- **Default State**: Unchecked
- **Functionality**: Persists login state (mock implementation)

#### Forgot Password Link
- **Text**: "Forgot password?"
- **Placement**: Right-aligned below password field
- **Destination**: `/forgot-password`
- **Styling**: Blue color with hover effect

## Authentication Logic

### Validation Rules
- **Identifier Required**: Email or username must be provided
- **Password Required**: Password must be provided
- **Password Length**: Minimum 8 characters (mock validation)
- **Error Message**: "Invalid email or password. Check your details and try again."

### Mock Authentication
- **Success Condition**: Password length ≥ 8 characters
- **User Creation**: Generates mock user object with:
  - **ID**: Timestamp-based
  - **Username**: Extracted from email or default "Player"
  - **Faction**: JJK (default)
  - **Alignment**: Wanderer (default)
  - **Rank**: 500
  - **Points**: 1000
  - **Currency**: 50 bronze, 0 silver, 0 gold
  - **Technique**: "Divergent Fist" (JJK starter)
  - **Resources**: 100/100

### Authentication Flow
1. **Validation**: Check required fields and password length
2. **Error Handling**: Display error message for invalid inputs
3. **Loading State**: Show authentication animation
4. **Success**: Create user session and redirect
5. **Redirect**: Navigate to intended destination or `/dashboard`

## Authentication Animation

### Loading Screen
- **Full Screen**: Dark overlay with z-index 9999
- **Animation**: "pulse-explode-short" keyframe animation
- **Content**: Large "残酷" kanji with purple glow
- **Duration**: 0.8 seconds
- **Effect**: Scale and opacity transition (0.9 → 1 → 2 scale)

### Animation Keyframes
```css
@keyframes pulse-explode-short {
  0% { opacity: 0; transform: scale(0.9); }
  40% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2); }
}
```

## Interactive Elements

### Sign In Button
- **Text**: "SIGN IN" (uppercase, tracking)
- **Icon**: ArrowRight icon (right side)
- **Styling**: Purple gradient background
- **Hover State**: Brightness increase
- **Disabled State**: Not implemented (always active)

### Navigation Links
- **Home Link**: "ZANKOKU" logo (top left)
- **Forgot Password**: "Forgot password?" (below password field)
- **Sign Up**: "START YOUR ARC" (bottom of form)

## Error Handling

### Error Display
- **Icon**: AlertCircle with error message
- **Color**: Red (`--neon-red`)
- **Placement**: Above sign-in button
- **Animation**: Fade in/out transition
- **Clearing**: Errors clear when user types in fields

### Error States
- **Empty Fields**: Shows generic error message
- **Short Password**: Shows same error message (mock validation)
- **Visual Feedback**: Red borders on invalid fields

## User Experience Features

### Auto-focus
- **Field Focus**: First field focused on page load
- **Tab Navigation**: Logical tab order through form
- **Keyboard Support**: Enter key submits form

### Remember Me
- **Persistence**: Mock implementation (would use cookies/localStorage)
- **Visual Feedback**: Purple checkmark when selected
- **Default**: Unchecked for security

### Password Visibility
- **Toggle**: Eye/EyeOff icons
- **Security**: Password hidden by default
- **Convenience**: Easy visibility toggle for verification

## Responsive Design

### Mobile Adaptations
- **Padding**: Reduced padding on smaller screens
- **Width**: Full-width form on mobile
- **Font Size**: Optimized for mobile readability
- **Touch Targets**: Large enough for touch interaction

### Desktop Optimizations
- **Fixed Width**: 420px max width for centered layout
- **Hover States**: Desktop-specific hover effects
- **Keyboard Navigation**: Full keyboard accessibility

## Routing & Navigation

### Redirect Logic
- **Intended Destination**: Uses `location.state.from` if available
- **Default Redirect**: `/dashboard` if no intended destination
- **Navigation**: React Router navigation with state

### Link Integration
- **Home**: `/` (logo link)
- **Forgot Password**: `/forgot-password`
- **Sign Up**: `/signup`

## Security Features

### Input Sanitization
- **Password Protection**: Password field properly masked
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Would be implemented in production

### Authentication Security
- **Password Validation**: Minimum length requirements
- **Error Messages**: Generic error messages (don't reveal specific issues)
- **Session Management**: Secure session creation (mock implementation)

## Performance Considerations

### Animation Optimization
- **CSS Animations**: Hardware-accelerated transforms
- **Minimal Repaints**: Efficient animation keyframes
- **Quick Duration**: 0.8s animation for fast feedback

### Form Optimization
- **Controlled Components**: Efficient state management
- **Debounced Validation**: Real-time but performant validation
- **Lazy Loading**: Components load as needed

## Accessibility Features

### Semantic HTML
- **Form Labels**: Proper label elements for all inputs
- **Button Types**: Correct button and input types
- **ARIA Labels**: Screen reader friendly structure

### Keyboard Navigation
- **Tab Order**: Logical navigation through form
- **Enter Key**: Form submission support
- **Focus Indicators**: Visible focus states

### Visual Accessibility
- **High Contrast**: Clear text/background contrast
- **Color Independence**: Not reliant on color alone
- **Text Sizing**: Readable font sizes
