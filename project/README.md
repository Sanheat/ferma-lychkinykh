# Лычкины птички — Design System

## Overview

**Brand:** Лычкины птички (Lychkin's Little Birds)  
**Company:** Ферма Лычкиных (Lychkin Family Farm)  
**Website:** https://лычкиныптички.рф/  
**Language:** Russian (ru-RU)  
**Category:** Family farm, artisan food production, poultry

> ⚠️ **Note:** The website was inaccessible during design system creation due to Cyrillic-domain restrictions. This system is built from brand inference and best-practice farm/artisan Russian branding. Please provide screenshots or a codebase export if you'd like pixel-perfect alignment.

---

## Product Context

Лычкины птички is a family-run poultry farm. The brand name literally means "Lychkin's Little Birds" — an affectionate, diminutive form that suggests warmth, care, and a close-to-nature family ethos. The likely product range includes:

- Farm-fresh eggs
- Poultry (chicken, duck, etc.)
- Artisan farm products (possibly honey, vegetables, dairy)
- Farm visits / agrotourism

The brand appeals to families seeking natural, trustworthy, locally-sourced food — an antidote to industrial production.

---

## Sources

- Website: https://лычкиныптички.рф/ (⚠️ inaccessible during build — verify visuals against live site)
- No Figma or codebase provided

---

## Content Fundamentals

### Tone & Voice
- **Warm, familial, trustworthy.** This is a family farm, not a corporation.
- **Diminutive and affectionate** forms are typical in Russian folk/family contexts (птички = little birds, not just птицы).
- **First-person plural** ("мы", "наша ферма") — "we" not "I", reinforcing family team.
- **You = "вы"** (formal respectful address) — appropriate for a small business that values customer trust.
- **No emoji** in formal product copy; possible light emoji use on social media.
- **Sentence case** for headings, not title case.
- **Exclamation marks** used warmly, not aggressively ("Попробуйте наши яйца!")
- Copy vibe: **"наша ферма", "с заботой", "натуральное", "свежее"** — keywords of authenticity.

### Example Copy Patterns
- "Яйца от наших курочек — каждый день свежие"
- "Мы выращиваем птицу с любовью и заботой"
- "Попробуйте разницу — натуральное вкуснее"
- "Ферма Лычкиных — с 2010 года"

---

## Visual Foundations

### Colors
Warm, natural farm palette:
- **Primary:** Deep terracotta / barn red — `#C0392B` area
- **Secondary:** Warm golden yellow (egg yolk, wheat) — `#E8A838`
- **Accent:** Sage/meadow green — `#7A9E7E`
- **Neutral-warm:** Cream, straw — `#F5EDD6`
- **Dark:** Deep warm brown (soil, wood) — `#3D2B1F`
- **Light bg:** Off-white with warm tint — `#FDFAF4`

See `colors_and_type.css` for all CSS variables.

### Typography
- **Display/Headings:** PT Serif — a typeface designed specifically for Russian text, giving a classic, trustworthy feel
- **Body:** PT Sans — clean, readable, designed for Cyrillic, works at all sizes
- **Accent/Labels:** Nunito — slightly rounded, friendly, good for CTAs and tags
- Both PT Serif and PT Sans are available on Google Fonts with full Cyrillic support.

### Backgrounds
- Light cream/off-white as default background — evokes paper, natural materials
- Full-bleed photography likely used in hero sections (fields, chickens, farm imagery)
- Possible subtle linen/grain texture overlays
- Section breaks using color fills (warm cream, sage green)
- No aggressive gradients — soft color washes if any

### Spacing & Layout
- Generous whitespace — artisan/premium feel
- Card-based product layouts
- Fixed header with logo left, nav right
- Mobile-first (Russian audience heavily mobile)

### Borders & Corners
- Soft rounding: `border-radius: 8–12px` for cards
- Subtle 1px borders in light warm tones
- No harsh drop shadows — prefer soft, warm box shadows (`0 2px 12px rgba(61,43,31,0.10)`)

### Animations
- Subtle fade-in on scroll
- No bounce or spring — calm, trustworthy feel
- Hover: slight lift (`translateY(-2px)`) + shadow intensification
- Button press: slight scale down (`scale(0.97)`)

### Icons
- Simple line icons (no heavy fills) — suggest Heroicons or a custom thin-stroke set
- No emoji in product UI
- Bird/egg/leaf motifs where decorative icons used

### Imagery
- Warm color grading — golden hour photography
- Real farm photography preferred over stock
- Grain/texture overlays at low opacity for authenticity feel

---

## Iconography

No icon font or SVG sprite was found (website inaccessible). Based on brand context:
- **Style:** Simple thin-stroke line icons
- **Motifs:** bird, egg, leaf, sun, house/barn
- **Recommended CDN:** Heroicons (https://heroicons.com) — thin stroke, clean
- **Assets:** See `assets/` folder for any copied logos/illustrations
- ⚠️ No icons could be extracted from the live site — please provide icon assets

---

## File Index

```
README.md                    ← This file
SKILL.md                     ← Agent skill definition
colors_and_type.css          ← CSS variables: colors, type, spacing, tokens
assets/
  logo-placeholder.svg       ← Logo placeholder (replace with real asset)
preview/
  colors-primary.html        ← Primary color swatches
  colors-neutral.html        ← Neutral/background colors
  colors-semantic.html       ← Semantic color roles
  type-display.html          ← Display / heading type specimens
  type-body.html             ← Body / UI type specimens
  spacing-tokens.html        ← Spacing & border radius tokens
  shadows.html               ← Shadow system
  btn-primary.html           ← Primary button states
  btn-secondary.html         ← Secondary & ghost buttons
  cards.html                 ← Product card component
  badges.html                ← Tags, badges, labels
  form-inputs.html           ← Input fields & form elements
  logo-brand.html            ← Logo & brand mark
ui_kits/
  website/
    README.md                ← Website UI kit notes
    index.html               ← Interactive website prototype
    Header.jsx               ← Site header component
    Hero.jsx                 ← Hero section
    ProductCard.jsx          ← Product card
    Footer.jsx               ← Footer
```
