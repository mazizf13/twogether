# 13 — Open Questions, Assumptions Challenged & Product Critique

---

## Part 1: Open Questions

These questions remain unanswered and should be resolved before or during development. Some require user research; others require product decisions.

---

### OQ-01: What happens to the product after the wedding?

**The question:** The current product is entirely framed around wedding preparation. The wedding countdown ends. The checklist completes. What then?

**Why it matters:** If users churn immediately after the wedding, the product has a structural retention problem. Post-wedding couples have new financial challenges (joint accounts, shared rent/mortgage, travel savings) that are arguably more complex and ongoing than wedding planning.

**Recommendation:** Define the post-wedding product story before launch. Even if V2 features aren't built, the *promise* of a continued life-planning companion should be communicated in onboarding and marketing.

---

### OQ-02: How do we handle couples with very different incomes?

**The question:** A 50/50 split may feel fair numerically but unfair when one partner earns 3× the other. Should the product help couples think about proportional splits based on income?

**Why it matters:** This is one of the most common financial tensions in relationships. Ignoring it is a missed opportunity. Including it badly could feel judgmental.

**Recommendation:** Offer an optional "proportional split" calculator during onboarding or in settings. Let couples define their preferred default split ratio (e.g., 60/40) based on income levels. Never suggest what the right ratio is — let them decide.

---

### OQ-03: Is manual expense entry sustainable long-term?

**The question:** The product relies entirely on manual data entry. This creates friction that could kill engagement after the novelty fades.

**Why it matters:** Most finance apps that rely on manual entry see significant drop-off after 2–4 weeks. If couples stop logging, the dashboard becomes useless.

**Options:**
1. Accept manual entry + optimize for speed (quick-log, recurring templates)
2. Add receipt scanning (OCR) in V1.5
3. Add bank/e-wallet integration in V2
4. Offer "import from bank statement" (CSV upload) in V1.5

**Recommendation:** MVP focuses on making manual entry as fast as possible (under 10 seconds). V1.5 adds receipt scanning. V2 prioritizes bank integration as the highest-impact retention feature.

---

### OQ-04: What is the monetization model?

**The question:** The product has no defined revenue model in this documentation.

**Options:**
- **Freemium:** Core features free, advanced features (reports, export, premium checklist templates, bank integration) behind a paywall
- **One-time payment:** Pay once for lifetime access (simple, no recurring revenue)
- **Subscription:** Monthly/annual fee for full access
- **Marketplace commission:** Future vendor directory with booking fees
- **Completely free at MVP:** Build user base first, monetize V2

**Recommendation:** Freemium with a generous free tier. Couples should be able to use all core features for free during the MVP period. Premium tier introduced in V2 unlocks: bank sync, advanced reports, CSV export, receipt storage, and post-wedding life modules.

---

### OQ-05: How do we handle currency for international or cross-currency couples?

**The question:** Arif (Surabaya) and Sella (Amsterdam) earn in IDR and EUR respectively. The product currently treats all amounts as single-currency.

**Why it matters:** Cross-currency couples cannot accurately represent their financial reality with a single-currency system.

**Short-term answer:** Show a clear notice that the app uses a single currency (chosen at couple creation) and that amounts in other currencies should be converted manually.

**Long-term answer:** V2 multi-currency support with daily exchange rate fetching and conversion to a "base currency" for reporting.

---

### OQ-06: How should the product handle financial disagreements?

**The question:** If Partner A edits a shared expense that Partner B logged, creating a dispute — what does the product do?

**Current answer:** Audit trail preserves history; the activity feed shows the edit; either partner can re-edit.

**Unanswered:** Should there be a formal "dispute" mechanism? A flag, a comment thread on an expense, or a request for review?

**Recommendation:** Don't build a dispute resolution system in MVP. The audit trail is sufficient. If user research surfaces this as a real pain point, a lightweight "flag for review" feature can be added in V1.5.

---

### OQ-07: What is the target primary market?

**The question:** Is this product designed specifically for the Indonesian market, Southeast Asia broadly, or globally?

**Why it matters:**
- Currency formatting, date formats, and language choices
- Local payment integration for premium tier
- Cultural norms around money discussion in relationships
- Competitor landscape differs by market

**Recommendation:** Target Indonesia explicitly at MVP (IDR default, Bahasa Indonesia as optional language in V1.5). Design for cultural norms around marriage preparation (which in Indonesia often involves family contributions, large ceremonies, and strong social expectations). Expand to SEA broadly in V2.

---

### OQ-08: What happens if only one partner uses the app?

**The question:** The inviting partner uses the app daily but the other never accepts the invitation, or accepts and immediately stops using it.

**Why it matters:** A significant portion of users will likely face this. If the product is entirely unusable solo, those users churn immediately.

**Recommendation:** Ensure the product is **useful solo** for the initiating partner while in "waiting" state — they can track personal expenses, log savings contributions, and manage their checklist tasks. The value increases dramatically when both partners join, but it should not be zero until then.

---

### OQ-09: How should the onboarding handle couples who don't have a budget yet?

**The question:** Many newly engaged couples (Persona 03) have no idea what their wedding will cost. Asking for a budget number upfront creates anxiety and abandonment.

**Recommendation:** Make budget/savings target fully optional in onboarding with copy like "You can set this later — many couples figure it out as they go." Provide a budget estimator tool in V1.5 that suggests ranges based on guest count and location.

---

### OQ-10: How do we prevent one partner from feeling financially surveilled?

**The question:** Some users may feel that the shared dashboard exposes their spending habits in a way that feels controlling rather than collaborative.

**Recommendation:**
- Personal expenses are private by default (already in spec)
- Never show a combined personal + shared total that exposes private spending
- Provide clear in-app explanation of what is and isn't visible to the partner
- Add a "what your partner can see" transparency screen in settings

---

## Part 2: Assumptions Challenged

### Challenge 01: "Couples want financial transparency"

**Assumed:** Both partners are equally motivated to share financial data.  
**Reality:** In many relationships, one partner manages finances and the other is disengaged. The product should work even with asymmetric engagement.

**Implication:** Design for one-active-partner scenarios. Don't gate value behind both-partner participation beyond the initial couple setup.

---

### Challenge 02: "The checklist template covers all couples"

**Assumed:** A single default checklist template works for all couples.  
**Reality:** A Javanese traditional wedding has completely different preparation steps than a civil registry ceremony. A destination wedding has different needs than a neighborhood celebration.

**Implication:** Offer multiple checklist templates (Simple / Traditional / Destination / Grand) during onboarding, or let couples select their wedding style to get a relevant template.

---

### Challenge 03: "Both partners will log expenses equally"

**Assumed:** Expense logging will be balanced between partners.  
**Reality:** One partner (often the more financially engaged one) will do most of the logging. The other may feel guilty or disengaged.

**Implication:** The product must feel valuable even to the passive partner — perhaps through beautiful, clear dashboards that inform without requiring action.

---

### Challenge 04: "Users will self-report honest financial data"

**Assumed:** Partners will log all their real expenses.  
**Reality:** Some users may under-report personal expenses to avoid judgment from their partner. Some may exaggerate savings contributions to appear more responsible.

**Implication:** The product cannot fix dishonesty, but should not design features that incentivize it. Avoid gamification patterns that reward "winning" over a partner.

---

## Part 3: Product Critique

### Weakness 01: Post-Wedding Cliff

The product has no story after the wedding. This is the single largest structural weakness. A couple who got engaged in January, married in December, and used the app throughout that year — what reason do they have to return in January of the next year?

**Fix:** Define the post-wedding product arc in V1.5 or V2. Introduce "Life Chapters" — the wedding is Chapter 1. Home buying is Chapter 2. Family planning is Chapter 3.

---

### Weakness 02: No Feedback Loop on Financial Behavior

The app records data but doesn't help couples become better at managing money together. It's a ledger, not a coach.

**Fix:** Add insight moments — "This month you saved 20% more than last month 🎉" or "You're on track to reach your Venue goal 3 weeks ahead of schedule." These are low-cost, high-emotional-impact additions.

---

### Weakness 03: Invitation Dependency

The entire value proposition requires both partners to be active. This creates a hard dependency that competitors (who work for individuals) don't face.

**Fix:** Invest heavily in the invitation UX. Make the invitation email genuinely compelling, not transactional. Consider a "preview" that shows the invitee what the dashboard looks like with sample data — a product demo embedded in the invitation.

---

### Weakness 04: Generic Category System

The expense categories are standard (Food, Transport, etc.) and don't reflect the specific context of wedding preparation.

**Fix:** Add wedding-specific categories: Venue Deposit, Catering Tasting, Attire, Wedding Rings, Photography, Honeymoon, Invitations, Decorations. These should be the first suggestions when adding a shared expense.

---

### Weakness 05: No Social/Community Layer

Couples planning weddings seek peer input and validation ("Is Rp 50M reasonable for a Jakarta wedding?"). The product has no way to answer these questions.

**Fix (V2):** Anonymous benchmarks — "Couples with similar budgets in [city] typically spend X% on catering." No social feed, no names — just anonymous aggregated data that helps couples feel informed without feeling judged.

---

## Part 4: Differentiation Opportunities

### Opportunity 01: Make the invitation the product

The invitation experience is currently a utilitarian email. What if it was beautiful, personalized, and emotionally resonant? A partner receiving a stunning, warm "Your partner wants to plan your future together" invitation is more likely to join — and more likely to associate the product with the best moments of their relationship.

### Opportunity 02: The "Money Talk" Feature

Financial conversations in relationships are notoriously difficult. Build a guided "Money Talk" feature: a structured conversation prompt that helps couples discuss their values, spending habits, and goals. Not a tool — an experience. This differentiates Twogether from every other finance app on the market.

### Opportunity 03: Milestone Celebrations as Shareable Moments

When a couple hits their savings goal, or when the countdown hits 100 days, generate a beautiful shareable card ("We're 100 days away! 💍"). This turns product milestones into social content, creating organic discovery without a marketing budget.

### Opportunity 04: Offline-First Architecture

Most finance apps require connectivity. An offline-first PWA (with background sync) would serve couples in areas with poor connectivity and create a perception of reliability and speed.

### Opportunity 05: The "Future You" Letter

On signup, prompt each partner to write a short letter to their future married self about their hopes and financial goals. Deliver it on the wedding anniversary. This creates an emotional anchor to the product that no competitor has. It costs nearly nothing to build and creates profound loyalty.

---

## Research Needed Before V2

1. **User interviews (10–15 couples):** How do they actually manage money today? What are the real friction points?
2. **Churned user interviews (5–10):** Why did both/one partner stop using the product?
3. **Post-wedding survey:** What financial challenges do newlyweds face in months 1–12?
4. **Market sizing:** How many couples get engaged per year in the target market (Indonesia)?
5. **Competitor audit:** Detailed teardown of Honeydue, Zola, The Knot financial tools, and local alternatives.
6. **Willingness to pay research:** At what price point does a premium tier convert? What features are must-haves for payment?
