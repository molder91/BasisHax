# BasisHax UI Design Guidelines

## Design Principles

BasisHax follows a **modern, minimalistic, and clean** design philosophy with these core principles:

1. **Simplicity First**: Focus on essential functions without visual clutter
2. **Intuitive Interaction**: Self-explanatory controls that require minimal learning
3. **Visual Harmony**: Consistent visual language throughout the application
4. **Accessibility**: Design that works for users of all abilities
5. **Cross-Platform Consistency**: Familiar experience on both macOS and Windows

## Color Palette

### Primary Colors
- **Base** - `#18181b` (Zinc 900): Primary background
- **Primary** - `#3b82f6` (Blue 500): Brand color, key actions
- **Success** - `#10b981` (Emerald 500): Positive indicators
- **Warning** - `#f59e0b` (Amber 500): Alerts and cautions
- **Danger** - `#ef4444` (Red 500): Critical actions, errors

### Neutral Colors
- **Zinc 50** - `#fafafa`: Lightest background
- **Zinc 100** - `#f4f4f5`: Light background, hover states
- **Zinc 200** - `#e4e4e7`: Borders, dividers
- **Zinc 400** - `#a1a1aa`: Secondary text, disabled controls
- **Zinc 700** - `#3f3f46`: Primary text on light backgrounds
- **Zinc 800** - `#27272a`: Secondary backgrounds

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
```

### Type Scale
- **Text XS**: 12px / 16px line height
- **Text SM**: 14px / 20px line height
- **Text Base**: 16px / 24px line height
- **Text LG**: 18px / 28px line height
- **Text XL**: 20px / 28px line height
- **Heading 2XL**: 24px / 32px line height
- **Heading 3XL**: 30px / 36px line height

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## UI Components

### Buttons

#### Primary Button
- Blue background
- White text
- Subtle hover effect
- Rounded corners (8px)
- Centered text with optional icon

#### Secondary Button
- Transparent background
- Blue text and border
- Background fill on hover
- Same dimensions as primary

#### Ghost Button
- No background or border
- Blue text
- Subtle background on hover
- Used for less emphasis

### Inputs

#### Text Input
- Single line for simple entries
- Clear borders
- Focus state with blue highlight
- Placeholder text slightly muted
- Optional leading/trailing icons

#### Select Dropdown
- Custom styling to match design system
- Simple animation for options display
- Clear selected state

#### Toggle Switch
- Smooth transition animation
- Clear on/off states
- Color coding (gray/blue)
- Appropriate size for easy interaction

### Cards & Containers
- Subtle shadows
- Rounded corners (12px)
- White or light gray backgrounds
- Adequate padding (16px-24px)
- Optional borders for added definition

## Layout Guidelines

### Spacing System
- **Spacing 0**: 0px
- **Spacing 1**: 4px
- **Spacing 2**: 8px
- **Spacing 3**: 12px
- **Spacing 4**: 16px
- **Spacing 5**: 20px
- **Spacing 6**: 24px
- **Spacing 8**: 32px
- **Spacing 10**: 40px
- **Spacing 12**: 48px
- **Spacing 16**: 64px

### Layout Containers
- Max width of 1280px for main content
- Responsive padding that scales with viewport
- Grid system with 12 columns

### Responsive Behavior
- Desktop-first approach (minimum width 640px)
- Limited but thoughtful adjustments for smaller/larger screens
- Focus on maintaining usability at all supported resolutions

## Motion & Animation

### Principles
- Subtle, purposeful motion
- Quick transitions (150-300ms)
- Ease-in-out timing function
- No animation for animation's sake

### Common Animations
- Button hover/active states
- Toggle switches
- Dropdown expansion/collapse
- Notification appearance/disappearance
- Modal transitions

## Icon System

- Use of consistent, simple line icons
- 24x24px base size
- 2px stroke weight
- Rounded line caps and corners
- Optimized SVGs for performance

## Accessibility Considerations

- Minimum contrast ratio of 4.5:1 for text
- Focus states visible for keyboard navigation
- Text alternatives for all visual elements
- Keyboard accessible interactive elements
- Screen reader friendly labeling

## Implementation Notes

- Use TailwindCSS for implementing these design guidelines
- Utilize Radix UI and/or Shadcn/ui components as building blocks
- Maintain consistent class naming conventions
- Create reusable component library 