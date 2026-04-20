# GEO Audit Report: GamePulse

**Audit Date:** 2026-04-20
**URL:** http://localhost:3000
**Business Type:** Publisher (Gaming Business News)
**Pages Analyzed:** 22 (1 homepage, 8 story pages, 12 stock pages, 1 dashboard)

---

## Executive Summary

**Overall GEO Score: 16/100 (Critical)**

GamePulse has strong server-side rendering and clean content structure, but is currently invisible to AI systems due to zero structured data, missing crawler directives, identical metadata across all pages, and no author attribution. The site needs foundational GEO infrastructure before it can be discovered, cited, or recommended by any AI platform.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 28/100 | 25% | 7.0 |
| Brand Authority | 5/100 | 20% | 1.0 |
| Content E-E-A-T | 12/100 | 20% | 2.4 |
| Technical GEO | 32/100 | 15% | 4.8 |
| Schema & Structured Data | 2/100 | 10% | 0.2 |
| Platform Optimization | 4/100 | 10% | 0.4 |
| **Overall GEO Score** | | | **15.8/100** |

---

## Critical Issues (Fix Immediately)

1. **No robots.txt** — AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot) have no guidance on what to crawl. Returns 404.
   - **Fix:** Create `/public/robots.txt` allowing all crawlers, pointing to sitemap.

2. **No sitemap.xml** — Search engines and AI systems cannot discover pages. Returns 404.
   - **Fix:** Use `next-sitemap` or manual sitemap generation listing all story, stock, and section pages.

3. **No llms.txt** — AI agents have no machine-readable site description. Returns 404.
   - **Fix:** Create `/public/llms.txt` describing the site's purpose, key sections, and content types.

4. **Zero structured data (JSON-LD)** — No schema.org markup on any page. Google AI Overviews, ChatGPT, and Perplexity cannot identify content types.
   - **Fix:** Add Organization schema to homepage, NewsArticle schema to story pages, FinancialProduct or custom schema to stock pages.

5. **All pages share identical metadata** — Every page has the same `<title>` and `<meta description>`. AI systems cannot distinguish between pages.
   - **Fix:** Use Next.js `generateMetadata` to create unique title/description per page.

6. **No author attribution** — Zero bylines, author pages, or author bios anywhere. E-E-A-T is fundamentally broken.
   - **Fix:** Add an author name and bio to each article, even if it's "GamePulse AI" with a description of the editorial process.

---

## High Priority Issues

1. **No Open Graph or Twitter Card tags** — Content shared on social platforms or cited by AI has no preview metadata.
2. **No canonical URLs** — Risk of duplicate content issues across routes.
3. **No About page** — No way for AI or users to understand who runs the publication.
4. **Article body is placeholder text** — Story detail pages have filler paragraphs, not real journalism.
5. **No machine-readable dates** — Publication dates lack `<time datetime="ISO8601">` attributes.
6. **No per-page structured metadata** — Stock pages, story pages, and dashboard all share homepage metadata.

---

## Medium Priority Issues

1. **No FAQ sections or key takeaway blocks** — Reduces quotability for AI snippet extraction.
2. **Source citations not prominently displayed** — Original source links exist in data but aren't shown as formal citations.
3. **Stock data not semantic** — Financial data is rendered as plain text, not structured for extraction.
4. **Tweet quotes not structured** — Social proof content lacks schema markup.
5. **No RSS feed** — Limits syndication and AI training data ingestion.
6. **No speakable schema** — Voice assistant optimization is absent.
7. **No security headers** — Missing HSTS, CSP, X-Frame-Options.

---

## Low Priority Issues

1. Social media profiles link to generic x.com, not a real account.
2. No presence on Wikipedia, Reddit, LinkedIn, or YouTube.
3. No `sameAs` links for entity disambiguation.
4. No data tables or structured comparison content.
5. No BreadcrumbList schema for navigation context.

---

## Category Deep Dives

### AI Citability (28/100)

**Strengths:** Content is server-side rendered (accessible to crawlers), headlines are clear and descriptive, story summaries are well-written and extractable.

**Weaknesses:** No structured quotable blocks (key takeaways, TL;DR sections), no FAQ content, no comparison tables. Stock data is visually formatted but not semantically structured. AI systems can see the text but have no structured signals to identify what's worth citing.

### Brand Authority (5/100)

GamePulse is a brand-new entity with zero external footprint. No Wikipedia article, no Reddit mentions, no YouTube channel, no LinkedIn page. AI models have no training data about this brand. The newsletter subscriber count claim ("2,400+") provides some social proof but is unverifiable.

### Content E-E-A-T (12/100)

**Critical gap:** No author attribution anywhere. No "About" page. No editorial standards. No team page. Article bodies contain placeholder filler text rather than real analysis. Source citations exist in the data model but aren't prominently displayed. Publication dates are shown but not in machine-readable format.

### Technical GEO (32/100)

**Strengths:** SSG/SSR via Next.js (content is in HTML, not client-only JS), responsive images via `next/image`, mobile-responsive layout, fast page loads.

**Weaknesses:** No robots.txt, no sitemap.xml, no llms.txt, no canonical URLs, no Open Graph tags, no Twitter Cards, no security headers. The technical foundation (Next.js SSR) is solid, but all the crawler-facing infrastructure is missing.

### Schema & Structured Data (2/100)

Complete absence. Zero JSON-LD. Zero microdata. Zero RDFa. No Organization, no NewsArticle, no Person, no BreadcrumbList, no FAQPage. This is the single biggest gap — without structured data, AI systems cannot classify or cite the content.

### Platform Optimization (4/100)

No optimization for any AI platform. No structured data for Google AI Overviews. No FAQ schema for featured snippets. No speakable markup. No content formatted for Perplexity's citation model. The only positive is that SSR ensures content is accessible if platforms do find it.

---

## Quick Wins (Implement This Week)

1. **Add robots.txt, sitemap.xml, and llms.txt** to `/public` — unblocks all crawler discovery. (Effort: 1 hour, Impact: Critical)

2. **Add per-page metadata via `generateMetadata`** — unique title, description, OG tags, and canonical per story/stock page. (Effort: 2 hours, Impact: High)

3. **Add NewsArticle JSON-LD to story pages** — headline, datePublished, author, publisher, image. Directly enables Google AI Overviews and Perplexity citation. (Effort: 3 hours, Impact: Critical)

4. **Add Organization JSON-LD to the homepage** — name, URL, logo, description, sameAs array. Begins entity establishment. (Effort: 30 min, Impact: High)

5. **Add author names and `<time datetime>` to articles** — even "GamePulse Editorial" with a bio stub + ISO dates lifts E-E-A-T. (Effort: 1 hour, Impact: High)

---

## 30-Day Action Plan

### Week 1: Crawler Infrastructure
- [ ] Create robots.txt with full crawler access + sitemap reference
- [ ] Generate sitemap.xml covering all story and stock pages
- [ ] Create llms.txt with site description and key page listings
- [ ] Add per-page metadata (title, description, canonical, OG, Twitter Cards)

### Week 2: Structured Data
- [ ] Add Organization JSON-LD to homepage
- [ ] Add NewsArticle JSON-LD to all story pages
- [ ] Add BreadcrumbList schema sitewide
- [ ] Add FinancialQuote or custom schema to stock pages

### Week 3: E-E-A-T Signals
- [ ] Create About page with editorial mission, team info, methodology
- [ ] Add author attribution to stories (name, bio, linked profile)
- [ ] Add machine-readable `<time datetime>` to all publication dates
- [ ] Replace placeholder article body text with real content descriptions

### Week 4: Platform & Brand
- [ ] Set up real X/Twitter account, link via sameAs
- [ ] Add RSS feed endpoint
- [ ] Create FAQ sections on key topic pages
- [ ] Add "Key Takeaways" summary blocks to story pages for AI extraction
- [ ] Submit site to Google Search Console and Bing Webmaster Tools

---

## Appendix: Pages Analyzed

| URL | Title | GEO Issues |
|---|---|---|
| / | GamePulse - Gaming Industry Business Intelligence | 8 (no unique meta, no schema, no OG) |
| /story/1 | Same as homepage | 10 (no article schema, no author, no unique title) |
| /story/2 | Same as homepage | 10 |
| /story/3-8 | Same as homepage | 10 each |
| /stocks/ntdoy | Same as homepage | 8 (no financial schema, no unique meta) |
| /stocks/sony | Same as homepage | 8 |
| /stocks/* (10 more) | Same as homepage | 8 each |
| /dashboard | Same as homepage | 4 (internal tool, lower priority) |
