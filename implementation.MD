# Kouponly Expo React Native Implementation Goal

## Objective

Convert the current Kouponly web prototype into a production-oriented Expo React Native mobile app for students and early-career users in Kerala. Preserve the product structure, visual identity, content, and working interaction logic demonstrated by the website while replacing browser-only behavior with native mobile patterns.

The first mobile release must run on iOS and Android from one TypeScript codebase and remain usable in Expo Go wherever possible.

## Product Direction

- Light-mode, youthful, bold, and easy to scan.
- Primary color: `#64011a`.
- Secondary highlight: `#c5ff3d`, used sparingly.
- Black replaces brown throughout the interface.
- Rounded cards, restrained glass effects, strong playful typography, and clear hierarchy.
- Kerala-first sample content, places, partners, currency, and distance labels.
- Four primary tabs: Home, Search, Map, and Me.
- Saved items, savings, earnings, rewards, history, help, and settings live in the home hamburger menu or Me area rather than taking a main tab.

## Recommended Stack

- Expo SDK with React Native and TypeScript.
- Expo Router for file-based navigation and deep linking.
- React Native Reanimated for carousel, modal, and transition motion.
- React Native Gesture Handler for swipe interactions.
- Expo Image for remote images and local assets.
- Expo Location and React Native Maps for the Kerala map experience.
- Expo Linking for external Grow and Go Out destinations.
- AsyncStorage for prototype persistence; replace with the production backend when available.
- Zustand or React Context for lightweight app state.
- Zod for validating offers, partners, campaigns, applications, and redemption data.

## App Structure

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    search.tsx
    map.tsx
    me.tsx
  category/[slug].tsx
  partner/[id].tsx
  offer/[id].tsx
  redemption/[offerId].tsx
  rewards/index.tsx
  rewards/[id].tsx
  grow/index.tsx
  grow/work-with-us.tsx
  grow/campaign/[id].tsx
  grow/opportunity/[id].tsx
  creator/index.tsx
  account/[section].tsx
  help/index.tsx
components/
features/
data/
store/
theme/
assets/
```

## Core Screens

### Home

- Header with hamburger menu, Kouponly identity, location, and notification access.
- Rotating set of 10 real-image hero cards, changing every five seconds with manual swipe and pagination.
- Clear entry points for Save, Go Out, Grow, and Rewards.
- Eight food categories in a four-column grid: Mains, Snacks, Drinks, Sweets, Cuisines, Dietary, Breakfast, and Buffet.
- Sections for exclusive student deals and meals under ₹100.
- Partner and offer carousels using Kerala-oriented placeholder content.
- Work with Kouponly teaser that opens a dedicated page instead of expanding into one oversized home block.

### Hamburger Menu

- User summary.
- Total saved.
- Total earned from approved creator work.
- Reward points.
- Saved items.
- Savings and redemption history.
- Earnings and campaign payment history.
- Help and support.
- Preferences, legal pages, and sign out.

### Search and Directory

- One search field across partners, discounts, experiences, courses, internships, jobs, freelance opportunities, and rewards.
- Filters for A–Z, highest offer, newest, trending, and nearest.
- Search results update without losing the selected sort or category.
- Every result opens a defined detail screen.
- Empty, loading, offline, and no-location states are designed explicitly.

### Category Directory

- Each category opens its own screen.
- Subcategory chips filter the visible partner list.
- Search is scoped to the current category.
- Nearest-to-me control requests location permission only when used.
- Include at least five representative Kerala partners across each category and subcategory data set.

### Partner and Offer Details

- Partner hero, location, rating, distance, summary, and available offers.
- Each offer has its own Redeem action.
- Usage state shows `3/3`, `2/3`, `1/3`, or expired, plus the renewal date.
- Save and share actions work.
- Online offers and in-store offers use separate redemption flows.

### Redemption

- Present redemption in a centered modal with a blurred backdrop.
- In-store: show a four-digit partner PIN entry. Only partner staff should enter the PIN.
- Online: show a warning that continuing consumes one redemption, then reveal a code that remains active for 10 minutes with instructions and an external link.
- Each offer supports three uses before expiry and renewal.
- Persist consumption state locally for the prototype and through the backend in production.
- Prevent double submission, expired-code reuse, and closing-state loss.

### Map

- Native Kerala map centered around Kochi for the first release.
- Partner pins, category filters, search, selected-partner preview, and recenter control.
- Provide a static illustrated map fallback when native maps or location are unavailable.
- Selecting a pin opens the matching partner page.

### Grow

- Prioritize Work with Kouponly.
- Paths: UGC Creator, BD & Sales internship, Marketing internship, and Campus Ambassador.
- Other courses, internships, jobs, and freelance listings can open verified external application links.
- Every opportunity has a defined detail page before leaving the app.

### Creator Hub

- Visible from Me only after the user is accepted as a creator.
- Available, applied, selected, in-progress, submitted, approved, and paid campaign states.
- Campaign flow covers receiving a package or visiting a location, creating the video, submitting it for approval, posting approved content, transferring deliverables, and payment tracking.
- Show total earned and itemized earnings.

### Campus Ambassador

- Application and interest form.
- Explain expectations around university events and Kouponly promotion.
- Accepted ambassadors receive a Gold Card screen with eligible free food, experiences, and partner perks.

### Rewards

- Challenges only; no gambling or cash prizes.
- Examples: redeem three discounts, invite ten friends, complete a profile, visit a new category, or finish a creator milestone.
- Challenges award points.
- Points can be redeemed for food, coffee, and experiences, never cash.
- Reward redemption requires confirmation followed by a partner PIN.

## Data Models

Define typed models for:

- User, profile, location, membership, and creator status.
- Partner, branch, category, and subcategory.
- Offer, redemption limit, renewal date, and redemption record.
- Experience and booking link.
- Opportunity, application, and external destination.
- Creator campaign, deliverable, approval, and earning.
- Campus ambassador application and Gold Card benefit.
- Challenge, points transaction, reward, and reward redemption.
- Saved item, notification, and activity history.

Keep prototype data in typed fixtures so it can later be replaced by API repositories without rewriting screens.

## Migration Rules

- Do not embed the web app in a WebView.
- Replace HTML elements with React Native primitives.
- Replace CSS files with a centralized theme and StyleSheet or NativeWind-based component styles.
- Replace hover behavior with pressed, focused, loading, and disabled states.
- Replace `window.open` with Expo Linking.
- Replace browser clipboard usage with Expo Clipboard.
- Replace browser timers and visibility assumptions with lifecycle-safe hooks.
- Respect safe areas, keyboard avoidance, reduced motion, dynamic font sizing, and screen-reader labels.

## Delivery Phases

1. Scaffold Expo Router, theme tokens, fonts, icons, state, and typed fixtures.
2. Build tab navigation, home, hamburger menu, and reusable cards.
3. Build search, directory, category, partner, and offer screens.
4. Implement redemption state machines and centered native modals.
5. Build map with static fallback.
6. Build Grow, Work with Kouponly, Creator Hub, internships, and Campus Ambassador flows.
7. Build challenges, points, rewards, savings, earnings, and history.
8. Add persistence, accessibility, error states, analytics hooks, and backend interfaces.
9. Test on representative iPhone and Android viewport sizes and prepare store builds.

## Acceptance Criteria

- Runs on iOS and Android using the documented setup commands.
- All four main tabs and every visible card, button, category, filter, and menu item lead to a defined result.
- Ten home heroes rotate every five seconds and support manual navigation.
- Search returns and sorts all supported content types correctly.
- Category and subcategory filters show relevant partners.
- Partner offers display usage and renewal state and launch the correct redemption flow.
- In-store and online redemption rules work and persist.
- Map pins, filters, search, previews, and fallback work.
- Grow prioritizes Work with Kouponly and supports creator, internship, marketing, and campus paths.
- Accepted creators can browse and manage campaigns and see earnings.
- Rewards use challenges and points only, with partner-confirmed redemption.
- No dead links, undefined interactions, clipped content, or inaccessible modals remain.
- Type checking, linting, unit tests, and key navigation-flow tests pass.

## Definition of Done

The Expo app reproduces the current website’s useful product behavior as a cohesive native mobile experience, is visually consistent with Kouponly’s light theme, contains complete Kerala-first prototype data, and is structured so real authentication, partner, offer, campaign, payment, and analytics services can replace fixtures without redesigning the interface.
