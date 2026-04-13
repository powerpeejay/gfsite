# Accessibility Checklist (WCAG 2.2 AA / BFSG)

Germany's BFSG (Barrierefreiheitsstärkungsgesetz) enforces the European Accessibility Act since June 2025. WCAG 2.2 Level AA is the target standard.

## Perceivable
- All images have meaningful `alt` text (decorative images: `alt=""`)
- Color contrast: 4.5:1 minimum for normal text, 3:1 for large text (18px+ bold or 24px+)
- UI component contrast: 3:1 against adjacent colors (borders, icons, form fields)
- Information never conveyed by color alone — use icons, text, or patterns as backup
- Video/audio: captions or transcript provided

## Operable
- Full keyboard navigation: every interactive element reachable via Tab, operable via Enter/Space
- Visible focus indicator on all focusable elements — never `outline: none` without replacement
- Focus order matches visual reading order
- No keyboard traps — user can always Tab away
- Skip-to-content link as first focusable element
- Touch targets minimum 24×24px (WCAG 2.2), prefer 44×44px
- No content that flashes more than 3 times per second

## Understandable
- `<html lang="de">` set correctly (already in SEO checklist)
- Form inputs have visible `<label>` elements (not just placeholder text)
- Error messages identify the field and describe how to fix the error
- Consistent navigation across pages
- No unexpected context changes on focus or input

## Robust
- Valid, semantic HTML — use `<button>` for actions, `<a>` for navigation
- ARIA only when native HTML cannot express the role — prefer native elements
- Custom components have correct `role`, `aria-label`, and keyboard support
- Test with screen reader (VoiceOver or NVDA) before final delivery

## Quick Automated Test
- Run axe DevTools or Lighthouse Accessibility audit — fix all critical/serious issues
- Check with browser zoom at 200% — layout must remain usable
- Tab through entire page — verify logical order and visible focus
