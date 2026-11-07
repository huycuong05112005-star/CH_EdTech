# Experiment & Benchmark Log

## Experiment 01: pgvector Distance Search
- **Environment:** Docker container ch_edtech_postgres (pgvector/pgvector:pg16).
- **Test:** Inserted 3D coordinate vectors and queried Euclidean L2 distance <-> ordered by ascending similarity.
- **Result:** Successfully returned ranked geometric entities in 0.8ms.

## Experiment 02: Geometry Engine Volume Calculation
- **Model:** Pyramid S.ABC with base vertices 0 0 0$, 3 0 0$, 0 4 0$ and apex 0 0 5$.
- **Calculation:** Base Area $= 6.0$, Height $= 5.0$, Volume $= \frac{1}{3} \times 6 \times 5 = 10.0$.
- **Result:** Unit test passed in 0.23ms.
