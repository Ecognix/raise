import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PotholeDemoRecord } from '../../data/demonstrationRoadData';
import { Maximize2, RotateCcw, Eye, Layers, Ruler, Droplets, Info } from 'lucide-react';

interface ThreePotholeViewerProps {
  pothole: PotholeDemoRecord;
  className?: string;
}

export const ThreePotholeViewer: React.FC<ThreePotholeViewerProps> = ({ pothole, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'depthHeatmap' | 'asphaltSurface'>('depthHeatmap');
  const [showWater, setShowWater] = useState<boolean>(pothole.waterFilled);
  const [hoverDepth, setHoverDepth] = useState<number | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);

  // Rotation / Interaction state
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.65, y: -0.45 });
  const zoomRef = useRef(3.2);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1220); // Dark infrastructure command centre
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, zoomRef.current);
    camera.lookAt(0, -0.2, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 6, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 1.5, 8);
    cyanRimLight.position.set(-3, 1, -2);
    scene.add(cyanRimLight);

    const amberRimLight = new THREE.PointLight(0xf59e0b, 1.2, 8);
    amberRimLight.position.set(3, -1, 2);
    scene.add(amberRimLight);

    // 5. Build Terrain Mesh from pothole.depthGrid
    const grid = pothole.depthGrid;
    const gridDim = grid.length;
    const segments = gridDim - 1;
    const planeSize = 2.0; // 2x2 meters virtual plane

    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
    geometry.rotateX(-Math.PI / 2); // horizontal ground

    const posAttr = geometry.attributes.position;
    const count = posAttr.count;

    // Color attribute for depth heatmap
    const colors = new Float32Array(count * 3);
    const maxDepth = pothole.depthMm / 1000; // in meters (e.g. 0.085m)

    for (let i = 0; i < gridDim; i++) {
      for (let j = 0; j < gridDim; j++) {
        const vertIndex = i * gridDim + j;
        const depthVal = (grid[i]?.[j] || 0) / 1000; // meters

        // Y represents downward depression (negative)
        posAttr.setY(vertIndex, -depthVal * 3.5); // scaled for visual prominence

        // Compute vertex color based on depth ratio
        const ratio = Math.min(1, depthVal / Math.max(0.01, maxDepth));
        // Deep = Crimson Red (1.0, 0.15, 0.15), Mid = Amber/Yellow (0.95, 0.65, 0.1), Surface = Slate/Dark Cyan (0.1, 0.65, 0.5)
        let r = 0.15, g = 0.55, b = 0.5;
        if (ratio > 0.6) {
          // deep crater: Crimson Red
          r = 0.95;
          g = 0.15;
          b = 0.25;
        } else if (ratio > 0.25) {
          // mid depth: Amber
          r = 0.95;
          g = 0.65;
          b = 0.1;
        } else if (ratio > 0.05) {
          // shallow edge: Teal/Cyan
          r = 0.1;
          g = 0.75;
          b = 0.8;
        } else {
          // level asphalt: Dark steel blue
          r = 0.18;
          g = 0.24;
          b = 0.35;
        }

        colors[vertIndex * 3] = r;
        colors[vertIndex * 3 + 1] = g;
        colors[vertIndex * 3 + 2] = b;
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Material
    const material = new THREE.MeshStandardMaterial({
      vertexColors: viewMode === 'depthHeatmap',
      color: viewMode === 'asphaltSurface' ? 0x242e38 : 0xffffff,
      roughness: 0.82,
      metalness: 0.15,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Wireframe Overlay
    const wireGeo = geometry.clone();
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.y = 0.002;
    wireMesh.visible = wireframe;
    scene.add(wireMesh);
    wireframeMeshRef.current = wireMesh;

    // Water Surface inside crater (if water present)
    const waterGeo = new THREE.CircleGeometry(0.55, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.8,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -((pothole.depthMm * 0.4) / 1000) * 3.5, 0);
    waterMesh.visible = showWater;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 6. 3D Grid & Ground Reference
    const gridHelper = new THREE.GridHelper(2.4, 12, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -0.005;
    scene.add(gridHelper);

    // 7. Depth scale pillar / 3D gauge pin at crater centre
    const gaugeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.4, 16);
    const gaugeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const gaugeMesh = new THREE.Mesh(gaugeGeo, gaugeMat);
    gaugeMesh.position.set(0, 0.1, 0);
    scene.add(gaugeMesh);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshRef.current) {
        meshRef.current.rotation.x = rotationRef.current.x;
        meshRef.current.rotation.y = rotationRef.current.y;
      }
      if (wireframeMeshRef.current) {
        wireframeMeshRef.current.rotation.x = rotationRef.current.x;
        wireframeMeshRef.current.rotation.y = rotationRef.current.y;
      }
      if (waterMeshRef.current) {
        waterMeshRef.current.rotation.x = rotationRef.current.x;
        waterMeshRef.current.rotation.y = rotationRef.current.y;
      }
      if (gridHelper) {
        gridHelper.rotation.y = rotationRef.current.y;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
    };
  }, [pothole, viewMode]);

  // Update wireframe toggle
  useEffect(() => {
    if (wireframeMeshRef.current) {
      wireframeMeshRef.current.visible = wireframe;
    }
  }, [wireframe]);

  // Update water toggle
  useEffect(() => {
    if (waterMeshRef.current) {
      waterMeshRef.current.visible = showWater;
    }
  }, [showWater]);

  // Mouse drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    rotationRef.current.y += deltaX * 0.008;
    rotationRef.current.x += deltaY * 0.008;
    // clamp vertical rotation
    rotationRef.current.x = Math.max(0.1, Math.min(Math.PI / 2.1, rotationRef.current.x));

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    zoomRef.current = Math.max(1.5, Math.min(5.0, zoomRef.current + e.deltaY * 0.002));
    cameraRef.current.position.z = zoomRef.current;
  };

  const resetView = () => {
    rotationRef.current = { x: 0.65, y: -0.45 };
    zoomRef.current = 3.2;
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2.5, 3.2);
    }
  };

  return (
    <div className={`relative flex flex-col bg-[#070D18] rounded-lg border border-slate-700/60 overflow-hidden select-none ${className}`}>
      {/* 3D Viewport Controls Topbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 bg-[#0A1220]/90 backdrop-blur border border-cyan-500/40 text-cyan-400 font-mono text-[11px] font-bold rounded flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            3D DEPTH MESH &bull; {pothole.chainage}
          </span>
          <span className="px-2 py-1 bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 font-mono text-[10px] rounded">
            Scale: 1:1 Monocular Disparity
          </span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0A1220]/90 backdrop-blur border border-slate-700/80 rounded-md p-1 shadow-lg">
          <button
            onClick={() => setViewMode(v => v === 'depthHeatmap' ? 'asphaltSurface' : 'depthHeatmap')}
            className={`px-2 py-1 text-[11px] font-semibold rounded flex items-center gap-1 transition ${
              viewMode === 'depthHeatmap'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Depth Heatmap / Realistic Asphalt Shader"
          >
            <Eye className="w-3.5 h-3.5" />
            {viewMode === 'depthHeatmap' ? 'Heatmap' : 'Asphalt'}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2 py-1 text-[11px] font-semibold rounded flex items-center gap-1 transition ${
              wireframe
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Wireframe Tessellation Grid"
          >
            <Layers className="w-3.5 h-3.5" />
            Wireframe
          </button>

          <button
            onClick={() => setShowWater(!showWater)}
            className={`px-2 py-1 text-[11px] font-semibold rounded flex items-center gap-1 transition ${
              showWater
                ? 'bg-sky-500/30 text-sky-300 border border-sky-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Simulate Accumulated Water Pool"
          >
            <Droplets className="w-3.5 h-3.5" />
            Water
          </button>

          <button
            onClick={resetView}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative"
      />

      {/* Heatmap Legend Bar (Bottom Overlay) */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
        <div className="bg-[#0A1220]/90 backdrop-blur border border-slate-700/80 rounded px-2.5 py-1.5 text-[10px] text-slate-300 flex items-center gap-3 pointer-events-auto">
          <span className="font-bold text-slate-200">Depth Heatmap:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1e3a5f]" />
            <span className="text-slate-400">0 mm (Surface)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
            <span className="text-slate-400">-25 mm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
            <span className="text-slate-400">-50 mm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
            <span className="text-rose-400 font-bold">-{pothole.depthMm} mm (Crater Base)</span>
          </div>
        </div>

        <div className="bg-[#0A1220]/90 backdrop-blur border border-amber-500/30 rounded px-2 py-1 text-[10px] text-amber-300 font-medium flex items-center gap-1.5 pointer-events-auto">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Click & drag to rotate 360° &bull; Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
