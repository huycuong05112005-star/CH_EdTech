# Skill: math-ai-agent

## Description
Designs and operates the pedagogical AI Agent capable of problem understanding, tool usage, and verification.

## Scope & Applicability
- Natural language and OCR problem parsing, step-by-step guidance, and Geometry Tool invocation.

## Rules & Principles
1. The AI Agent never hallucinates geometric coordinates; it calls explicit Geometry Tools to construct entities.
2. Workflow: Input -> Parsing -> Theorem Identification -> Geometry Construction -> Verification -> Explanation.
3. If problem formulation is ambiguous or under-constrained, ask clarifying questions instead of guessing.
4. Verify every generated solution using the Geometry Engine before presenting it to students.

## Checklist
- [ ] Tool definitions documented with typed schemas.
- [ ] Fallback handling when OCR or geometry solving encounters contradictions.
- [ ] Vietnamese pedagogical tone aligned with curriculum standards.
