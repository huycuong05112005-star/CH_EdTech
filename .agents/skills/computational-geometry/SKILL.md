# Skill: computational-geometry

## Description
Implements mathematically rigorous 2D and 3D geometry calculations, constraint solving, and validation.

## Scope & Applicability
- Points, lines, planes, polygons, polyhedra, intersection computation, perpendicularity, parallelism, projections.
- Decoupled packages/geometry-core library.

## Rules & Principles
1. Geometry truth is derived purely from mathematical equations, coordinate vectors, and linear algebra.
2. Never infer geometric relationships from screen rendering or visual projections.
3. Handle floating point tolerances explicitly with an epsilon threshold (e.g., EPSILON = 1e-9).
4. Validate degenerate cases (e.g. collinear points forming triangles, intersecting parallel planes).

## Checklist
- [ ] Comprehensive unit tests for vector arithmetic, dot/cross products.
- [ ] Deterministic constraint resolution.
- [ ] Serialization to and from JSON format.
