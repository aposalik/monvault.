# monvault. Design System

**Status:** approved direction, implementation source of truth

**Product:** ecommerce payment escrow on Monad testnet

**Audience:** buyers, sellers, hackathon judges, and technical reviewers

**Last updated:** 2026-10-22

This file defines the visual language, interface behavior, content rules, and design acceptance criteria for monvault. Page work should follow it unless a documented product or accessibility requirement overrides it.

---

## 1. Product promise

**Primary message:** Buy with confidence. Pay when delivery is confirmed.

monvault. lets a buyer lock test MON in a public escrow contract. The seller can see that funds exist before shipping. The buyer then confirms delivery or opens a dispute during the five-minute demo review window; otherwise the seller may claim after the timeout.

### Claim boundaries

Use precise language:

- Say **“funds secured in escrow”**, not “payment guaranteed.”
- Say **“contract-enforced release rules”**, not “fraud-proof.”
- Say **“delivery-protected checkout”**, not “delivery verified on-chain.”
- Say **“testnet demo”** anywhere a person could mistake test MON for real money.
- Explain that physical delivery and dispute resolution are not autonomously verified by the contract.

Do not use the supplied logo tagline, **“secure every transaction,”** as interface copy. It is part of the submitted artwork, but it overstates the MVP.

---

## 2. Creative direction

### Concept: “A transaction you can see”

The interface turns an invisible payment state machine into a visible spatial system. Funds move into a dimensional vault, wait under clearly labelled conditions, then follow one of three paths: release, timeout claim, or dispute lock.

The mood is:

- precise, confident, and technical;
- playful enough for a hackathon demonstration;
- premium without looking like a bank dashboard;
- expressive in presentation, calm during wallet actions.

### Monad reference — what we borrow

Research of the live `monad.xyz` experience identified these reusable principles:

- **Inter** as the primary proportional typeface;
- **Roboto Mono** for utility labels, state, addresses, and technical proof;
- strong indigo/violet accents against very light or very dark surfaces;
- large editorial typography and generous whitespace;
- thin technical rules, uppercase utility labels, and compact metadata;
- dimensional objects and motion as storytelling devices;
- confident, short copy rather than dense marketing paragraphs.

### What we do not copy

monvault. must be recognizably its own product. Do not copy:

- Monad’s logo, diamond symbol, navigation structure, page composition, or copy;
- exact 3D objects or scene layouts;
- promotional bars, ecosystem sections, or token-focused content;
- decorative interaction that competes with wallet confirmation or transaction status.

The reference is a visual standard, not a template.

---

## 3. Brand assets

### Naming

- Display name: **monvault.**
- Sentence start: **monvault.** remains lowercase.
- Code identifiers and packages: `monvault`.
- Solidity contract: `MonVaultEscrow`.
- Environment variables: `MONVAULT`.

### Asset inventory

| Asset | Purpose | Rule |
| --- | --- | --- |
| `assets/brand/monvault-logo.png` | untouched supplied source | never edit or overwrite |
| `assets/brand/monvault-lockup.png` | working web lockup derivative | light backgrounds only until transparency is available |
| `assets/brand/monvault-mark.png` | working symbol derivative | light backgrounds only until transparency is available |
| `apps/web/public/brand/*` | browser-delivered copies | keep in sync with approved derivatives |

The supplied PNG is an opaque RGB image with a white background. It is not suitable for arbitrary dark surfaces or as a production favicon. Before final launch, request/export transparent SVG or transparent PNG versions of:

1. the symbol;
2. symbol + `monvault.` wordmark;
3. full lockup with tagline, for presentation use only.

Until then:

- place the image only on white or `--surface-canvas`;
- never invert, recolor, stretch, or mask it;
- preserve its original aspect ratio;
- do not redraw the symbol in CSS.

### Clear space

Keep clear space around the symbol equal to at least one quarter of the symbol’s width. The header lockup should visually occupy 112–144 px width on desktop and 104–120 px on mobile.

---

## 4. Typography

The exact Monad site font pairing was verified from live font metadata rather than inferred visually.

### Families

```css
--font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
```

Both are variable open-source families licensed under SIL OFL 1.1. Self-host them to avoid runtime third-party requests and to make builds deterministic. Keep the license notice with vendored font files.

### Roles

| Role | Family | Weight | Desktop size | Mobile size | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| Display hero | Inter | 560–650 | `clamp(4rem, 8vw, 8.5rem)` | `clamp(3rem, 15vw, 5.2rem)` | tight leading, max 9–11 words |
| Section title | Inter | 560–650 | 48–72 px | 36–48 px | `-0.04em` tracking |
| Page title | Inter | 600 | 40–56 px | 32–40 px | one clear action context |
| Body large | Inter | 400–500 | 20–24 px | 18–20 px | 1.45–1.6 line height |
| Body | Inter | 400–500 | 16–18 px | 16 px | max 68 characters per line |
| Button | Inter | 600 | 15–16 px | 15–16 px | sentence case |
| Utility label | Roboto Mono | 500–600 | 11–13 px | 11–12 px | uppercase, `0.08em` tracking |
| Address/hash | Roboto Mono | 450–550 | 12–14 px | 12–13 px | truncate visually, copy full value |
| Amount/status | Roboto Mono | 550–650 | 14–18 px | 14–16 px | tabular numerals |

### Rules

- Use Inter for reading and hierarchy; use Roboto Mono only where precision or system state matters.
- Avoid ultra-thin text. Minimum body weight is 400.
- Never set long paragraphs in all caps or mono.
- Use `font-variant-numeric: tabular-nums` for timers and amounts.
- Keep hero copy left-aligned on desktop and mobile.

---

## 5. Color system

No new CSS gradients. The supplied logo may retain its embedded gradient artwork. Dimensional scenes use solid materials, lighting, shadow, and perspective—not gradient-filled interface panels.

### Core tokens

```css
--ink-950: #100B2B;
--ink-800: #241B52;
--ink-600: #554B78;
--surface-canvas: #FBFAFF;
--surface-raised: #FFFFFF;
--surface-muted: #F0EDFA;
--line-subtle: #DED9EE;
--violet-700: #4C22D4;
--violet-600: #6738F2;
--violet-500: #8057FF;
--lilac-300: #C7B4FF;
--lilac-150: #E8E0FF;
--night-950: #120A32;
--success-700: #167451;
--success-100: #DDF6EA;
--warning-700: #8A5200;
--warning-100: #FFF0C7;
--danger-700: #A6324A;
--danger-100: #FFE3E8;
--info-700: #2859A6;
--info-100: #E2EEFF;
```

These are working implementation tokens sampled to harmonize with the submitted mark. Fine-tune only through visual QA, and update this file and code together.

### Usage ratio

- 70% light canvas and white surfaces;
- 20% deep ink/night typography and structural areas;
- 10% violet/lilac accent and state color.

### State meaning

- Violet: active, connected, selected, in escrow.
- Green: confirmed release/completed.
- Amber: time-sensitive review/timeout.
- Red: dispute/destructive or irreversible warning.
- Blue: neutral information/explorer proof.

Never communicate state by color alone. Pair color with an icon, label, and plain-language status.

---

## 6. Layout and spacing

### Grid

- Desktop content max width: `1440px`.
- Reading/content max width: `1180px`.
- Horizontal gutters: 72 px desktop, 40 px tablet, 20 px mobile.
- Main grid: 12 columns desktop, 8 tablet, 4 mobile.
- Section spacing: 144–192 px desktop, 88–120 px mobile.

### Spacing scale

Use an 8 px base with intentional 4 px exceptions:

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`

### Shape language

- Primary cards: 20–28 px radius.
- Small controls: 10–14 px radius.
- Pills only for compact status/filter controls—not every button.
- Borders: 1 px neutral line; 2 px only for selected/critical focus.
- Shadows: broad, low-opacity, violet-neutral; never glossy skeuomorphic panels.

Avoid a dashboard made of identical floating cards. Use cards only to group actionable or stateful information.

---

## 7. Dimensional design system

### Hero object: the escrow vault

Create an original 3D composition made of:

1. an open, solid-violet vault/ring representing the contract;
2. a MON token-like disc represented generically—do not reproduce Monad’s logo;
3. three physical paths labelled **Confirm**, **Timeout**, and **Dispute**;
4. a suspended package block moving from buyer side to seller side.

The object explains the state machine, not just decoration.

### Implementation preference

1. Prefer a lightweight WebGL/canvas scene only for the homepage hero if it stays within the performance budget.
2. Use CSS 3D transforms or a compressed static WebP/AVIF fallback for low-power devices.
3. Never require the scene to understand or operate checkout.
4. Pause animation when off-screen or when the tab is hidden.
5. Provide a non-animated version under `prefers-reduced-motion: reduce`.

### Surface treatment

- Solid-color materials with soft directional lighting.
- Subtle translucent panes only where text contrast remains AA.
- One dominant object per section.
- No decorative 3D on checkout confirmation modals, error states, or transaction approval steps.

### Motion

| Interaction | Duration | Behavior |
| --- | ---: | --- |
| Hover/press | 120–180 ms | small translate/scale, no bounce |
| Card reveal | 280–420 ms | opacity + 12–20 px translation |
| Route/state transition | 220–320 ms | crossfade/slide only |
| Escrow flow scene | 8–12 s loop | slow, readable, pauses on interaction |
| Countdown update | 1 s | digits update without layout shift |

Use spring motion only for the hero object or drag-like educational interactions. Wallet and transaction states should feel deterministic.

---

## 8. Core components

### Header

- Left: monvault. symbol + wordmark.
- Center/right: Shop, How it works, Architecture, Seller view.
- Final action: **Connect wallet**.
- On scroll: compact white surface with 1 px bottom border; no heavy blur.
- Mobile: logo, wallet state, menu button. Keep wallet address out of the primary header when space is tight.

### Buttons

- Primary: solid `--violet-600`, white text, 12 px radius.
- Secondary: white/transparent, 1 px `--ink-950` border.
- Quiet: text/icon only.
- Destructive/dispute: light danger surface + dark danger text; require explicit confirmation.
- Minimum target: 44 × 44 px.
- Disabled means unavailable; pending means busy with spinner and stable label width.

### Status chip

Compact mono label with icon and plain text. Examples:

- `FUNDS SECURED`
- `SELLER SHIPPED`
- `04:32 TO REVIEW`
- `DISPUTE OPEN`
- `SELLER PAID`

### Transaction proof

Display:

- shortened transaction hash;
- explorer link with external-link icon;
- network label `MONAD TESTNET`;
- confirmation/pending/failure state;
- copy action with accessible feedback.

### Escrow timeline

A vertical timeline on mobile and horizontal timeline on wide screens:

1. Buyer paid
2. Funds locked
3. Seller shipped
4. Buyer review
5. Seller paid / dispute open

Past, current, and future steps must be visually distinct. The current step includes the next permitted action and who can take it.

### Product cards

- Product visual occupies 55–65% of card height.
- Show product name, seller, price in test MON, and one action.
- Optional 3D hover tilt: max 3 degrees and disabled on touch/reduced motion.
- Never put escrow legal copy inside every product card.

### Wallet confirmation panel

Before any write transaction show:

- action name;
- amount;
- seller/recipient;
- network;
- what the contract changes;
- whether funds can still be disputed/claimed;
- a clear **Confirm in wallet** state after user initiation.

---

## 9. Page blueprints

### `/` — portfolio homepage

1. **Hero:** “Buy with confidence. Pay when delivery is confirmed.” Primary CTA **Try the testnet shop**; secondary **See how escrow works**. Hero object visualizes funds entering the vault.
2. **Trust gap:** buyer and seller concerns shown as one tension, not two feature cards.
3. **Five-step flow:** pay → lock → ship → review → release/dispute. Scroll progress animates the path.
4. **Interactive proof:** sample order state with amount, contract status, and explorer affordance.
5. **Architecture:** frontend, private off-chain details, and Monad contract boundaries.
6. **Three outcomes:** confirmation, timeout, dispute—equal visual importance.
7. **Honest limitations:** physical delivery and dispute resolution caveat.
8. **Team and repository:** Salik, Fahad, source, contract, roadmap.
9. **Final CTA:** enter shop or inspect contract.

Do not expose implementation jargon in the hero. Technical detail begins after the product value is clear.

### `/shop`

Editorial catalog grid with a short “Escrow on every demo order” explainer. Keep filtering minimal for the seeded catalog.

### `/products/[slug]`

Two-column desktop composition: product visual, then purchase/escrow summary. Mobile order: product, price, seller, escrow explanation, action.

### `/cart`

One-seller MVP boundary must be visible. Show test MON subtotal and a compact escrow lifecycle preview. No fake shipping estimates.

### `/checkout`

Use a calm, focused layout. The order summary and wallet action remain visible together on desktop. Separate private delivery details from public on-chain fields. Explicitly state what will and will not be public.

### `/orders/[id]`

Status-first page. Show the timeline, countdown, valid actions for the connected wallet, and transaction proof. Never show success until a transaction receipt confirms it.

### `/seller/orders`

Professional operations view, not a consumer storefront. Prioritize paid amount, buyer/order reference, chain status, shipping action, review deadline, and release state. Hide buyer private data unless the off-chain demo store explicitly provides it.

---

## 10. Content and microcopy

### Voice

- concise, direct, and reassuring;
- explain the rule before asking for a wallet signature;
- use human status language, then expose technical proof;
- avoid crypto hype, fear language, and absolute security claims.

### Approved status copy

| Contract state | Primary copy | Supporting copy |
| --- | --- | --- |
| `PAID` | Funds secured in escrow | The seller can ship, but cannot receive payment yet. |
| `SHIPPED` | Seller shipped your order | Confirm delivery or open a dispute before the review timer ends. |
| `COMPLETED` | Seller paid | Payment was released by buyer confirmation or the review timeout. |
| `DISPUTED` | Dispute open | Funds remain locked; automated payout is disabled. |

### Errors

Say what happened, whether funds moved, and what the person can do next. Preserve the explorer link when a transaction exists. Never reduce a contract revert to “Something went wrong.”

---

## 11. Accessibility

- Meet WCAG 2.2 AA contrast for text, controls, and focus indicators.
- Every interactive element works with keyboard only.
- Use visible `:focus-visible` outlines; never remove focus without an equivalent.
- Provide text alternatives for architecture and 3D scenes.
- Ensure status announcements use an `aria-live` region without repeating every block confirmation.
- Respect `prefers-reduced-motion` and `prefers-contrast`.
- Do not hide transaction-critical content inside hover states.
- Keep timer meaning available as text, not only a changing number.
- Test at 200% zoom and 320 px viewport width.

---

## 12. Responsive behavior

- The product flow changes from horizontal to vertical below 768 px.
- Sticky panels become normal document flow on small screens.
- Tables become labelled order cards; do not force horizontal scrolling for core actions.
- 3D scenes reduce detail below 768 px and become static below the performance threshold.
- Preserve action hierarchy; do not move **Open dispute** into an overflow menu.

Reference widths for QA: 320, 375, 768, 1024, 1280, 1440, and 1728 px.

---

## 13. Performance budget

- Initial route JavaScript target: under 180 KB compressed before wallet libraries.
- Homepage 3D code must load after primary content and be route-scoped.
- Hero image/scene fallback: under 350 KB where practical.
- Product media: AVIF/WebP with explicit dimensions.
- Self-host only the required font subsets; preload Inter normal and defer Roboto Mono if possible.
- Maintain Core Web Vitals: LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a representative mid-range device.

A static, fast scene is better than a sophisticated scene that delays the shop or wallet flow.

---

## 14. Design-to-code conventions

- Define tokens in `apps/web/src/app/globals.css`; components consume tokens rather than raw brand hex values.
- Keep page-specific presentation near the page/component, not in one global stylesheet.
- Use semantic HTML before custom ARIA.
- Treat contract state as the source of truth; design components accept normalized state and callbacks.
- Build shared primitives for button, status chip, transaction proof, order timeline, countdown, and surface.
- Document any intentional exception to this file in the pull request.

---

## 15. Acceptance checklist

A page is design-complete only when:

- [ ] it uses the approved monvault. name and supplied brand assets correctly;
- [ ] Inter and Roboto Mono roles match this specification;
- [ ] no unapproved gradient UI treatment was added;
- [ ] desktop and mobile layouts are deliberate, not merely collapsed;
- [ ] loading, empty, pending, success, error, and wrong-wallet states exist where relevant;
- [ ] wallet writes explain the action before the signature request;
- [ ] status reflects confirmed chain state rather than optimistic copy;
- [ ] colors, motion, and 3D remain accessible and optional;
- [ ] no claim exceeds what the escrow contract actually enforces;
- [ ] lint, typecheck, production build, keyboard review, and responsive review pass.

---

## 16. Reference provenance

- Visual reference reviewed: `https://monad.xyz` on 2026-10-22.
- Primary font metadata confirmed from the site’s served WOFF2 files: Inter variable.
- Utility font metadata confirmed from the site’s served WOFF2 files: Roboto Mono variable.
- Font licenses: SIL Open Font License 1.1.
- monvault. logo supplied by Salik; source retained unchanged in the repository.

If the reference site changes, do not silently follow it. This file remains the monvault. source of truth until deliberately revised.
