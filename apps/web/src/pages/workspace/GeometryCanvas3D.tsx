import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  GeometryDocument,
  GeometryPoint,
  WorkspaceTool,
  FreehandStroke,
} from './types';

interface GeometryCanvas3DProps {
  document: GeometryDocument;
  tool: WorkspaceTool;
  activeStepId: string | null;
  selectedElementId: string | null;
  onSelectElement: (id: string | null, type?: string) => void;
  onAddPoint: (point: GeometryPoint) => void;
  onAddSegment: (p1Id: string, p2Id: string) => void;
  freehandStrokes: FreehandStroke[];
  onAddStroke: (stroke: FreehandStroke) => void;
  showGrid?: boolean;
  showAxes?: boolean;
}

export const GeometryCanvas3D: React.FC<GeometryCanvas3DProps> = ({
  document,
  tool,
  activeStepId,
  selectedElementId,
  onSelectElement,
  onAddPoint,
  onAddSegment,
  freehandStrokes,
  onAddStroke,
  showGrid = true,
  showAxes = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const freehandCanvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Groups
  const pointsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const segmentsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const polygonsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const solidsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const helpersGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Point meshes map for fast raycasting & lookups
  const pointMeshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Segment creation state: first clicked point
  const [segmentStartPointId, setSegmentStartPointId] = useState<string | null>(null);

  // 2D Projected labels for screen display
  const [projectedLabels, setProjectedLabels] = useState<
    { id: string; name: string; x: number; y: number; visible: boolean; color: string }[]
  >([]);

  // Freehand drawing state
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Determine which element IDs are visible based on step
  const visibleElementIds = React.useMemo(() => {
    if (!activeStepId) return null; // All visible
    const step = document.steps.find((s) => s.id === activeStepId);
    return step ? new Set(step.elementIds) : null;
  }, [document.steps, activeStepId]);

  // 1. Initialize Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate 900
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 6, 8);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // Needed for snapshot export!
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.5, 0);
    controls.maxDistance = 40;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.4);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Groups
    scene.add(helpersGroupRef.current);
    scene.add(polygonsGroupRef.current);
    scene.add(segmentsGroupRef.current);
    scene.add(solidsGroupRef.current);
    scene.add(pointsGroupRef.current);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Update projected 2D label positions
      updateLabels(camera, width, height);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update OrbitControls enabled state according to active tool
  useEffect(() => {
    if (!controlsRef.current) return;
    // When drawing freehand with pen, disable orbit controls so canvas gets drag events
    controlsRef.current.enabled = tool !== 'pen';
  }, [tool]);

  // Update Grid and Axes Helpers
  useEffect(() => {
    const group = helpersGroupRef.current;
    group.clear();

    if (showGrid) {
      const grid = new THREE.GridHelper(14, 14, 0x3b82f6, 0x1e293b);
      grid.position.y = 0;
      group.add(grid);
    }

    if (showAxes) {
      const axes = new THREE.AxesHelper(4);
      group.add(axes);
    }
  }, [showGrid, showAxes]);

  // Project 3D Point coordinates to 2D screen coordinates for crisp typography
  const updateLabels = (camera: THREE.PerspectiveCamera, width: number, height: number) => {
    const labels: { id: string; name: string; x: number; y: number; visible: boolean; color: string }[] = [];
    const tempVec = new THREE.Vector3();

    document.points.forEach((pt) => {
      if (visibleElementIds && !visibleElementIds.has(pt.id)) return;

      tempVec.set(pt.coords[0], pt.coords[1], pt.coords[2]);
      tempVec.project(camera);

      // Check if in front of camera
      const isVisible = tempVec.z < 1;
      const screenX = ((tempVec.x + 1) * width) / 2;
      const screenY = ((-tempVec.y + 1) * height) / 2;

      labels.push({
        id: pt.id,
        name: pt.name,
        x: screenX,
        y: screenY,
        visible: isVisible,
        color: pt.color || '#38bdf8',
      });
    });

    setProjectedLabels(labels);
  };

  // Re-build 3D Meshes whenever document or activeStepId changes
  useEffect(() => {
    const pointsGroup = pointsGroupRef.current;
    const segmentsGroup = segmentsGroupRef.current;
    const polygonsGroup = polygonsGroupRef.current;
    const solidsGroup = solidsGroupRef.current;

    pointsGroup.clear();
    segmentsGroup.clear();
    polygonsGroup.clear();
    solidsGroup.clear();
    pointMeshMapRef.current.clear();

    const pointMap = new Map<string, GeometryPoint>();
    document.points.forEach((p) => pointMap.set(p.id, p));

    // 1. Render Points
    document.points.forEach((pt) => {
      if (visibleElementIds && !visibleElementIds.has(pt.id)) return;

      const isSelected = selectedElementId === pt.id;
      const isConnecting = segmentStartPointId === pt.id;

      const sphereGeo = new THREE.SphereGeometry(pt.size || 0.12, 24, 24);
      const color = isSelected ? 0xf59e0b : isConnecting ? 0x10b981 : new THREE.Color(pt.color || '#3b82f6').getHex();
      const sphereMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: isSelected ? 0x78350f : isConnecting ? 0x064e3b : 0x000000,
      });

      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(pt.coords[0], pt.coords[1], pt.coords[2]);
      mesh.userData = { id: pt.id, type: 'point', name: pt.name };

      pointsGroup.add(mesh);
      pointMeshMapRef.current.set(pt.id, mesh);
    });

    // 2. Render Segments
    document.segments.forEach((seg) => {
      if (visibleElementIds && !visibleElementIds.has(seg.id)) return;

      const p1 = pointMap.get(seg.startPointId);
      const p2 = pointMap.get(seg.endPointId);
      if (!p1 || !p2) return;

      const isSelected = selectedElementId === seg.id;
      const v1 = new THREE.Vector3(...p1.coords);
      const v2 = new THREE.Vector3(...p2.coords);

      const geometry = new THREE.BufferGeometry().setFromPoints([v1, v2]);
      const color = isSelected ? 0xf59e0b : new THREE.Color(seg.color || '#0284c7').getHex();

      let lineMesh: THREE.Line;
      if (seg.dashed) {
        // Hidden line representation (standard Vietnam geometry textbook standard)
        const dashedMat = new THREE.LineDashedMaterial({
          color,
          dashSize: 0.25,
          gapSize: 0.15,
        });
        lineMesh = new THREE.Line(geometry, dashedMat);
        lineMesh.computeLineDistances();
      } else {
        const solidMat = new THREE.LineBasicMaterial({
          color,
        });
        lineMesh = new THREE.Line(geometry, solidMat);
      }

      lineMesh.userData = { id: seg.id, type: 'segment' };
      segmentsGroup.add(lineMesh);
    });

    // 3. Render Polygons (Faces)
    document.polygons.forEach((poly) => {
      if (visibleElementIds && !visibleElementIds.has(poly.id)) return;

      const pts = poly.vertexIds.map((id) => pointMap.get(id)).filter(Boolean) as GeometryPoint[];
      if (pts.length < 3) return;

      const isSelected = selectedElementId === poly.id;
      const polyGeo = new THREE.BufferGeometry();
      const vertices: number[] = [];

      // Fan triangulation from vertex 0
      for (let i = 1; i < pts.length - 1; i++) {
        vertices.push(...pts[0].coords);
        vertices.push(...pts[i].coords);
        vertices.push(...pts[i + 1].coords);
      }

      polyGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      polyGeo.computeVertexNormals();

      const polyMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xf59e0b : new THREE.Color(poly.color || '#38bdf8').getHex(),
        transparent: true,
        opacity: isSelected ? 0.45 : poly.opacity ?? 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(polyGeo, polyMat);
      mesh.userData = { id: poly.id, type: 'polygon' };
      polygonsGroup.add(mesh);
    });

    // 4. Render Solids (Primitives)
    document.solids.forEach((solid) => {
      if (visibleElementIds && !visibleElementIds.has(solid.id)) return;

      let geo: THREE.BufferGeometry;
      const { baseSize = 2, height = 3, radius = 1.5, width = 2, depth = 2, position = [0, height / 2, 0] } =
        solid.params;

      switch (solid.type) {
        case 'cuboid':
          geo = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'cylinder':
          geo = new THREE.CylinderGeometry(radius, radius, height, 32);
          break;
        case 'cone':
          geo = new THREE.ConeGeometry(radius, height, 32);
          break;
        case 'sphere':
          geo = new THREE.SphereGeometry(radius, 32, 32);
          break;
        case 'pyramid':
          geo = new THREE.ConeGeometry(baseSize, height, 4);
          break;
        default:
          geo = new THREE.BoxGeometry(2, 2, 2);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(solid.color || '#6366f1').getHex(),
        transparent: true,
        opacity: solid.opacity ?? 0.6,
        roughness: 0.3,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.userData = { id: solid.id, type: 'solid' };

      // Add wireframe edge helper
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
      );
      mesh.add(wireframe);

      solidsGroup.add(mesh);
    });
  }, [document, visibleElementIds, selectedElementId, segmentStartPointId]);

  // Handle Raycasting and Click on 3D Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool === 'orbit' || tool === 'pen') return;

    const container = containerRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 1. Check intersection with existing point meshes
    const pointMeshes = Array.from(pointMeshMapRef.current.values());
    const pointIntersects = raycaster.intersectObjects(pointMeshes, false);

    if (pointIntersects.length > 0) {
      const clickedMesh = pointIntersects[0].object as THREE.Mesh;
      const pointId = clickedMesh.userData.id as string;

      if (tool === 'select') {
        onSelectElement(pointId, 'point');
        return;
      }

      if (tool === 'segment') {
        if (!segmentStartPointId) {
          // Select start point
          setSegmentStartPointId(pointId);
        } else {
          // Connect to end point
          if (segmentStartPointId !== pointId) {
            onAddSegment(segmentStartPointId, pointId);
          }
          setSegmentStartPointId(null);
        }
        return;
      }
    }

    // 2. If clicking on empty ground grid in 'point' tool mode, add new point
    if (tool === 'point') {
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const targetVec = new THREE.Vector3();
      const intersection = raycaster.ray.intersectPlane(groundPlane, targetVec);

      if (intersection) {
        // Snap to nearest 0.5 grid unit
        const snapX = Math.round(intersection.x * 2) / 2;
        const snapZ = Math.round(intersection.z * 2) / 2;

        // Auto-assign next alphabet letter
        const existingNames = new Set(document.points.map((p) => p.name));
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let assignedName = 'P';
        for (const letter of alphabet) {
          if (!existingNames.has(letter)) {
            assignedName = letter;
            break;
          }
        }

        const newPoint: GeometryPoint = {
          id: `p_${Date.now()}`,
          name: assignedName,
          coords: [snapX, 0, snapZ],
          color: '#3b82f6',
          size: 0.12,
        };

        onAddPoint(newPoint);
      }
    } else {
      // Clicked on empty space with select tool -> deselect
      if (tool === 'select') {
        onSelectElement(null);
      }
      setSegmentStartPointId(null);
    }
  };

  // Freehand Pen Canvas Drawing logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'pen') return;
    const canvas = freehandCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    currentStrokeRef.current = [{ x, y }];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#ef4444'; // Red pen
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || tool !== 'pen') return;
    const canvas = freehandCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentStrokeRef.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current || tool !== 'pen') return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 1) {
      onAddStroke({
        id: `stroke_${Date.now()}`,
        color: '#ef4444',
        size: 3,
        points: [...currentStrokeRef.current],
      });
    }
    currentStrokeRef.current = [];
  };

  // Sync freehand strokes to canvas
  useEffect(() => {
    const canvas = freehandCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    freehandStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [freehandStrokes]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className={`w-full h-full ${
          tool === 'orbit'
            ? 'cursor-grab active:cursor-grabbing'
            : tool === 'point'
            ? 'cursor-crosshair'
            : tool === 'segment'
            ? 'cursor-pointer'
            : 'cursor-default'
        }`}
      />

      {/* 2D Projected Point Labels (Crisp Typography) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedLabels.map((lbl) => {
          if (!lbl.visible) return null;
          return (
            <div
              key={lbl.id}
              className="absolute font-semibold text-sm px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm transform -translate-x-1/2 -translate-y-full mb-1"
              style={{
                left: `${lbl.x}px`,
                top: `${lbl.y - 8}px`,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: lbl.color,
                border: `1px solid ${lbl.color}66`,
              }}
            >
              {lbl.name}
            </div>
          );
        })}
      </div>

      {/* Freehand 2D Annotation Overlay Canvas */}
      <canvas
        ref={freehandCanvasRef}
        width={containerRef.current?.clientWidth || 1000}
        height={containerRef.current?.clientHeight || 800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute inset-0 ${
          tool === 'pen' ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
      />

      {/* Mode hint indicator */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 flex items-center space-x-2 shadow-md">
        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
        <span>
          {tool === 'orbit' && 'Chế độ xoay: Kéo chuột trái để xoay camera 3D, cuộn để phóng to/thu nhỏ.'}
          {tool === 'select' && 'Chế độ chọn: Nhấp vào điểm, đoạn thẳng hoặc mặt phẳng để xem thông số.'}
          {tool === 'point' && 'Chế độ vẽ điểm: Nhấp chuột lên mặt phẳng lưới để đặt điểm mới.'}
          {tool === 'segment' &&
            (segmentStartPointId
              ? 'Đang nối: Nhấp điểm thứ 2 để tạo đoạn thẳng.'
              : 'Chế độ đoạn thẳng: Nhấp điểm đầu tiên.')}
          {tool === 'pen' && 'Bút vẽ tự do: Vẽ và ghi chú trực tiếp lên bảng dạy học.'}
        </span>
      </div>
    </div>
  );
};
