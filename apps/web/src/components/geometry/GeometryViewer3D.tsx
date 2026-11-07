import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { Eye, RotateCw, Box, Layers } from 'lucide-react';

interface GeometryViewer3DProps {
  initialShape?: 'pyramid' | 'cuboid';
}

export const GeometryViewer3D: React.FC<GeometryViewer3DProps> = ({ initialShape = 'pyramid' }) => {
  const { t } = useTranslation();
  const mountRef = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<'pyramid' | 'cuboid'>(initialShape);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [opacity, setOpacity] = useState(0.85);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 4, 7);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Grid & Axes Helpers
    const grid = new THREE.GridHelper(10, 10, 0x307eff, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const axes = new THREE.AxesHelper(3);
    scene.add(axes);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 5. Geometry Mesh Setup
    const updateGeometry = () => {
      if (meshRef.current) scene.remove(meshRef.current);
      if (wireframeMeshRef.current) scene.remove(wireframeMeshRef.current);

      let geometry: THREE.BufferGeometry;
      if (shape === 'pyramid') {
        geometry = new THREE.ConeGeometry(2.5, 3.5, 4); // 4-sided pyramid
      } else {
        geometry = new THREE.BoxGeometry(3, 2.5, 3);
      }

      const material = new THREE.MeshStandardMaterial({
        color: shape === 'pyramid' ? 0x307eff : 0x10b981,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = shape === 'pyramid' ? 1.75 : 1.25;
      scene.add(mesh);
      meshRef.current = mesh;

      // Wireframe overlay for mathematical clarity
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      const wireframeLines = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(wireframeLines);
      wireframeMeshRef.current = wireframeLines;
    };

    updateGeometry();

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshRef.current && isRotating) {
        meshRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shape, opacity]);

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).wireframe = wireframe;
    }
  }, [wireframe]);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950/80 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShape('pyramid')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              shape === 'pyramid'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t('geometry.pyramid')}
          </button>
          <button
            onClick={() => setShape('cuboid')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              shape === 'cuboid'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Box className="w-4 h-4" />
            {t('geometry.cuboid')}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg transition-all ${
              isRotating ? 'bg-brand-600/30 text-brand-400 border border-brand-500/50' : 'bg-slate-800 text-slate-400'
            }`}
            title="Auto-rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-2 rounded-lg transition-all ${
              wireframe ? 'bg-amber-600/30 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle Wireframe"
          >
            <Eye className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span>{t('geometry.transparent')}</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-20 accent-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-80 md:h-96 relative bg-gradient-to-b from-slate-950 to-slate-900" />

      {/* Mathematical Calculations Card */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-around text-center text-sm">
        <div>
          <span className="text-slate-500 text-xs block">{t('geometry.volume')} (V)</span>
          <span className="font-mono font-bold text-brand-400 text-base">
            {shape === 'pyramid' ? '14.58 cm³' : '22.50 cm³'}
          </span>
        </div>
        <div className="border-x border-slate-800 px-6">
          <span className="text-slate-500 text-xs block">{t('geometry.height')} (h)</span>
          <span className="font-mono font-bold text-emerald-400 text-base">
            {shape === 'pyramid' ? '3.50 cm' : '2.50 cm'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-xs block">{t('geometry.baseArea')} (S_base)</span>
          <span className="font-mono font-bold text-amber-400 text-base">
            {shape === 'pyramid' ? '12.50 cm²' : '9.00 cm²'}
          </span>
        </div>
      </div>
    </div>
  );
};

