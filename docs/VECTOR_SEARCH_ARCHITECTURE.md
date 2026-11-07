# Vector Search Architecture & pgvector Integration

## 1. Objectives
Enable semantic retrieval of mathematical theorems, curriculum syllabi, and solved geometry examples to feed the AI Agent RAG pipeline.

## 2. Technical Specs
- **Database Extension:** pgvector (version 0.8.7 confirmed)
- **Embedding Model:** 	ext-embedding-3-small
- **Embedding Dimensions:** 1536
- **Index Type:** HNSW (Hierarchical Navigable Small World) with ector_cosine_ops
- **Configuration:** m = 16, ef_construction = 64

## 3. Security & Access Control in RAG
Every vector retrieval query combines cosine similarity with role and tenant filters:
`sql
SELECT c.id, c.content, 1 - (c.embedding <=> :query_vector) AS similarity
FROM document_chunks c
JOIN knowledge_documents d ON c.document_id = d.id
WHERE d.visibility = 'PUBLIC' OR (d.visibility = 'TEACHER_ONLY' AND :user_role IN ('ROLE_ADMIN', 'ROLE_TEACHER'))
ORDER BY c.embedding <=> :query_vector ASC
LIMIT 5;
`
"@

    "docs\GEOMETRY_ENGINE.md" = @"
# Computational Geometry Engine Specification

## 1. Decoupled Core (packages/geometry-core)
The geometry engine is completely independent of the rendering library. It is built as a pure TypeScript linear algebra library.

## 2. Supported Primitives
- **Vector3:** Vector arithmetic, dot product, cross product, normalization, angle calculations.
- **Point3D:** Cartesian coordinates, affine translations, midpoints, Euclidean distance.
- **Line3D:** Parametric lines, direction vectors, point projections, perpendicularity checks.
- **Plane3D:** Standard form  + By + Cz + D = 0$, normal vectors, line-plane intersections, angle with lines and other planes.
- **Solid Entities:** Regular Pyramids, Cuboids, Prisms, Cones, Cylinders, Spheres with exact Volume and Surface Area formulas.

## 3. Numerical Precision
Floating point comparisons enforce an explicit tolerance threshold $\epsilon = 10^{-9}$ (EPSILON) to prevent rounding errors from invalidating geometric proofs.
