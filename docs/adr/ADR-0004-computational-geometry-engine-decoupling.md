# ADR-0004: Decoupling Computational Geometry Engine from 3D Rendering

## Status
Accepted

## Context
Geometric truths (such as perpendicularity, planarity, intersections, and volume) must never be deduced from screen rendering or 2D camera projections. Floating-point camera matrices introduce visual distortion and perspective inaccuracies.

## Decision
Build packages/geometry-core as an independent TypeScript mathematical library implementing pure linear algebra, affine coordinates, exact vector arithmetic, and constraint solving with explicit epsilon tolerances (1e-9). Three.js / WebGL acts strictly as the visual rendering projection layer.

## Consequences
- **Positive:** Mathematically verifiable proofs, headless automated testing, deterministic constraint validation, reusable across frontend and AI tool executors.
- **Negative:** Dual representation: one mathematical model and one rendering scene graph.
