# ADR-0007: Guest-First Geometry Workspace and Real-time Classroom Collaboration Architecture

## Status
Accepted

## Context
Initial implementation of CH EdTech presented a static presentation website with a mock student dashboard and a pre-rendered 3D spinning cone/box. This failed to deliver the core product vision: an interactive digital geometry teaching board and collaborative classroom platform. Unauthenticated visitors were shown fake personal student assignments, and there was no way to actually construct geometric models from points, lines, or freehand drawing.

## Decision
1. **Guest-First Policy:**
   - Unauthenticated visitors have full, unhindered access to the core digital geometry board (`/workspace`), 2D/3D drawing tools, measurement tools, and public lesson demonstrations.
   - No mock private data (fake homework, fake grades) will be displayed to guests.
   - Private portals (`/student`, `/teacher`, `/admin`) are strictly protected by client-side Route Guards and server-side Spring Security role verification (`ROLE_STUDENT`, `ROLE_TEACHER`, `ROLE_ADMIN`).
   - Logging in unlocks persistent cloud storage of drawings, classroom creation/joining, assignment submissions, and real-time collaboration.

2. **CH Geometry Workspace:**
   - Eliminate auto-rotation completely. Camera rotation, panning, and zooming are controlled manually by user gestures (OrbitControls).
   - Provide two distinct operational modes: **Draw Mode** (placing points, lines, segments, polygons, 3D solids, freehand pen) and **View/Orbit Mode** (navigating camera, view presets).
   - Store drawing models as structured entity lists (`DrawingDocument`), serializable to JSON, capturing points, segments, solids, labels, colors, opacity, and camera state.

3. **Classroom Collaboration & Real-time Synchronization:**
   - Classrooms are created by teachers on the backend, generating an unguessable 6-character alphanumeric join code (e.g., `CH-9421`).
   - Students join via code; membership is stored in `classroom_members`.
   - Real-time whiteboard synchronization uses Spring WebSocket with STOMP protocol over `/ws-geometry`.
   - Operations (`ADD_ENTITY`, `UPDATE_ENTITY`, `DELETE_ENTITY`, `CLEAR_BOARD`, `SET_PERMISSION`) are broadcast to `/topic/classroom/{classroomId}/board`.

## Consequences
- **Positive:** True educational utility, immediate engagement for visitors, clean separation of concerns, genuine real-time collaborative learning.
- **Negative:** Increased state management complexity on the frontend canvas; requires WebSocket connection handling with auto-reconnect.

