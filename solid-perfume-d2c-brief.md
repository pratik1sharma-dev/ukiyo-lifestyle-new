## Implementation Status

- **Home (hero + USPs + social proof + quiz CTA)**: Completed
- **Navigation (desktop + mobile USPs + “Ships in 24 hrs”)**: Completed
- **Category/PLP**: Completed UI (filters for Note Family, Intensity, Occasion, Weather; Sort; Cards with badges, Quick Add; Empty state; PLP title/desc). Backend filtering implemented; PLP badges now use dynamic scent/strength/tin size.
- **PDP**:
  - Completed: name, price/compare price, scent chips, strength meter with wear text, trust line, Add to Cart, Buy Now (navigates to Checkout), Scent pyramid, Why solid perfume, Longevity & climate, Ingredients & safety, Size & packaging, Shipping & returns (Delhi default), reviews/Q&A placeholder.
  - Pending: reviews & Q&A data model + UI, optional description opener copy, optional “You save ₹X (Y%)” string.
- **Data model**: Implemented optional fragrance fields in backend schema and exposed via APIs; frontend type aligned. Admin create/update supports setting all fields (CSV/JSON for arrays; JSON for notes; booleans supported).
- **Discovery & Bundles**: Pages present with correct messaging (Discovery Kit includes ₹299 redeem copy; Bundles includes duo/trio). Pending: duo/trio bundle builder, automatic discounts, gift note, tin engraving.
- **How‑to & care**: Core guidance present on PDP. Pending: optional dedicated How‑To page/section.
- **Cart/Mini‑cart**: Implemented free‑shipping progress bar (cart + mini‑cart). Pending: “Complete the set” cross‑sell, real delivery ETA by pincode service.
- **Checkout**: Razorpay integrated; trust microcopy added (secure payments, UPI fastest, GST included). Pending: confidence row block styling.
- **Policy & trust**: Pending: dedicated policy page with INCI/IFRA statements, allergen disclosure, origin/manufacturer/batch/MRP/shelf life.
- **SEO**: Pending for SPA—add per‑page titles/descriptions via `react-helmet-async` (Home/PDP templates from brief).
- **Retention & community**: Quiz page exists. Pending: email capture + scent recommendations, post‑purchase tips flow, review request prompts with fragrance‑specific fields.
- **Notes**: No breaking changes introduced; frontend build green.

### Next Actions Pointer
- Future agents: Use this file (`solid-perfume-d2c-brief.md`) for latest status and priorities. Finish items marked “Pending” above, starting with Reviews & Q&A, SEO meta, and Cart cross‑sell.

## Single‑Category D2C Brief — Solid Perfumes Only

Focus: scent discovery, confidence, low friction, and persuasive content.

## Home (single‑category hero)
- **Title**: Elevate Your Everyday Scent
- **Subtitle**: Alcohol‑free solid perfumes made in India. Pocket‑friendly, spill‑proof, travel‑ready.
- **Primary CTA**: Shop Solid Perfumes
- **Secondary CTA**: Build Your Duo & Save 10%
- **USPs bar**: Alcohol‑Free • 6–8 Hour Wear • Skin‑Safe • Travel‑Friendly • Made in India
- **Social proof**: “Loved by 25,000+ customers” + 2–3 short review badges
- **Discovery strip**: Take the 60‑Second Scent Quiz

## Navigation (keep it ultra clear)
- **Desktop**: Solid Perfumes • Discovery Kit • Bundles • Story • Support
- **Mobile menu**: Show USPs + “Ships in 24 hrs” line at the bottom

## Category/PLP (perfume‑browse patterns)
- **Filters**:
  - Note Family (Citrus, Floral, Woody, Oriental)
  - Intensity (Subtle, Everyday, Bold)
  - Occasion (Work, Day, Night, Festive)
  - Weather (Summer, Monsoon, Winter)
- **Sort**: Popular, Newest, Price ↑/↓
- **Cards**: scent family badge, strength meter, “Lasts 6–8 hrs”, “Pocket‑friendly 10g”, Quick Add
- **Empty state**: “No match? Try our Discovery Kit or the Scent Quiz.”

### Eye‑catching PLP title/desc
- **Title**: Solid Perfumes for Every Day | Alcohol‑Free, Travel‑Friendly
- **Description**: Pocket‑friendly solid perfumes designed for Indian weather. Alcohol‑free, 6–8 hr wear. Free shipping and easy returns.

## PDP (what converts for fragrance)
### Above the fold
- **Product name**: Citrus Vetiver Solid Perfume — Alcohol‑Free Balm
- **Price stack**: ₹899 • You save ₹200 (18%)
- **Scent profile chips**: Citrus • Woody • Fresh
- **Strength meter**: Everyday 6–8 hr wear
- **CTAs**: Add to Cart; Buy Now (UPI/Wallets)
- **Trust line**: Alcohol‑Free • Skin‑Safe • Travel‑Ready • Made in India

### Scent pyramid
- **Top**: Lime, Bergamot
- **Heart**: Vetiver, Neroli
- **Base**: Cedarwood, Musk

### Why solid perfume?
- Alcohol‑free, gentle on skin
- No spills, no leaks — flight and gym‑bag friendly
- Precise application on pulse points; great for layering

### Longevity & climate
- Lasts 6–8 hours on skin; reapply after 4 hours in humid weather
- Tip: Warm on fingertip, dab on wrists, neck, behind ears

### Ingredients & safety
- Beeswax/Candelilla Wax, Shea Butter, Natural Oils, IFRA‑compliant fragrance
- Vegan option available (if candelilla); cruelty‑free
- Allergen info and batch/shelf life (24 months)

### Size & packaging
- 10g tin (approx. 3–4 months of daily use)
- Leak‑proof, pocket‑friendly tin; recyclable packaging

### Shipping & returns
- Ships in 24 hrs from Delhi • Delivery in 2–5 days
- Hygiene policy: unopened Discovery Kits returnable within 10 days

### Reviews & Q&A (fragrance‑specific fields)
- Ask for Scent Family, Longevity rating, Projection rating, Climate used (Summer/Monsoon), Skin type

### PDP description opener
- Meet Citrus Vetiver, a clean, modern blend that wakes up your morning and stays close through the day. Fresh citrus brightens the first hour, settling into cool vetiver and soft woods.

## Discovery & Bundles (AOV + trial)
- **Discovery Kit (3 x 3g minis)**: “Find your signature scent — redeem ₹299 on your next full‑size.”
- **Build Your Duo/Trio**: “Layer and save 10–15%”
- **Gifting**: Gift note and tin engraving (if feasible)

## How‑to and care (education that reassures)
- **How to apply**: Swipe fingertip, warm for 2–3 seconds, dab on pulse points (wrists, neck, collarbone)
- **Reapply**: Every 4–6 hours or after workouts
- **Care**: Keep tin closed; if softened in heat, let it cool to reset. Store away from direct sun.

## Cart/Mini‑cart (nudges that fit perfume)
- **Progress bar**: ₹X away from free shipping
- **Cross‑sell**: “Complete the set” — complementary notes or best‑selling duo
- **Delivery line**: “Order today, delivery by Wed–Fri to 1100XX”

## Checkout (trust + clarity)
- **Payment copy**: Secure payments via Razorpay (UPI/Wallets/Cards)
- **Confidence block**: 10‑day returns (Discovery Kit unopened), alcohol‑free, made in India
- **Microcopy**: “UPI is the fastest way to pay.” “No hidden fees — GST included.”

## Policy and trust for fragrance
- Full INCI/IFRA compliance statements
- Allergen disclosure (limonene, linalool, etc. if present)
- Country of origin, manufacturer, batch number, MRP, shelf life

## SEO (solid‑perfume focused)
- **Home title**: Ukiyo Solid Perfumes — Alcohol‑Free, Travel‑Friendly, Made in India
- **Home description**: Pocket‑friendly solid perfumes designed for Indian weather. 6–8 hr wear, spill‑proof tins. Free shipping, easy returns.
- **PDP title**: [Scent Name] Solid Perfume | Alcohol‑Free Balm | Ukiyo
- **PDP description**: [Scent family] notes with 6–8 hr wear. Alcohol‑free, skin‑safe, travel‑friendly tin. Ships in 24 hrs from Delhi.

## Retention & community (fragrance‑specific)
- **Scent Quiz (email capture)** → recommend 2–3 scents
- **Post‑purchase flow**: wear tips (pulse points), reapply cadence, layering ideas
- **Review request** with prompts for scent family and longevity

## Eye‑catching lines you can plug in now
- **Hero**: Minimalist Luxe, Zero Alcohol
- **Subtitle**: Pocket‑friendly balms that travel with you
- **PDP trust line**: Alcohol‑Free • Skin‑Safe • 6–8 hr Wear • Travel‑Ready
- **Discovery**: Try 3 minis. Redeem on your favorite.

## Summary
- Simplified IA for a single category, perfume‑specific filters, and scent‑education content
- PDP upgraded with scent pyramid, strength meter, climate tips, ingredients, and hygiene‑aware returns
- Discovery kits, bundles, and quiz to boost conversion and AOV with ready‑to‑use titles and descriptions