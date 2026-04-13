# Technical Polish Checklist

## Favicon & Branding
- `favicon.ico` (32×32) in project root
- `apple-touch-icon.png` (180×180) linked in `<head>`
- `site.webmanifest` with name, short_name, theme_color, background_color, icons
- `<meta name="theme-color">` matching brand for mobile browser chrome

## Analytics
- Umami tracking script installed (GDPR-compliant, no cookie consent needed)
- Page views and events tracked — at minimum: form submissions, CTA clicks, phone taps
- Analytics script loaded async, never render-blocking

## Production Readiness
- All placeholder text and images replaced with real content
- Console free of errors and warnings
- All external links open in new tab with `rel="noopener noreferrer"`
- Print stylesheet or `@media print` rules — hide nav, show full URLs, clean layout
- 404 page exists with navigation back to homepage
- Form spam protection: honeypot field or basic bot detection (no CAPTCHA if avoidable)

## Social & Sharing
- Open Graph image: 1200×630px, branded, looks good when shared on WhatsApp/Facebook
- `og:locale` set to `de_DE`
- Twitter/X card meta tags if relevant to the client
