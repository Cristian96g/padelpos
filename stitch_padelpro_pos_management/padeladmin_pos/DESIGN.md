---
name: PadelAdmin POS
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1c9b5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b9481'
  outline-variant: '#41493a'
  surface-tint: '#92d963'
  primary: '#92d963'
  on-primary: '#163800'
  primary-container: '#66a939'
  on-primary-container: '#163800'
  inverse-primary: '#316b00'
  secondary: '#b9cbbd'
  on-secondary: '#24342a'
  secondary-container: '#3f4f45'
  on-secondary-container: '#aec0b3'
  tertiary: '#ffaed9'
  on-tertiary: '#610046'
  tertiary-container: '#e66fb6'
  on-tertiary-container: '#620046'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#adf67c'
  primary-fixed-dim: '#92d963'
  on-primary-fixed: '#0a2100'
  on-primary-fixed-variant: '#235100'
  secondary-fixed: '#d4e7d9'
  secondary-fixed-dim: '#b9cbbd'
  on-secondary-fixed: '#0f1f16'
  on-secondary-fixed-variant: '#3a4a40'
  tertiary-fixed: '#ffd8ea'
  tertiary-fixed-dim: '#ffaed9'
  on-tertiary-fixed: '#3c002a'
  on-tertiary-fixed-variant: '#811960'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  touch-target: 48px
---

## Brand & Style
The design system is engineered for high-velocity internal operations, specifically for padel court management. It balances the rugged, athletic energy of the sport with the precision and sophistication of modern developer-centric tools like Linear.

The style is **Modern Minimalism** within a **Deep Dark Mode** environment. It prioritizes "glanceability"—the ability for a staff member to understand court status in a split second. The aesthetic is "Pro-grade": it feels like a high-end piece of hardware rather than a generic web app. It evokes a sense of reliability, speed, and premium service through ample whitespace (or "darkspace"), crisp borders, and a focused color application.

## Colors
The palette is rooted in a "Pitch Black" foundation to maximize contrast and reduce eye strain in low-light indoor environments. 

- **Primary (Padel Green):** Used for the most important actions and "Paid" states. It should be used sparingly for maximum impact.
- **Secondary (Deep Forest):** Used for subtle backgrounds of active elements or secondary containers to provide depth without adding noise.
- **Surface Strategy:** Use `#0a0a0a` for the global background and `#121212` for primary cards. For interactive elements or elevated modals, use `#1c1c1c`.
- **Semantic States:** These are the heartbeat of the POS. Gray represents availability, Orange warns of friction, and Red signals immediate attention required (Debt).

## Typography
The system utilizes **Inter** for its exceptional legibility and systematic feel. 

- **Numerical Data:** Since this is a POS, numbers (court numbers, prices, times) should use slightly heavier weights (`600` or `700`) to ensure they stand out against the dark background.
- **Tightened Tracking:** For display and headline styles, use a slight negative letter-spacing to achieve that "premium tech" look.
- **Mobile Scale:** On mobile devices, `display-lg` should scale down to `28px` to prevent awkward text wrapping in court titles.

## Layout & Spacing
The layout follows a **Mobile-First, One-Handed** philosophy. 

- **The Thumb Zone:** Critical navigation and action buttons (like "Check-in" or "Pay") are placed in the bottom 40% of the screen.
- **Fluid Grid:** Use a flexible 4-column grid for mobile, expanding to a 12-column grid for desktop/tablet management views.
- **Spacing Rhythm:** Based on an 8px scale. Use `24px` (lg) for card padding to give the UI a luxurious, breathable feel.
- **Safe Areas:** Ensure all bottom-fixed elements account for device home-indicators (e.g., iOS home bar) with at least `32px` of bottom padding.

## Elevation & Depth
In this design system, depth is created through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Surface Tiers:** 
    - Level 0 (Base): `#0a0a0a`.
    - Level 1 (Cards): `#121212` with a `1px` border of `#ffffff0a` (6% white).
    - Level 2 (Modals/Popovers): `#1c1c1c` with a `1px` border of `#ffffff14` (8% white).
- **Interactive States:** When a card is tapped, it should not "lift" with a shadow. Instead, give it a subtle inner glow or change the border color to the Primary Green.
- **Backdrop Blurs:** Use `backdrop-filter: blur(12px)` on top navigation bars and bottom action sheets to maintain context of the content beneath.

## Shapes
The shape language is "Soft-Modern." 

- **Primary Cards:** Use `rounded-2xl` (approx. 16px to 24px) for court cards and main content blocks to create an approachable, native-app feel.
- **Buttons:** Large buttons use a `12px` radius. Avoid pill-shaped buttons for main actions to maintain the structured, professional look.
- **Inputs:** Use an `8px` radius for form fields to differentiate them slightly from larger container elements.

## Components

- **Court Cards:** The central component. Must display the court number, time slot, and status color prominently. The status color should be applied to a vertical "status bar" on the left edge of the card or as a subtle glow.
- **Tactile Buttons:** High-priority buttons must have a minimum height of `56px` for easy thumb tapping. Use a solid Primary Green for "Pay/Confirm" and a ghost style (border only) for "Cancel/Back."
- **Status Chips:** Small, pill-shaped indicators using the state colors. The text inside should be `label-sm` (uppercase) for maximum clarity.
- **Minimalist Inputs:** No background, just a bottom border or a very subtle dark-gray stroke. The label should float or sit above the input in `label-sm`.
- **Navigation:** A bottom-fixed bar for mobile, using Lucide-style icons (2px stroke weight) with clear labels. Icons should be monochrome, only turning Green when active.
- **Quick-Action Sheet:** A slide-up drawer for booking details, triggered by tapping a court card. This minimizes page transitions and keeps the user in the "flow" of the dashboard.