# Skill: gsap-animation

## Description
Orchestrates smooth step-by-step mathematical construction animations and UI transitions using GSAP.

## Scope & Applicability
- Step-by-step geometric proofs and construction walkthroughs.
- Interactive portal transitions and page reveals.

## Rules & Principles
1. Animations must serve pedagogical clarity (e.g. demonstrating how a plane slices a pyramid step-by-step).
2. Clean up timelines on component unmount using gsap.context().
3. Support user controls: play, pause, reverse, step forward, and speed adjustment.
4. Respect prefers-reduced-motion user preferences.

## Checklist
- [ ] Timelines cleanly killed on unmount.
- [ ] Playback scrubbing controls available for math steps.
- [ ] No layout thrashing or stutter during animations.
