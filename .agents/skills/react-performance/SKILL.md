# Skill: react-performance

## Description
Guarantees fast load times, minimal bundle size, and responsive interactions across the React frontend.

## Scope & Applicability
- pps/web Vite bundle, code splitting, memoization, and rendering optimization.

## Rules & Principles
1. Lazy load heavy components (Three.js canvas, LaTeX editor, Admin charts) using React.lazy and Suspense.
2. Avoid unnecessary re-renders in math coordinate trackers; use fine-grained Zustand selectors or refs.
3. Keep production vendor bundle optimized; disable source maps in production builds.
4. Use TanStack Query with appropriate staleTime and cacheTime to avoid redundant network requests.

## Checklist
- [ ] Initial bundle size under control with code splitting.
- [ ] No unmemoized expensive math computations in render paths.
- [ ] Virtualization for large lists and document feeds.
