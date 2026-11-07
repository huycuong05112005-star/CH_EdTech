# Skill: i18n-localization

## Description
Manages seamless bilingual support (Vietnamese default, English secondary) across all user portals.

## Scope & Applicability
- eact-i18next namespaces, translation JSON dictionaries, and backend localized error messages.

## Rules & Principles
1. Default language is Vietnamese (i). Instant locale toggle to English (en) without page reload.
2. Never hardcode UI strings in JSX/TSX. Use structured translation keys (common.*, geometry.*, uth.*).
3. Mathematical notation follows international ISO standards (e.g. $\Delta ABC$, $\pi$, $\vec{u}$).
4. The AI Agent must detect and respond in the language selected by the active user.

## Checklist
- [ ] Translation dictionaries synchronized between i and en.
- [ ] Fallback language configured to i.
- [ ] Mathematical equations render identically across both languages.
