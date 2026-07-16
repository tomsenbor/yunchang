'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, CatmullRomCurve3, Vector3 } from 'three';
import type { Group, Mesh, MeshBasicMaterial, ShaderMaterial } from 'three';

const orbitConfigs = [
  { radiusX: 2.78, radiusY: 1.04, zAmp: 0.26, phase: 0.2, rotation: [0.48, -0.22, 0.1], color: '#59fff6', speed: 0.012 },
  { radiusX: 2.42, radiusY: 1.34, zAmp: 0.32, phase: 1.2, rotation: [-0.38, 0.52, -0.32], color: '#8959ff', speed: -0.01 }
] as const;

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uOpen;
  uniform float uReduce;

  float wave(vec3 p) {
    return sin(p.x * 1.92 + uTime * 0.34) * 0.052 +
      sin(p.y * 2.35 + uTime * 0.46) * 0.046 +
      sin((p.x + p.y + p.z) * 1.48 + uTime * 0.28) * 0.04;
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    float energy = mix(0.95, 1.1, uOpen);
    vec3 displaced = position * energy + normal * wave(position) * (1.0 - uReduce);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uOpen;
  uniform float uReduce;

  void main() {
    float facing = max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
    float rim = pow(1.0 - facing, 1.55);
    float flow = 0.5 + 0.5 * sin(uTime * 0.68 + vPosition.x * 1.85 + vPosition.y * 1.32);
    vec3 cyan = vec3(0.35, 1.0, 0.96);
    vec3 blue = vec3(0.35, 0.45, 1.0);
    vec3 purple = vec3(0.54, 0.35, 1.0);
    vec3 orange = vec3(1.0, 0.61, 0.35);
    vec3 color = mix(cyan, blue, smoothstep(-1.0, 1.0, vPosition.y));
    color = mix(color, purple, rim * 0.44 + flow * 0.2);
    color = mix(color, orange, (0.1 + uOpen * 0.1) * (1.0 - uReduce));
    float edgeFade = smoothstep(0.3, 0.84, facing);
    float alpha = (0.12 + facing * 0.1 + flow * 0.025) * edgeFade;
    gl_FragColor = vec4(color, alpha);
  }
`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function ContextLossGuard({ onSceneError }: { onSceneError?: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onSceneError?.();
    };
    const handleContextError = () => onSceneError?.();

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextcreationerror', handleContextError);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextcreationerror', handleContextError);
    };
  }, [gl, onSceneError]);

  return null;
}

function createOrbitCurve(config: typeof orbitConfigs[number]) {
  const points = Array.from({ length: 144 }, (_, index) => {
    const angle = (index / 144) * Math.PI * 2;
    return new Vector3(
      Math.cos(angle) * config.radiusX,
      Math.sin(angle) * config.radiusY,
      Math.sin(angle * 2 + config.phase) * config.zAmp
    );
  });

  return new CatmullRomCurve3(points, true, 'centripetal', 0.5);
}

function FluidCore({ isOpen, reduced }: { isOpen: boolean; reduced: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const glowMaterialRef = useRef<MeshBasicMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpen: { value: isOpen ? 1 : 0 },
      uReduce: { value: reduced ? 1 : 0 }
    }),
    [isOpen, reduced]
  );

  useFrame((state) => {
    const elapsed = reduced ? 0 : state.clock.elapsedTime;
    const targetOpen = isOpen ? 1 : 0;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
      materialRef.current.uniforms.uOpen.value += (targetOpen - materialRef.current.uniforms.uOpen.value) * 0.065;
      materialRef.current.uniforms.uReduce.value = reduced ? 1 : 0;
    }

    if (meshRef.current) {
      if (!reduced) {
        meshRef.current.rotation.y = elapsed * 0.12;
        meshRef.current.rotation.x = Math.sin(elapsed * 0.22) * 0.05;
      }
      const targetScale = isOpen ? 1.06 : 1;
      meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.065;
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.065;
      meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.065;
    }

    if (glowRef.current && glowMaterialRef.current) {
      const glowScale = isOpen ? 1.28 : 1.18;
      glowRef.current.scale.x += (glowScale - glowRef.current.scale.x) * 0.06;
      glowRef.current.scale.y += (glowScale - glowRef.current.scale.y) * 0.06;
      glowRef.current.scale.z += (glowScale - glowRef.current.scale.z) * 0.06;
      glowMaterialRef.current.opacity = isOpen ? 0.08 : 0.045;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.22, 96, 96]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color="#59fff6"
          transparent
          opacity={0.045}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.22, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}

function OrbitSystem({
  config,
  isOpen,
  reduced
}: {
  config: typeof orbitConfigs[number];
  isOpen: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const curve = useMemo(() => createOrbitCurve(config), [config]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = reduced ? 0 : state.clock.elapsedTime;
    groupRef.current.rotation.x = config.rotation[0];
    groupRef.current.rotation.y = config.rotation[1];
    groupRef.current.rotation.z = config.rotation[2] + elapsed * config.speed;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry args={[curve, 220, 0.006, 8, true]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isOpen ? 0.16 : 0.08}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function FluidMap({ isOpen, reduced }: { isOpen: boolean; reduced: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reduced) return;
    const pointer = state.pointer;
    groupRef.current.rotation.y += (pointer.x * 0.13 - groupRef.current.rotation.y) * 0.025;
    groupRef.current.rotation.x += (-pointer.y * 0.09 - groupRef.current.rotation.x) * 0.025;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.2} />
      <pointLight position={[2.4, 3, 3.2]} intensity={3.4} color="#59fff6" />
      <pointLight position={[-2.2, -1.8, 2.4]} intensity={1.6} color="#ff9b59" />
      <FluidCore isOpen={isOpen} reduced={reduced} />
      {orbitConfigs.map((config, index) => (
        <OrbitSystem
          key={`${config.color}-${index}`}
          config={config}
          isOpen={isOpen}
          reduced={reduced}
        />
      ))}
    </group>
  );
}

export default function FluidHeroScene({
  isOpen = false,
  reducedMotion = false,
  onSceneError
}: {
  isOpen?: boolean;
  reducedMotion?: boolean;
  onSceneError?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = reducedMotion || prefersReducedMotion;

  return (
    <div className="fluid-scene-canvas-shell" data-reduced-motion={reduced ? 'true' : 'false'}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 6.2], fov: 39 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ContextLossGuard onSceneError={onSceneError} />
        <FluidMap isOpen={isOpen} reduced={reduced} />
      </Canvas>
    </div>
  );
}
