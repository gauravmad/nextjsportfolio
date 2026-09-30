"use client";

/**
 * The hero's 3D agent pipeline: input → router → tools (SQL, RAG, web) →
 * knowledge → guardrails → LLM → result. The same graph as the GitHub profile
 * header, with packets flowing along each edge.
 */
import { Line } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { sceneState } from "./scene-state";

const SIGNAL = new THREE.Color("#F97316");
const PACKET = new THREE.Color("#FBBF24");
const WIRE = "#374151";

type NodeId = "input" | "router" | "sql" | "rag" | "web" | "knowledge" | "guard" | "llm" | "result";

const NODES: Record<NodeId, { position: [number, number, number]; size: number }> = {
  input: { position: [-7, -0.4, 0], size: 0.28 },
  router: { position: [-4.2, 0.2, 0.4], size: 0.46 },
  sql: { position: [-1.2, 2, -0.8], size: 0.3 },
  rag: { position: [-1.2, 0.1, 1.1], size: 0.3 },
  web: { position: [-1.2, -1.8, -0.4], size: 0.3 },
  knowledge: { position: [1.8, 0.4, -0.2], size: 0.38 },
  guard: { position: [4.2, -0.3, 0.6], size: 0.32 },
  llm: { position: [6.4, 0.5, 0], size: 0.5 },
  result: { position: [8.8, -0.2, 0.3], size: 0.28 },
};

const EDGES: [NodeId, NodeId][] = [
  ["input", "router"],
  ["router", "sql"],
  ["router", "rag"],
  ["router", "web"],
  ["sql", "knowledge"],
  ["rag", "knowledge"],
  ["web", "knowledge"],
  ["knowledge", "guard"],
  ["guard", "llm"],
  ["llm", "result"],
];

const PACKETS_PER_EDGE = 3;

function edgeCurve(from: NodeId, to: NodeId) {
  const a = new THREE.Vector3(...NODES[from].position);
  const b = new THREE.Vector3(...NODES[to].position);
  const mid = (b.x - a.x) * 0.5;
  return new THREE.CubicBezierCurve3(a, new THREE.Vector3(a.x + mid, a.y, a.z), new THREE.Vector3(b.x - mid, b.y, b.z), b);
}

function Graph({ animate, compact }: { animate: boolean; compact: boolean }) {
  // Desktop: the graph sits right of the name and runs off the edge. Mobile: above the copy.
  const base = compact ? { x: 1.2, y: 2.6, scale: 0.55 } : { x: 3.2, y: 0.6, scale: 0.72 };
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const curves = useMemo(() => EDGES.map(([a, b]) => edgeCurve(a, b)), []);
  const edgePoints = useMemo(() => curves.map((curve) => curve.getPoints(48)), [curves]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = sceneState.progress;
    const g = group.current;
    if (g) {
      // Scroll turns the graph edge-on and pulls it toward the camera.
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.28 + p * 0.9 + sceneState.pointerX * 0.12, 4, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 - sceneState.pointerY * 0.08 + p * 0.25, 4, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, base.y + p * 1.6, 4, delta);
    }
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 13 - p * 5, 4, delta);

    const mesh = packets.current;
    if (!mesh) return;
    const time = animate ? state.clock.elapsedTime : 0;
    curves.forEach((curve, edge) => {
      for (let i = 0; i < PACKETS_PER_EDGE; i++) {
        const t = (time * 0.22 + i / PACKETS_PER_EDGE + edge * 0.137) % 1;
        curve.getPoint(t, point);
        dummy.position.copy(point);
        // Packets swell mid-edge and shrink into each node.
        dummy.scale.setScalar(0.5 + Math.sin(t * Math.PI) * 0.7);
        dummy.updateMatrix();
        mesh.setMatrixAt(edge * PACKETS_PER_EDGE + i, dummy.matrix);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} position={[base.x, base.y, 0]} scale={base.scale}>
      {edgePoints.map((points, i) => (
        <Line key={i} points={points} color={WIRE} lineWidth={1.2} transparent opacity={0.9} />
      ))}

      {(Object.keys(NODES) as NodeId[]).map((id) => {
        const { position, size } = NODES[id];
        const hub = id === "router" || id === "llm";
        return (
          <group key={id} position={position}>
            <mesh>
              <icosahedronGeometry args={[size, hub ? 1 : 0]} />
              <meshBasicMaterial color={hub ? SIGNAL : "#9CA3AF"} wireframe />
            </mesh>
            <mesh scale={hub ? 0.55 : 0.4}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color={hub ? SIGNAL : "#F9FAFB"} />
            </mesh>
            <mesh scale={2.6}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial
                color={SIGNAL}
                transparent
                opacity={hub ? 0.1 : 0.04}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      <instancedMesh ref={packets} args={[undefined, undefined, EDGES.length * PACKETS_PER_EDGE]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color={PACKET} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Seeded so server and client agree and the field never "jumps" between renders.
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = random() * 16;
      array[i * 3 + 1] = random() * 8;
      array[i * 3 + 2] = random() * 6 - 3;
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#6B7280" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function PipelineScene({ active, reducedMotion, compact }: {
  /** False while the hero is off-screen: stops the render loop entirely. */
  active: boolean;
  reducedMotion: boolean;
  /** Small screens: fewer particles, lower pixel ratio. */
  compact: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0, 13], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Graph animate={!reducedMotion} compact={compact} />
      <Dust count={compact ? 220 : 600} />
    </Canvas>
  );
}
