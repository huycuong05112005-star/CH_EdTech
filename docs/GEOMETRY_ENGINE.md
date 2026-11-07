# Computational Geometry Engine Specification

## 1. Decoupled Core (`packages/geometry-core`)
The geometry engine is completely independent of the rendering library. It is built as a pure TypeScript linear algebra library.

## 2. Supported Primitives
- **Vector3:** Vector arithmetic, dot product, cross product, normalization, angle calculations.
- **Point3D:** Cartesian coordinates, affine translations, midpoints, Euclidean distance.
- **Line3D:** Parametric lines, direction vectors, point projections, perpendicularity checks.
- **Plane3D:** Standard form $Ax + By + Cz + D = 0$, normal vectors, line-plane intersections, angle with lines and other planes.
- **Solid Entities:** Regular Pyramids, Cuboids, Prisms, Cones, Cylinders, Spheres with exact Volume and Surface Area formulas.

## 3. Numerical Precision
Floating point comparisons enforce an explicit tolerance threshold $\epsilon = 10^{-9}$ (`EPSILON`) to prevent rounding errors from invalidating geometric proofs.

