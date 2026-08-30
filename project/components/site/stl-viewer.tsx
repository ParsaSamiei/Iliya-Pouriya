"use client";

import { OrbitControls, Stage } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Box } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StlModel = {
  id: string;
  nameEn: string;
  nameFa: string;
  fileUrl: string;
};

// three.js's Color parser can't resolve CSS custom properties, so these
// mirror the --accent/--fg token values in app/globals.css directly.
// Keep in sync if the design tokens change.
const MESH_ACCENT_COLOR = "#f2a93b";
const MESH_SOLID_COLOR = "#9aa3ad";

function Mesh({ url, wireframe }: { url: string; wireframe: boolean }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color={wireframe ? MESH_ACCENT_COLOR : MESH_SOLID_COLOR}
        wireframe={wireframe}
        metalness={0.2}
        roughness={0.6}
      />
    </mesh>
  );
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-fg-muted">
      <Box className="size-8 animate-pulse" />
      <span className="font-mono text-xs">Loading model…</span>
    </div>
  );
}

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Client-only STL viewer, dynamically imported (ssr:false) from the project
 * detail page — see docs/06_FRONTEND_ARCHITECTURE.md. Falls back to a plain
 * download link when WebGL isn't available rather than a broken canvas.
 */
export function StlViewer({ models, locale }: { models: StlModel[]; locale: string }) {
  const sorted = models; // already ordered by sort_order from the query
  const [activeId, setActiveId] = useState(sorted[0]?.id);
  const [wireframe, setWireframe] = useState(false);
  const webglAvailable = useMemo(hasWebGL, []);
  const active = sorted.find((m) => m.id === activeId) ?? sorted[0];

  if (!active) return null;

  if (!webglAvailable) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface text-center">
        <Box className="size-8 text-fg-muted" />
        <p className="text-sm text-fg-muted">Your browser doesn&apos;t support 3D previews.</p>
        <Button asChild size="sm" variant="outline">
          <a href={active.fileUrl} download>
            Download STL
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.length > 1 && (
        <Tabs value={activeId} onValueChange={setActiveId}>
          <TabsList>
            {sorted.map((model) => (
              <TabsTrigger key={model.id} value={model.id} className="font-mono">
                {locale === "fa" ? model.nameFa : model.nameEn}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="relative h-80 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface sm:h-96">
        <Canvas
          camera={{ position: [4, 4, 4], fov: 40 }}
          shadows={{ type: THREE.PCFShadowMap }}
        >
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} shadows={false}>
              <Mesh url={active.fileUrl} wireframe={wireframe} />
            </Stage>
          </Suspense>
          <OrbitControls makeDefault autoRotate={false} enableDamping dampingFactor={0.08} />
        </Canvas>

        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 font-mono text-xs"
          onClick={() => setWireframe((v) => !v)}
        >
          {wireframe ? "Solid" : "Wireframe"}
        </Button>
      </div>
    </div>
  );
}

export { ViewerFallback };
