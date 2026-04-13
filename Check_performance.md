# Performance Checklist

## Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s — hero image/heading must render fast
- INP (Interaction to Next Paint): < 200ms — all interactions respond instantly
- CLS (Cumulative Layout Shift): < 0.1 — no layout jumps during load

## Image Optimization
- Use WebP or AVIF with `<picture>` fallback to JPEG/PNG
- Responsive images via `srcset` + `sizes` attributes — never serve desktop images to mobile
- Explicit `width` + `height` on all `<img>` to prevent CLS
- Hero/LCP image: preload with `<link rel="preload" as="image">` — never lazy-load the LCP element
- Below-fold images: `loading="lazy"` + `decoding="async"`

## Loading Strategy
- Critical CSS inlined in `<head>`, non-critical deferred
- Scripts: `defer` or `async` — never render-blocking `<script>` in `<head>`
- Fonts: `font-display: swap` + preload primary font files
- Minimize third-party scripts — each competes for bandwidth
- No unused CSS/JS shipped to production

## Technical
- Enable gzip/brotli compression (Cloudflare handles this)
- Cache headers: static assets should have long cache TTL
- Total page weight target: < 1MB for initial load (excluding lazy-loaded content)
- Test with Lighthouse + PageSpeed Insights before final push
- Test on throttled 3G + low-end device — not just your fast machine
