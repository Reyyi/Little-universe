"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { chapters } from "@/data/chapters";
import type { Chapter } from "@/data/types";
import type { NodeState } from "@/lib/progress";
import { pad2, cn } from "@/lib/utils";

let glowTexture: THREE.Texture | null = null;
/** Soft radial dot shared by stars and node halos. */
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}
import { nodeColor, nodeLabel } from "./nodeStyles";

interface SceneProps {
  states: Record<string, NodeState>;
  reduced: boolean;
  onNavigate?: (chapter: Chapter) => void;
}

function StarField({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 26;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = -Math.abs(r * Math.cos(p)) - 3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.y += dt * 0.006;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.12} map={getGlowTexture()} color="#f6f0e8" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame(({ camera, pointer }) => {
    if (reduced) return;
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.3, 0);
  });
  return null;
}

type Registry = {
  nodes: Map<string, THREE.Object3D>;
  labels: Map<string, HTMLElement>;
};

function Node({
  chapter,
  state,
  hovered,
  reduced,
  registry,
}: {
  chapter: Chapter;
  state: NodeState;
  hovered: boolean;
  reduced: boolean;
  registry: Registry;
}) {
  const glow = useRef<THREE.Sprite>(null);
  const core = useRef<THREE.Mesh>(null);
  const seed = chapter.number * 1.7;
  const scaleTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = reduced ? 1 : 1 + Math.sin(t * 1.4 + seed) * 0.12;
    const k = hovered ? 1.8 : 1;
    if (core.current) core.current.scale.lerp(scaleTarget.set(k, k, k), 0.12);
    if (glow.current) {
      glow.current.scale.setScalar(0.9 * pulse * (hovered ? 1.5 : 1));
      glow.current.material.opacity =
        state === "secret" ? 0.12 + Math.sin(t * 0.8 + seed) * 0.08 : state === "locked" ? 0.18 : 0.55;
    }
  });

  return (
    <group
      position={chapter.position}
      ref={(obj) => {
        if (obj) registry.nodes.set(chapter.id, obj);
        else registry.nodes.delete(chapter.id);
      }}
    >
      <sprite ref={glow}>
        <spriteMaterial map={getGlowTexture()} color={nodeColor[state]} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={core}>
        <sphereGeometry args={[state === "secret" ? 0.035 : 0.07, 16, 16]} />
        <meshBasicMaterial color={nodeColor[state]} />
      </mesh>
    </group>
  );
}

/** Projects every node to screen space and moves its DOM label there. */
function LabelProjector({ registry }: { registry: Registry }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    registry.nodes.forEach((obj, id) => {
      const el = registry.labels.get(id);
      if (!el) return;
      obj.getWorldPosition(v).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.visibility = "visible";
    });
  });
  return null;
}

function Constellation({
  states,
  reduced,
  hovered,
  registry,
}: {
  states: Record<string, NodeState>;
  reduced: boolean;
  hovered: string | null;
  registry: Registry;
}) {
  const group = useRef<THREE.Group>(null);
  const main = chapters.filter((c) => c.kind === "chapter");

  useFrame(({ clock }) => {
    if (!reduced && group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={group}>
      {main.slice(1).map((c, i) => {
        const prev = main[i];
        const lit = states[prev.id] === "completed";
        return (
          <Line
            key={c.id}
            points={[prev.position, c.position]}
            color={lit ? "#c8ad7d" : "#6b6270"}
            lineWidth={1}
            transparent
            opacity={lit ? 0.6 : 0.25}
            dashed={!lit}
            dashSize={0.08}
            gapSize={0.08}
          />
        );
      })}
      {chapters
        .filter((c) => c.kind === "secret" && states[c.id] !== "secret")
        .map((c) => {
          const from = chapters.find((x) => x.id === c.unlock.after?.[0]) ?? main[0];
          return <Line key={c.id} points={[from.position, c.position]} color="#d9a8b5" lineWidth={1} transparent opacity={0.35} />;
        })}
      {chapters.map((c) => (
        <Node key={c.id} chapter={c} state={states[c.id]} hovered={hovered === c.id} reduced={reduced} registry={registry} />
      ))}
    </group>
  );
}

function NodeLabel({
  chapter,
  state,
  hovered,
  setHovered,
  onSelect,
  registry,
}: {
  chapter: Chapter;
  state: NodeState;
  hovered: boolean;
  setHovered: (id: string | null) => void;
  onSelect: () => void;
  registry: Registry;
}) {
  const interactive = state === "available" || state === "completed";
  const title = state === "secret" ? "Something hidden" : chapter.title;
  return (
    <li
      ref={(el) => {
        if (el) registry.labels.set(chapter.id, el);
        else registry.labels.delete(chapter.id);
      }}
      className="invisible absolute left-0 top-0"
    >
      <button
        type="button"
        onClick={interactive ? onSelect : undefined}
        aria-disabled={!interactive}
        onPointerEnter={() => setHovered(chapter.id)}
        onPointerLeave={() => setHovered(null)}
        onFocus={() => setHovered(chapter.id)}
        onBlur={() => setHovered(null)}
        aria-label={`Chapter ${chapter.number}: ${title}. ${nodeLabel[state]}`}
        className={cn("group relative flex size-16 items-center justify-center rounded-full", interactive ? "cursor-pointer" : "cursor-default")}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-center transition-[opacity,transform] duration-700",
            state === "secret" ? "opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60" : "opacity-100",
            hovered && "translate-y-1",
          )}
        >
          <span className="eyebrow !text-[0.6rem]">
            {pad2(chapter.number)} · {nodeLabel[state]}
          </span>
          <span
            className={cn(
              "font-display text-xl italic",
              state === "available" && "text-blush",
              state === "completed" && "text-gold",
              (state === "locked" || state === "secret") && "text-mist/50",
            )}
          >
            {state === "secret" ? "? ? ?" : chapter.title}
          </span>
          {hovered && interactive && <span className="eyebrow mt-1 !text-[0.55rem]">{chapter.subtitle}</span>}
        </span>
      </button>
    </li>
  );
}

/**
 * Desktop constellation map. Loaded only on /universe via next/dynamic.
 * Stars are WebGL; their labels are real DOM buttons (keyboard + screen reader friendly).
 */
export default function UniverseScene({ states, reduced, onNavigate }: SceneProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const registry = useMemo<Registry>(() => ({ nodes: new Map(), labels: new Map() }), []);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <fog attach="fog" args={["#09080d", 10, 34]} />
        <StarField reduced={reduced} />
        <CameraRig reduced={reduced} />
        <Constellation states={states} reduced={reduced} hovered={hovered} registry={registry} />
        <LabelProjector registry={registry} />
      </Canvas>
      <nav aria-label="Chapters" className="pointer-events-none absolute inset-0">
        <ol className="pointer-events-auto">
          {chapters.map((c) => (
            <NodeLabel
              key={c.id}
              chapter={c}
              state={states[c.id]}
              hovered={hovered === c.id}
              setHovered={setHovered}
              registry={registry}
              onSelect={() => (onNavigate ? onNavigate(c) : router.push(c.route))}
            />
          ))}
        </ol>
      </nav>
    </div>
  );
}
