import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { detectWebGLSupport, prefersReducedMotion } from '@/lib/utils';

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// ─── Monochrome translucent palette ─────────────────────────────────────────

const C_VOLUME = '#94a3b8';     // slate-400 — building volumes
const C_VOLUME_DARK = '#64748b'; // slate-500 — towers / accent
const C_GROUND = '#f1f5f9';     // slate-50 — ground plane
const C_STREET = '#cbd5e1';     // slate-300 — street grid
const C_EDGE = '#334155';       // slate-700 — wireframe edges
const C_TRUNK = '#78716c';      // stone-500 — tree trunks (grey-brown)
const C_CANOPY = '#94a3b8';     // slate-400 — tree canopy (same as buildings)

// ─── Animation constants ────────────────────────────────────────────────────

const RISE_DURATION = 10.0;
const STAGGER_FACTOR = 1.4;
const TREE_EXTRA_DELAY = 4.0;

// ─── Car constants ───────────────────────────────────────────────────────────

const CAR_COUNT = 18;
const CAR_SPEED_MIN = 0.3;
const CAR_SPEED_MAX = 0.7;
const C_CAR = '#64748b';


function easeOutBack(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ─── Data types ─────────────────────────────────────────────────────────────

interface BuildingPart {
  x: number; z: number; y: number; w: number; h: number; d: number;
  shape: 'box' | 'cylinder' | 'tapered';
  rotY: number;
}

interface TreeData {
  x: number; z: number;
  trunkH: number; trunkR: number;
  canopyH: number; canopyR: number;
}

interface CarRoute {
  axis: 'x' | 'z';
  fixedCoord: number;
  rangeMin: number;
  rangeMax: number;
  speed: number;
  offset: number;
  direction: 1 | -1;
}

interface CityData {
  parts: BuildingPart[];
  trees: TreeData[];
  cars: CarRoute[];
}

// ─── City generation ────────────────────────────────────────────────────────

function generateCity(): CityData {
  const parts: BuildingPart[] = [];
  const trees: TreeData[] = [];

  const gridW = 9, gridD = 7;
  const blockSize = 0.7;
  const streetWidth = 0.12;
  const stride = blockSize + streetWidth;

  const cx = (gridW - 1) / 2;
  const cz = (gridD - 1) / 2;
  const maxDist = Math.sqrt(cx * cx + cz * cz);

  for (let gx = 0; gx < gridW; gx++) {
    for (let gz = 0; gz < gridD; gz++) {
      const dx = gx - cx, dz = gz - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const centrality = 1 - dist / maxDist;

      const bx = (gx - cx) * stride;
      const bz = (gz - cz) * stride;

      const isPark = hash(gx * 13.7, gz * 7.3) > 0.82;
      const isVacant = centrality < 0.2 && hash(gx * 3.1, gz * 9.7) > 0.55;

      if (isPark || isVacant) {
        const treeCount = isPark ? Math.ceil(hash(gx * 5, gz * 9) * 4 + 3) : Math.ceil(hash(gx * 7, gz * 3) * 2 + 1);
        for (let ti = 0; ti < treeCount; ti++) {
          const tx = bx + (hash(gx * 11 + ti, gz * 17) - 0.5) * blockSize * 0.8;
          const tz = bz + (hash(gx * 3 + ti * 5, gz * 7 + ti) - 0.5) * blockSize * 0.8;
          const scale = 0.7 + hash(gx * 7 + ti, gz * 13 + ti * 3) * 0.8;
          trees.push({
            x: tx, z: tz,
            trunkH: 0.35 * scale, trunkR: 0.03 * scale,
            canopyH: 0.55 * scale, canopyR: 0.28 * scale,
          });
        }
        continue;
      }

      const count = centrality > 0.7 ? 1 :
        (centrality > 0.4 ? Math.ceil(hash(gx * 5, gz * 3) * 2 + 1) :
          Math.ceil(hash(gx * 7, gz * 11) * 3 + 1));

      for (let bi = 0; bi < count; bi++) {
        const offX = count === 1 ? 0 : (hash(gx * 11 + bi, gz * 3 + bi * 7) - 0.5) * (blockSize * 0.5);
        const offZ = count === 1 ? 0 : (hash(gx * 3 + bi * 5, gz * 13 + bi) - 0.5) * (blockSize * 0.5);
        const px = bx + offX;
        const pz = bz + offZ;

        const hNoise = hash(gx * 9 + bi * 17, gz * 5 + bi * 3);
        const rotY = (hash(gx * 19 + bi, gz * 23) - 0.5) * 0.1;
        let height: number, width: number, depth: number;
        let shape: 'box' | 'cylinder' | 'tapered' = 'box';

        if (centrality > 0.7) {
          height = 2.0 + centrality * 3.0 * (0.4 + hNoise * 0.6);
          width = 0.25 + hash(gx * 4 + bi, gz * 8) * 0.2;
          depth = 0.25 + hash(gx * 6, gz * 2 + bi) * 0.2;

          if (hash(gx * 31 + bi, gz * 37) > 0.6) {
            shape = 'cylinder';
          } else if (height > 3.0) {
            shape = 'tapered';
          }

          // Setback on very tall towers
          if (height > 3.5 && shape === 'box') {
            const shaftH = height * 0.7;
            const crownH = height * 0.3;
            parts.push({ x: px, z: pz, y: shaftH / 2, w: width, h: shaftH, d: depth, shape: 'box', rotY });
            parts.push({ x: px, z: pz, y: shaftH + crownH / 2, w: width * 0.7, h: crownH, d: depth * 0.7, shape: 'tapered', rotY });
            continue;
          }
        } else if (centrality > 0.35) {
          height = 0.8 + centrality * 2.5 * (0.3 + hNoise * 0.7);
          width = 0.3 + hash(gx * 2 + bi, gz * 6) * 0.15;
          depth = 0.3 + hash(gx * 8, gz * 4 + bi) * 0.15;

          // L-shaped buildings
          if (hash(gx * 15 + bi, gz * 7) > 0.7 && count === 1) {
            const wingW = width * 0.6;
            const wingH = height * 0.65;
            parts.push({ x: px, z: pz, y: height / 2, w: width, h: height, d: depth, shape: 'box', rotY });
            parts.push({ x: px + width * 0.4, z: pz + depth * 0.3, y: wingH / 2, w: wingW, h: wingH, d: depth * 0.5, shape: 'box', rotY });
            addStreetTrees(trees, px, pz, width, depth, gx * 50 + gz * 5 + bi);
            continue;
          }
        } else {
          height = 0.3 + hNoise * 0.8;
          width = 0.35 + hash(gx * 3 + bi, gz * 9) * 0.2;
          depth = 0.35 + hash(gx * 7, gz * 5 + bi) * 0.2;
        }

        parts.push({ x: px, z: pz, y: height / 2, w: width, h: height, d: depth, shape, rotY });

        if (centrality < 0.6 && hash(gx * 41 + bi, gz * 43) > 0.4) {
          addStreetTrees(trees, px, pz, width, depth, gx * 50 + gz * 5 + bi);
        }
      }
    }
  }

  // Generate car routes along streets
  const cars: CarRoute[] = [];
  for (let i = 0; i < CAR_COUNT; i++) {
    const h = hash(i * 37, i * 59);
    const isHorizontal = h > 0.5;
    const axis = isHorizontal ? 'z' : 'x';
    const laneIndex = Math.floor(hash(i * 23, i * 41) * (isHorizontal ? gridD : gridW));
    const laneCx = isHorizontal ? cz : cx;
    const fixedCoord = (laneIndex - laneCx - 0.5) * stride + (hash(i * 71, i * 13) > 0.5 ? 0.02 : -0.02);
    const rangeHalf = isHorizontal ? (gridW * stride) / 2 + 0.5 : (gridD * stride) / 2 + 0.5;
    const dir = hash(i * 89, i * 97) > 0.5 ? 1 : -1;
    cars.push({
      axis,
      fixedCoord,
      rangeMin: -rangeHalf,
      rangeMax: rangeHalf,
      speed: CAR_SPEED_MIN + hash(i * 67, i * 79) * (CAR_SPEED_MAX - CAR_SPEED_MIN),
      offset: hash(i * 31, i * 53),
      direction: dir as 1 | -1,
    });
  }

  return { parts, trees, cars };
}

function addStreetTrees(trees: TreeData[], bx: number, bz: number, w: number, d: number, seed: number) {
  const treeCount = Math.ceil(hash(seed, seed * 3) * 2 + 1);
  for (let i = 0; i < treeCount; i++) {
    const side = hash(seed + i * 7, seed + i * 11) > 0.5 ? 1 : -1;
    const along = (hash(seed + i * 13, seed + i * 17) - 0.5) * d * 1.2;
    const tx = bx + side * (w / 2 + 0.08 + hash(seed + i, seed * 2 + i) * 0.05);
    const tz = bz + along;
    const scale = 0.5 + hash(seed + i * 3, seed + i * 5) * 0.6;
    trees.push({
      x: tx, z: tz,
      trunkH: 0.3 * scale, trunkR: 0.025 * scale,
      canopyH: 0.45 * scale, canopyR: 0.22 * scale,
    });
  }
}

// ─── Translucent building with edge outlines ────────────────────────────────

function BuildingMesh({ part, tRef }: { part: BuildingPart; tRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const dist = Math.sqrt(part.x * part.x + part.z * part.z);
  const delay = dist * STAGGER_FACTOR;

  const edgesGeo = useMemo(() => {
    let geo: THREE.BufferGeometry;
    if (part.shape === 'cylinder') {
      geo = new THREE.CylinderGeometry(part.w * 0.4, part.w * 0.5, part.h, 12);
    } else if (part.shape === 'tapered') {
      geo = new THREE.CylinderGeometry(part.w * 0.35, part.w * 0.5, part.h, 4);
    } else {
      geo = new THREE.BoxGeometry(part.w, part.h, part.d);
    }
    return new THREE.EdgesGeometry(geo);
  }, [part]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = tRef.current ?? 0;
    const progress = Math.max(0, Math.min(1, (t - delay) / RISE_DURATION));
    const eased = easeOutBack(progress);
    groupRef.current.scale.y = Math.max(0.001, eased);
    groupRef.current.position.y = 0;
  });

  const geometry = useMemo(() => {
    if (part.shape === 'cylinder') {
      return <cylinderGeometry args={[part.w * 0.4, part.w * 0.5, part.h, 12]} />;
    }
    if (part.shape === 'tapered') {
      return <cylinderGeometry args={[part.w * 0.35, part.w * 0.5, part.h, 4]} />;
    }
    return <boxGeometry args={[part.w, part.h, part.d]} />;
  }, [part]);

  return (
    <group ref={groupRef} position={[part.x, 0, part.z]} rotation={[0, part.rotY, 0]} scale={[1, 0.001, 1]}>
      <mesh position={[0, part.y, 0]}>
        {geometry}
        <meshPhysicalMaterial
          color={part.h > 2.0 ? C_VOLUME_DARK : C_VOLUME}
          transparent
          opacity={0.18}
          roughness={0.4}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments position={[0, part.y, 0]} geometry={edgesGeo}>
        <lineBasicMaterial color={C_EDGE} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// ─── Translucent trees ──────────────────────────────────────────────────────

function Trees({ treeData, tRef }: { treeData: TreeData[]; tRef: React.RefObject<number> }) {
  const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
  const canopyMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = treeData.length;

  useFrame(() => {
    if (!trunkMeshRef.current || !canopyMeshRef.current) return;
    const t = tRef.current ?? 0;

    for (let i = 0; i < count; i++) {
      const tree = treeData[i];
      const dist = Math.sqrt(tree.x * tree.x + tree.z * tree.z);
      const delay = dist * STAGGER_FACTOR + TREE_EXTRA_DELAY;
      const progress = Math.max(0, Math.min(1, (t - delay) / (RISE_DURATION * 0.7)));
      const eased = easeOutBack(progress);

      const trunkSx = tree.trunkR;
      const trunkSy = tree.trunkH;
      const canopySx = tree.canopyR;
      const canopySy = tree.canopyH;

      dummy.position.set(tree.x, trunkSy * 0.5 * eased, tree.z);
      dummy.scale.set(trunkSx, Math.max(0.001, trunkSy * eased), trunkSx);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkMeshRef.current.setMatrixAt(i, dummy.matrix);

      const canopyY = (trunkSy + canopySy * 0.4) * eased;
      dummy.position.set(tree.x, canopyY, tree.z);
      const ce = Math.max(0.001, eased);
      dummy.scale.set(canopySx * ce, canopySy * ce, canopySx * ce);
      dummy.updateMatrix();
      canopyMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    trunkMeshRef.current.instanceMatrix.needsUpdate = true;
    canopyMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={trunkMeshRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.8, 1.0, 1.0, 5]} />
        <meshPhysicalMaterial color={C_TRUNK} transparent opacity={0.2} roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={canopyMeshRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[1.0, 1.0, 6]} />
        <meshPhysicalMaterial color={C_CANOPY} transparent opacity={0.15} roughness={0.6} />
      </instancedMesh>
    </>
  );
}

// ─── Cars ────────────────────────────────────────────────────────────────────

function Cars({ routes, tRef }: { routes: CarRoute[]; tRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = routes.length;

  useFrame(() => {
    if (!meshRef.current) return;
    const t = tRef.current ?? 0;

    for (let i = 0; i < count; i++) {
      const car = routes[i];
      const range = car.rangeMax - car.rangeMin;
      const rawPos = (car.offset * range + car.direction * car.speed * t) % range;
      const pos = car.rangeMin + ((rawPos % range) + range) % range;

      if (car.axis === 'z') {
        dummy.position.set(pos, 0.015, car.fixedCoord);
        dummy.rotation.set(0, car.direction > 0 ? 0 : Math.PI, 0);
      } else {
        dummy.position.set(car.fixedCoord, 0.015, pos);
        dummy.rotation.set(0, car.direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      }
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.12, 0.035, 0.06]} />
      <meshPhysicalMaterial
        color={C_CAR}
        transparent
        opacity={0.35}
        roughness={0.3}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

// ─── Street grid ────────────────────────────────────────────────────────────

function StreetGrid() {
  const stride = 0.82;
  const gridW = 9, gridD = 7;
  const cx = (gridW - 1) / 2, cz = (gridD - 1) / 2;
  const totalW = gridW * stride;
  const totalD = gridD * stride;
  const lines: JSX.Element[] = [];

  for (let i = 0; i <= gridD; i++) {
    const z = (i - cz - 0.5) * stride;
    lines.push(
      <mesh key={`h${i}`} position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[totalW + 1, 0.03]} />
        <meshBasicMaterial color={C_STREET} opacity={0.15} transparent />
      </mesh>
    );
  }
  for (let i = 0; i <= gridW; i++) {
    const x = (i - cx - 0.5) * stride;
    lines.push(
      <mesh key={`v${i}`} position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, totalD + 1]} />
        <meshBasicMaterial color={C_STREET} opacity={0.15} transparent />
      </mesh>
    );
  }

  return <>{lines}</>;
}

// ─── City scene ─────────────────────────────────────────────────────────────

function City() {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(0);
  const anim = !prefersReducedMotion();
  const city = useMemo(generateCity, []);

  useFrame((_, dt) => {
    tRef.current += dt;
    if (groupRef.current && anim) {
      groupRef.current.rotation.y += dt * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[3, -1.8, 0]} rotation={[-0.15, -0.3, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshPhysicalMaterial color={C_GROUND} transparent opacity={0.12} roughness={1} />
      </mesh>

      <StreetGrid />

      {city.parts.map((part, i) => (
        <BuildingMesh key={i} part={part} tRef={tRef} />
      ))}

      {city.trees.length > 0 && (
        <Trees treeData={city.trees} tRef={tRef} />
      )}

      <Cars routes={city.cars} tRef={tRef} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 4]} intensity={0.6} color="#f8fafc" />
      <directionalLight position={[-3, 5, -4]} intensity={0.25} color="#e2e8f0" />
      <pointLight position={[0, 8, 0]} intensity={0.1} color="#f1f5f9" />
      <City />
    </>
  );
}

export default function Hero3D() {
  const [ok, setOk] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setOk(detectWebGLSupport());
    setReduced(prefersReducedMotion());
  }, []);

  if (!ok || reduced) {
    return <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
      <Canvas camera={{ position: [0, 3.5, 7], fov: 40 }} gl={{ antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
