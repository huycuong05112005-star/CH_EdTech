# Mathematical AI Agent Architecture

## 1. Pipeline Overview
1. **Input Ingestion:** Accepts text problem statements, PDF lesson plans, and textbook images.
2. **OCR & Parsing:** Extracts mathematical propositions, constraints, and question requirements.
3. **Geometric Planning:** Identifies points, lines, planes, and solid shapes.
4. **Tool Execution:** Calls deterministic Geometry Tools (create_point, create_line, create_plane, calculate_volume, alidate_geometry).
5. **Mathematical Verification:** The Geometry Engine checks whether calculated relations hold true before presenting them to the student.
6. **Step-by-Step Explanation:** Generates pedagogical Vietnamese explanations formatted in KaTeX LaTeX.
