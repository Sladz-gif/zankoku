# Checkout Page (/checkout)

## Overview
Unified checkout page supporting both store purchases and Spy Network pre-orders. Features global payment processing with Ghana Mobile Money integration and dynamic UI based on purchase type.

## Page Structure

### Header Section
- **Dynamic Title**: Changes based on purchase type
  - Store Purchase: "Complete Purchase"
  - Spy Network: "Spy Network Pre-Order"
- **Security Badges**: SSL, encryption indicators
- **Progress Indicator**: Multi-step checkout progress

### Order Summary
- **Item Details**: Product name and description
- **Pricing**: Clear price display (or "FREE" for pre-orders)
- **Currency**: Gold/Silver coins or real money
- **Total**: Final amount to pay

## Purchase Types

### Store Purchase Mode
**Theme**: Gold gradient with CheckCircle icon

#### Order Details
- **Item Name**: Specific product (e.g., "Medium Refill")
- **Price**: Real money amount (e.g., "$1.00 USD")
- **Currency Amount**: In-game currency received (e.g., "120 Silver")
- **Benefits**: List of included benefits

#### Visual Design
- **Header Color**: Gold gradient (#FFD700)
- **Icon**: CheckCircle (success/purchase)
- **Button**: "COMPLETE PURCHASE" (gold gradient)
- **Theme**: Professional, transactional

### Spy Network Pre-Order Mode
**Theme**: Green gradient with Lock icon

#### Order Details
- **Item Name**: "Spy Network Early Access"
- **Price**: "FREE"
- **Benefits**: List of pre-order benefits
- **Launch Notification**: Email notification signup

#### Visual Design
- **Header Color**: Green gradient (#00FF88)
- **Icon**: Lock (locked/coming soon)
- **Button**: "COMPLETE PRE-ORDER" (green gradient)
- **Theme**: Anticipation, exclusive access

## Form Fields

### Personal Information
**Required for all purchases:**

#### Email Address
- **Label**: "EMAIL ADDRESS"
- **Icon**: Mail icon
- **Validation**: Email format validation
- **Placeholder**: "your@email.com"
- **Required**: Yes

#### Full Name
- **Label**: "FULL NAME"
- **Icon**: User icon
- **Validation**: Minimum 2 characters
- **Placeholder**: "John Doe"
- **Required**: Yes

### Country Selection
**Smart country detection:**

#### Country Dropdown
- **Label**: "COUNTRY"
- **Icon**: Globe icon
- **Options**: 20+ countries supported
- **Search**: Searchable dropdown
- **Required**: Yes

#### Supported Countries
- United States
- United Kingdom
- Canada
- Ghana (with MoMo support)
- Nigeria
- Kenya
- South Africa
- Germany
- France
- Japan
- Australia
- Brazil
- India
- Mexico
- Spain
- Italy
- Netherlands
- Sweden
- Switzerland
- Singapore

## Payment Methods

### Global Card Payments
**Available for all countries:**

#### Payment Method Toggle
- **Card Option**: Credit/Debit card selector
- **Visual Toggle**: Card vs MoMo buttons
- **Default**: Card payment selected

#### Card Information Fields
- **Card Number**: 16-digit card number
  - Icon: CreditCard
  - Validation: Luhn algorithm
  - Formatting: Auto-formatted (XXXX XXXX XXXX XXXX)
  
- **Expiry Date**: MM/YY format
  - Icon: Calendar
  - Validation: Future date required
  - Formatting: Auto-formatted (MM/YY)
  
- **CVV**: 3-4 digit security code
  - Icon: Lock
  - Validation: 3-4 digits
  - Masked: Hidden input

#### Supported Card Types
- Visa
- Mastercard
- American Express
- Discover
- JCB

### Ghana Mobile Money (MoMo)
**Ghana-specific payment option:**

#### MoMo Provider Selection
**Three major providers with distinct branding:**

##### MTN MoMo
- **Theme**: Orange branding (#FF6600)
- **Icon**: Phone with MTN logo
- **Process**: Phone number + OTP verification
- **Popular**: Most widely used in Ghana

##### Vodafone Cash
- **Theme**: Red branding (#E60000)
- **Icon**: Phone with Vodafone logo
- **Process**: Phone number + PIN verification
- **Reliable**: Established provider

##### AirtelTigo Money
- **Theme**: Dark red branding (#8B0000)
- **Icon**: Phone with AirtelTigo logo
- **Process**: Phone number + OTP verification
- **Growing**: Expanding user base

#### MoMo Phone Number
- **Label**: "MOBILE MONEY NUMBER"
- **Icon**: Phone icon
- **Format**: 10 digits (0XXXXXXXXX)
- **Validation**: Ghana phone number format
- **Example**: "0244123456"

#### MoMo Process Flow
1. Select MoMo provider
2. Enter phone number
3. Submit payment
4. Receive OTP/PIN prompt on phone
5. Confirm payment on mobile device
6. Receive confirmation

### Payment Method Logic
- **Default**: Card payment for all countries
- **Ghana Detection**: MoMo option appears when Ghana selected
- **Auto-switch**: Selecting non-Ghana country hides MoMo
- **Smart UI**: Dynamic form fields based on selection

## Additional Options

### Notification Consent
**For Spy Network pre-orders:**

#### Checkbox Option
- **Label**: "Get notified when Spy Network launches"
- **Default**: Unchecked
- **Purpose**: Marketing consent
- **Optional**: Not required for purchase

### Terms and Conditions
- **Checkbox**: "I accept the terms and conditions"
- **Link**: View full terms
- **Required**: Yes for purchases
- **Validation**: Must be checked to proceed

## Security Features

### Visual Security Indicators
- **SSL Badge**: Secure connection indicator
- **Encryption Icon**: Data encryption badge
- **Payment Logos**: Trusted payment provider logos
- **Security Text**: "Your payment is secure and encrypted"

### Data Protection
- **PCI Compliance**: Payment card industry standards
- **Data Encryption**: End-to-end encryption
- **Secure Storage**: No card data stored locally
- **Privacy Policy**: Clear privacy information

### Fraud Prevention
- **Card Validation**: Real-time card verification
- **Address Verification**: AVS checking
- **CVV Verification**: Security code validation
- **3D Secure**: Additional authentication layer

## Processing States

### Loading State
**During payment processing:**

#### Visual Feedback
- **Loading Spinner**: Animated processing indicator
- **Processing Text**: "Processing your payment..."
- **Disabled Form**: Form fields disabled
- **Progress Animation**: Visual progress feedback

#### Processing Steps
1. Validating payment information
2. Contacting payment provider
3. Confirming transaction
4. Updating account

### Success State
**After successful payment:**

#### Success Page
- **Checkmark Icon**: Large success checkmark
- **Success Message**: "Payment Successful!"
- **Order Details**: Purchase confirmation
- **Receipt**: Transaction receipt display

#### Success Actions
- **Continue Button**: Return to store/dashboard
- **Receipt Download**: Download receipt PDF
- **Email Confirmation**: Confirmation email sent
- **Account Update**: Instant currency/access delivery

### Error State
**If payment fails:**

#### Error Display
- **Error Icon**: AlertCircle with error message
- **Error Message**: Clear explanation of issue
- **Retry Button**: Try payment again
- **Support Link**: Contact customer support

#### Common Errors
- Invalid card information
- Insufficient funds
- Payment declined
- Network timeout
- Server error

## Responsive Design

### Desktop Layout
- **Two-column**: Order summary + payment form
- **Full Features**: All payment options visible
- **Hover States**: Interactive element feedback
- **Keyboard Support**: Full keyboard navigation

### Tablet Layout
- **Adaptive**: Responsive column layout
- **Touch Optimized**: Larger touch targets
- **Simplified**: Streamlined interface
- **Readable**: Optimized font sizes

### Mobile Layout
- **Single Column**: Stacked vertical layout
- **Mobile Payments**: Apple Pay, Google Pay integration
- **Touch Friendly**: Large buttons and inputs
- **Simplified Form**: Essential fields only

## Visual Design

### Color Themes
**Dynamic based on purchase type:**

#### Store Purchase Theme
- **Primary**: Gold (#FFD700)
- **Accent**: Orange (#FF6B35)
- **Success**: Green (#00FF88)
- **Background**: Dark theme

#### Spy Network Theme
- **Primary**: Green (#00FF88)
- **Accent**: Cyan (#00C8FF)
- **Success**: Blue (#00FFFF)
- **Background**: Dark theme

### Typography
- **Headers**: font-display, bold, uppercase
- **Labels**: Uppercase with tracking
- **Input Text**: font-body, readable
- **Prices**: Large, prominent display

### Animations
- **Form Transitions**: Smooth field transitions
- **Loading States**: Animated spinners
- **Success Animation**: Celebration effects
- **Error Shake**: Error field shake animation

## Integration Features

### Store Integration
- **Purchase Data**: Passed via React Router state
- **Item Details**: Product information transfer
- **Price Calculation**: Real-time price display
- **Inventory Check**: Stock availability verification

### Payment Gateway Integration
- **Stripe**: Primary card processor
- **PayPal**: Alternative payment option
- **MoMo API**: Ghana mobile money integration
- **Webhook Handling**: Payment confirmation webhooks

### User Account Integration
- **Auto-login**: Automatic user authentication
- **Currency Delivery**: Instant coin delivery
- **Purchase History**: Transaction recording
- **Receipt Generation**: Automatic receipt creation

## Analytics and Tracking

### Conversion Tracking
- **Funnel Analysis**: Checkout step tracking
- **Abandonment Rate**: Cart abandonment tracking
- **Success Rate**: Payment success metrics
- **Error Tracking**: Payment failure analysis

### Business Intelligence
- **Revenue Tracking**: Real-time revenue data
- **Payment Method**: Popular payment method analysis
- **Regional Data**: Country-based purchase data
- **Product Performance**: Best-selling products

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical field navigation
- **Enter Submit**: Form submission support
- **Escape Cancel**: Cancel action support
- **Focus Indicators**: Visible focus states

### Screen Reader Support
- **ARIA Labels**: Descriptive field labels
- **Error Announcements**: Screen reader error alerts
- **Status Updates**: Processing state announcements
- **Semantic HTML**: Proper form structure

### Visual Accessibility
- **High Contrast**: Clear visual hierarchy
- **Color Independence**: Not solely color-dependent
- **Text Scaling**: Respects user preferences
- **Error Clarity**: Clear error messaging
