

## Change Header "Login" to "Sign up"

### Overview
The top-right corner of the landing page currently shows "Login" which redirects to `/auth?mode=login`. You want this changed to "Sign up" redirecting to `/auth?mode=signup`.

### Changes Required

**1. Desktop Header (src/pages/LandingPage.tsx)**
- Line 143: Change `/auth?mode=login` → `/auth?mode=signup`
- Line 146: Change text "Login" → "Sign up"

**2. Mobile Menu (src/components/landing/MobileMenu.tsx)**
- Line 60: Change `/auth?mode=login` → `/auth?mode=signup`  
- Line 64: Change text "Login" → "Sign up"

### Result
After the fix:
- Desktop: Top-right corner shows "Sign up" → opens auth page with signup form
- Mobile: Menu shows "Sign up" → opens auth page with signup form
- The "Get Started" button below remains unchanged (already points to signup)

