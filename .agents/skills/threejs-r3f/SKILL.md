# Skill: threejs-r3f

## Description
Governs 3D rendering of mathematical objects, geometry scenes, lighting, and camera controls using R3F and Drei.

## Scope & Applicability
- 3D Geometry canvas in Teacher and Student portals.
- Interactive solid manipulation, cross-section planes, and projection rays.

## Rules & Principles
1. Separate Mathematical Model from Three.js Meshes. Three.js is strictly the visual presentation layer.
2. Manage WebGL resources cleanly: dispose geometries, materials, and textures when components unmount.
3. Optimize rendering: use instanced meshes where applicable, limit dynamic shadow maps, and target stable 60 FPS.
4. Provide intuitive OrbitControls, orthographic/perspective switching, and camera reset presets.

## Checklist
- [ ] Memory leaks avoided via explicit resource disposal.
- [ ] Frame rate maintained above 60 FPS on mid-tier hardware.
- [ ] Canvas resize handled without aspect ratio distortion.
