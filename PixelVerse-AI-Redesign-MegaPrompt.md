# PIXELVERSE AI — NEXT-LEVEL UI/UX REDESIGN MASTER PROMPT
### For Kiro IDE / Cursor / Bolt / Lovable — React + Three.js + GSAP Stack
### Target: Cinematic, hand-crafted, human-designed feel. ZERO "AI-generated template" aesthetic.

---

## ⚠️ MANDATORY READ-FIRST INSTRUCTIONS FOR THE AI CODING AGENT

You are about to build a **flagship-tier gaming platform frontend**. This is NOT a generic dashboard, NOT a Bootstrap-template clone, and NOT a "purple gradient SaaS landing page." Every single visual decision in this brief was made deliberately to avoid the tell-tale signs of AI-generated UI. Before writing a single line of code, internalize these non-negotiable rules:

1. **No symmetric center-aligned hero text with a gradient blob behind it.** That is the #1 giveaway of AI-generated design. This hero is asymmetric, cinematic, and character-driven.
2. **No generic "rounded-2xl shadow-lg" card spam.** Every card type in this brief has a *distinct* personality, border treatment, and hover physics. Cards must NOT all look like clones of each other with just different text.
3. **No default Google Fonts pairing of Inter + Inter.** Use the exact type system specified below — a display face with character, paired with a clean workhorse body face.
4. **No emoji used as icons.** Every icon must be a custom-built SVG/Lucide icon, weight-matched, optically aligned, never an emoji glyph standing in for an icon.
5. **No flat, single-layer drop shadows.** Use layered shadows (ambient + key + rim glow) as defined in the elevation system below.
6. **No instant linear transitions.** Every interactive element uses GSAP easing curves defined below — nothing uses default `ease-in-out` CSS transitions for primary interactions.
7. **Micro-imperfections are intentional.** Slight rotation offsets on cards (0.5–1.5deg), hand-tuned easing overshoots, asymmetric padding where it serves visual rhythm — these are signs of a human designer's hand and must be preserved, not "cleaned up" into perfect grids.
8. **Do not invent new color tokens on the fly.** Use ONLY the design tokens defined in Section 1. If something needs a new color, derive it from the existing palette via opacity/blend, never introduce an arbitrary hex.
9. **Performance budget exists even at "ultra cinematic" tier.** Hero 3D scene must degrade gracefully — see Section 3.9 (Adaptive Quality System).
10. Build this **incrementally, file by file, in the exact order given in Section 12 (Build Order)**. Do not attempt to generate all files in one shot. Confirm each milestone renders before proceeding to the next.

This document is organized into 13 sections. Read all of them before starting Section 12 (Build Order).

---

## SECTION 1 — DESIGN SYSTEM & TOKENS

### 1.1 Brand Identity Recap
PixelVerse AI is a dark-mode-first, AI-powered game discovery and recommendation platform. The current screenshot shows a competent but generic "dark purple SaaS" aesthetic — flat cards, default shadows, centered hero text, stock-icon energy. The redesign must elevate this into something that feels like it was designed by a senior product designer at a AAA game studio's marketing team (think: the polish level of Riot Games' or FromSoftware's official site, crossed with the data-density confidence of a Vercel/Linear dashboard).

### 1.2 Color Tokens (CSS Custom Properties)

Define these in `:root` inside `src/styles/tokens.css`. Do not deviate from these hex values — they were chosen for contrast ratios and mutual harmony.

```css
:root {
  /* === BASE SURFACE LAYERS (darkest to lightest) === */
  --surface-void: #05050a;        /* true background, behind everything */
  --surface-base: #0a0a12;        /* page background */
  --surface-raised: #0e0e18;      /* card background level 1 */
  --surface-elevated: #131320;    /* card background level 2 (hover/active) */
  --surface-overlay: #181828;     /* modals, dropdowns, popovers */
  --surface-glass: rgba(14, 14, 24, 0.72); /* glassmorphism panels */

  /* === BORDER & DIVIDER LAYERS === */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-accent: rgba(139, 92, 246, 0.35);

  /* === BRAND ACCENT — Violet/Purple Core === */
  --accent-50:  #f5f3ff;
  --accent-100: #ede9fe;
  --accent-200: #ddd6fe;
  --accent-300: #c4b5fd;
  --accent-400: #a78bfa;
  --accent-500: #8b5cf6;   /* primary brand violet */
  --accent-600: #7c3aed;
  --accent-700: #6d28d9;
  --accent-800: #5b21b6;
  --accent-900: #4c1d95;

  /* === SECONDARY ACCENT — Ember/Fire (for fantasy-warrior hero glow) === */
  --ember-300: #fdba74;
  --ember-400: #fb923c;
  --ember-500: #f97316;
  --ember-600: #ea580c;
  --ember-glow: rgba(251, 146, 60, 0.45);

  /* === SUCCESS / SCORE GREEN (used for user score badges) === */
  --score-green-400: #4ade80;
  --score-green-500: #22c55e;
  --score-green-glow: rgba(74, 222, 128, 0.35);

  /* === SEMANTIC === */
  --danger-500: #ef4444;
  --warning-500: #f59e0b;
  --info-500: #38bdf8;

  /* === TEXT === */
  --text-primary: #f8f7fc;
  --text-secondary: #b4b0c4;
  --text-tertiary: #767288;
  --text-disabled: #4a4760;
  --text-on-accent: #ffffff;

  /* === ELEVATION / SHADOW SYSTEM (layered, never single flat shadow) === */
  --shadow-ambient: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-key-sm: 0 4px 12px rgba(0,0,0,0.35);
  --shadow-key-md: 0 12px 32px rgba(0,0,0,0.45);
  --shadow-key-lg: 0 24px 64px rgba(0,0,0,0.55);
  --shadow-rim-violet: 0 0 0 1px rgba(139,92,246,0.15), 0 0 24px rgba(139,92,246,0.12);
  --shadow-rim-ember: 0 0 0 1px rgba(251,146,60,0.18), 0 0 32px rgba(251,146,60,0.18);
  --shadow-card-rest: var(--shadow-ambient), var(--shadow-key-sm);
  --shadow-card-hover: var(--shadow-key-md), var(--shadow-rim-violet);
  --shadow-card-hero: var(--shadow-key-lg), var(--shadow-rim-ember);

  /* === RADII === */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 999px;

  /* === SPACING SCALE (8px base grid, with 4px half-steps) === */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* === GRADIENTS (use as utility classes, not inline arbitrary gradients) === */
  --gradient-hero-overlay: linear-gradient(180deg, rgba(5,5,10,0) 0%, rgba(5,5,10,0.4) 55%, rgba(5,5,10,0.96) 100%);
  --gradient-card-sheen: linear-gradient(115deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 40%);
  --gradient-accent-text: linear-gradient(135deg, var(--accent-300) 0%, var(--accent-500) 50%, var(--ember-400) 100%);
  --gradient-rune-glow: radial-gradient(circle, rgba(251,146,60,0.6) 0%, rgba(139,92,246,0.3) 45%, transparent 75%);

  /* === Z-INDEX SCALE === */
  --z-base: 0; --z-card: 10; --z-sticky-nav: 100; --z-dropdown: 200;
  --z-modal-backdrop: 900; --z-modal: 1000; --z-toast: 1100; --z-cursor: 9999;
}
```

### 1.3 Typography System

Two typefaces only. Do not add a third.

- **Display face (headlines, hero title, section titles):** `"Clash Display"` (load via Fontshare CDN — free, distinctive, not generic) — fallback stack `"Cabinet Grotesk", "General Sans", system-ui, sans-serif`. This face has the geometric-but-warm character that avoids the "default SaaS Inter-bold" look.
- **Body/UI face:** `"Inter"` — but ONLY for body copy, labels, buttons, nav. Set `font-feature-settings: "ss01", "cv11"` to enable Inter's alternate stylistic set so it doesn't read as the absolute-default Inter everyone recognizes.
- **Numeric/score face:** Use `"JetBrains Mono"` for all numeric scores (95, 8.8, 9.6 ratings, hour counts). Monospace numerals for scores is a deliberate "data-feels-precise" signal that generic templates skip.

```css
@font-face {
  font-family: 'Clash Display';
  src: url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
}

:root {
  --font-display: 'Clash Display', 'Cabinet Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.375rem;   /* 22px */
  --text-2xl: 1.75rem;   /* 28px */
  --text-3xl: 2.25rem;   /* 36px */
  --text-4xl: 3rem;      /* 48px */
  --text-5xl: 4rem;      /* 64px */
  --text-6xl: 5.5rem;    /* 88px */

  --tracking-tight: -0.03em;
  --tracking-snug: -0.015em;
  --tracking-normal: 0;
  --tracking-wide: 0.04em;
  --tracking-widest: 0.12em; /* used for eyebrow labels like "TRENDING NOW" */
}

.heading-hero {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(3.5rem, 6vw, 6rem);
  line-height: 0.95;
  letter-spacing: var(--tracking-tight);
}

.eyebrow-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.score-numeral {
  font-family: var(--font-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
```

### 1.4 Iconography Rules (CRITICAL for "not AI-generated" feel)

- Use **Lucide React** (`lucide-react`) as the base icon library — it has consistent 1.5–2px stroke weight and rounded joins that feel hand-finished, unlike mismatched icon-font sets.
- **Never mix icon families.** Do not combine Lucide with Font Awesome or emoji in the same view. Pick Lucide and stay there for 95% of icons.
- For the 3–4 "hero" custom icons (the PixelVerse logo mark, the AI Advisor sparkle, the AI Decision Engine bolt), build **custom inline SVGs by hand** with a 2px consistent stroke, rounded caps, and a subtle asymmetric flourish (e.g., the sparkle icon should have 4 rays of *uneven* length, not a perfect symmetric 4-point star — perfect symmetry is what makes AI-generated icons look sterile).
- Icon sizing scale: 14px (inline text icons), 18px (button icons), 20px (nav icons), 24px (card category icons), 32px+ (feature/section icons).
- Every icon that sits inside a colored badge (like "Trending", "Must Play") gets `stroke-width: 2.25` and is optically centered with `display: flex; align-items: center; justify-content: center` — never relying on inline/baseline alignment, which causes the slight vertical misalignment that screams "thrown together."

### 1.5 Motion Design Tokens (GSAP Easing Library)

Define a single `motionTokens.js` file imported everywhere. **Never use raw `"power2.out"` strings scattered through components** — always reference these named tokens so the whole site feels like one consistent hand:

```js
// src/lib/motionTokens.js
export const EASE = {
  // Primary UI easing — confident, slightly anticipatory
  signature: "cubic-bezier(0.16, 1, 0.3, 1)",       // GSAP custom ease "expo.out"-like but tuned
  // Snappy, for micro-interactions (button press, toggle)
  snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",         // overshoot ease — slight bounce-back, NOT cartoonish
  // Cinematic, for hero/scroll-triggered reveals
  cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
  // Soft settle, for modals/panels
  settle: "cubic-bezier(0.32, 0.72, 0, 1)",
  // Card hover lift
  lift: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

export const DURATION = {
  instant: 0.15,
  fast: 0.28,
  base: 0.45,
  slow: 0.7,
  cinematic: 1.2,
  heroEntrance: 1.8,
};

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
  cards: 0.1,
};
```

GSAP ease string registration (place in `src/lib/gsapSetup.js`):

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("signature", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("cinematic", "M0,0 C0.22,1 0.36,1 1,1");
CustomEase.create("snap", "M0,0 C0.34,1.56 0.64,1 1,1");
CustomEase.create("settle", "M0,0 C0.32,0.72 0,1 1,1");

ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger };
```

### 1.6 Elevation & Glassmorphism Rules

- Cards at rest: `background: var(--surface-raised); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-card-rest);`
- Cards on hover: lift `translateY(-6px) scale(1.015)`, border brightens to `--border-accent`, shadow shifts to `--shadow-card-hover`, AND a `--gradient-card-sheen` overlay fades in at 0→1 opacity (this diagonal sheen is what makes hover states feel "designed" rather than "just a shadow got bigger").
- Glass panels (AI Advisor chat panel, nav bar on scroll): `background: var(--surface-glass); backdrop-filter: blur(20px) saturate(140%); border: 1px solid var(--border-default);`
- Never use pure `#000000` for shadows — always rgba black at the opacities specified in tokens, layered (2-3 shadow layers minimum on any "important" element: hero card, modal, primary CTA button).

---

## SECTION 2 — LAYOUT ARCHITECTURE & INFORMATION HIERARCHY

### 2.1 Page Structure (top to bottom)

1. **Sticky Navigation Bar** (glass, shrinks on scroll)
2. **Cinematic 3D Hero Section** (full-viewport, fantasy warrior 3D character, carousel of 5 featured games)
3. **Trending Now Grid** (asymmetric bento-style grid, NOT uniform 4-column grid)
4. **AI Game Advisor Chat Panel** (split layout: chat left, "Why PixelVerse AI" feature list right)
5. **AI Decision Engine** (interactive constraint-based recommender — split layout: control panel left, "How it works" timeline right)
6. **Footer** (not shown in screenshot but required for completeness — see Section 9)

### 2.2 Grid System

- Max content width: `1440px`, centered, with `clamp(20px, 5vw, 80px)` horizontal padding.
- 12-column CSS grid for primary layout sections (`display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;`)
- Trending Now grid is explicitly **NOT** a perfect 4-up grid — see Section 5.2 for the bento asymmetric spec which is one of the key "this wasn't AI-generated" signals (AI-generated UIs default to perfectly uniform grids; human designers introduce intentional size variation to create visual hierarchy).

### 2.3 Section Dividers

Replace the plain horizontal line + small icon divider (seen in the screenshot between sections) with a custom **animated rune-line divider**: a thin gradient line that has a small rotating hexagonal gem/rune icon at center, which on scroll-into-view does a 360° GSAP rotation + scale-pulse + brief particle-burst (3-4 small particles using the existing Three.js renderer or a lightweight canvas particle, NOT a new heavy library). This becomes a recurring signature motif tying back to the fantasy-warrior hero theme.

```jsx
// src/components/SectionDivider.jsx
// Renders: <line gradient> —— <rotating rune glyph, custom SVG hexagon w/ inner spark> —— <line gradient>
// On scroll trigger: rune does 0→360deg rotate over 1.4s with "cinematic" ease,
// scale 0.8 -> 1.1 -> 1.0 (slight overshoot), opacity 0 -> 1,
// and spawns 6 particles that drift outward and fade (CSS keyframe, GPU-accelerated transform only)
```

---

## SECTION 3 — THE 3D CINEMATIC HERO SECTION (CORE CENTERPIECE)

This is the single most important section for hitting "next level." The current hero is a flat image carousel. The redesign replaces it with a **real-time 3D scene** featuring a low-poly-but-detailed stylized fantasy warrior character (Elden-Ring-adjacent silhouette: cloaked, weapon on back, standing in a glowing rune circle), rendered with React Three Fiber, with full GSAP-driven scroll choreography.

### 3.1 Tech Stack for This Section

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install gsap
npm install @react-three/rapier  # optional, only if adding physics-based particle debris
```

### 3.2 Scene Composition

```
<Canvas> (React Three Fiber root, full-bleed behind hero content)
 ├── <PerspectiveCamera> fov=42, position=[0, 1.6, 6.2]
 ├── <Environment preset="night" /> (subtle ambient reflection on character armor)
 ├── <fog> color="#05050a" near={8} far={22}
 ├── <ambientLight intensity={0.18} color="#3a2f55" />
 ├── <directionalLight> (key light) position=[3,5,2] intensity=1.4 color="#fdba74" castShadow
 ├── <pointLight> (rim/accent — the "rune glow" light) position=[0,0.4,1.5] intensity=3.2 color="#8b5cf6" distance=6
 ├── <FantasyWarrior /> — the main character group (see 3.3)
 ├── <RuneCircleGround /> — emissive glowing circular sigil on the ground plane beneath character (see 3.4)
 ├── <EmberParticles /> — rising ember/dust particle system (see 3.5)
 ├── <FloatingDebris /> — slow-rotating broken stone fragments orbiting at mid-distance (atmosphere)
 └── <EffectComposer> (postprocessing — see 3.7)
      ├── <Bloom intensity={0.65} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
      ├── <Vignette eskil={false} offset={0.32} darkness={0.65} />
      ├── <ChromaticAberration offset={[0.0006, 0.0004]} /> (extremely subtle, sells "cinematic" without looking gimmicky)
      └── <Noise opacity={0.025} /> (subtle film grain — kills the "too clean = AI render" look)
```

### 3.3 The Fantasy Warrior Character — Build Strategy

**Decision point for the agent:** There are two valid implementation paths depending on asset availability. Implement Path A first; Path B is the fallback/enhancement.

**PATH A — Procedural Low-Poly Character (no external model file needed, build entirely in Three.js geometry)**

Build the character as a grouped hierarchy of primitive-derived meshes, NOT a single imported GLB initially. This guarantees the build works with zero external dependencies and zero broken-asset risk:

```jsx
// src/components/hero/FantasyWarrior.jsx
function FantasyWarrior() {
  const group = useRef();
  const cloakRef = useRef();
  const weaponRef = useRef();

  // Idle breathing + cloak sway animation loop
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.6) * 0.04; // subtle breathing bob
    cloakRef.current.rotation.z = Math.sin(t * 0.4) * 0.025; // cloak drift
    cloakRef.current.rotation.x = Math.sin(t * 0.3 + 1) * 0.015;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* TORSO — tapered capsule, armor plated look via faceted geometry */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.7, 4, 8]} />
        <meshStandardMaterial color="#1c1a24" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* SHOULDER PAULDRONS — angular, asymmetric (one larger than other — signature silhouette detail) */}
      <mesh position={[-0.42, 1.55, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.22, 0.3, 6]} />
        <meshStandardMaterial color="#262030" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.42, 1.5, 0]} rotation={[0, 0, -0.25]} castShadow>
        <coneGeometry args={[0.16, 0.22, 6]} />
        <meshStandardMaterial color="#262030" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* HEAD — hooded, low-poly faceted */}
      <mesh position={[0, 1.92, 0.02]} castShadow>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshStandardMaterial color="#15131c" roughness={0.6} />
      </mesh>

      {/* GLOWING EYES — emissive, the focal "soul" detail */}
      <mesh position={[-0.06, 1.93, 0.19]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.06, 1.93, 0.19]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>

      {/* CLOAK — large back plane with subtle wind-driven vertex displacement */}
      <mesh ref={cloakRef} position={[0, 0.9, -0.28]} rotation={[0.15, 0, 0]}>
        <planeGeometry args={[1.1, 1.6, 12, 16]} />
        <meshStandardMaterial color="#0d0c14" side={2} roughness={0.9} />
      </mesh>

      {/* WEAPON — greatsword strapped to back, emissive rune etched on blade */}
      <group ref={weaponRef} position={[-0.1, 1.3, -0.3]} rotation={[0.1, 0, 2.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 1.4, 0.02]} />
          <meshStandardMaterial color="#3a3645" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <boxGeometry args={[0.015, 1.1, 0.001]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* LEGS — simple tapered capsules, slightly wide stance for "grounded warrior" pose */}
      <mesh position={[-0.16, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.7, 4, 6]} />
        <meshStandardMaterial color="#1a1822" roughness={0.5} />
      </mesh>
      <mesh position={[0.16, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.7, 4, 6]} />
        <meshStandardMaterial color="#1a1822" roughness={0.5} />
      </mesh>
    </group>
  );
}
```

**Why this approach reads as "human-made, not AI slop":** the asymmetric pauldrons (one larger than the other), the hand-tuned idle-breathing sine offsets, and the etched emissive rune line on the blade are exactly the kind of small bespoke details a real 3D artist adds — and exactly what's missing from auto-generated placeholder scenes.

**PATH B — Enhancement (if/when a real GLB character model is sourced)**

```jsx
import { useGLTF, useAnimations } from "@react-three/drei";

function FantasyWarriorGLB() {
  const group = useRef();
  const { scene, nodes, materials, animations } = useGLTF("/models/warrior.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions?.Idle?.reset().fadeIn(0.5).play();
    return () => actions?.Idle?.fadeOut(0.5);
  }, [actions]);

  return <primitive ref={group} object={scene} scale={1.4} position={[0, -1.1, 0]} />;
}

useGLTF.preload("/models/warrior.glb");
```

Recommended free/CC0 sources for the agent (or the user) to source a real GLB later: Mixamo (rigged humanoid + free animations), Quaternius (stylized low-poly character packs), Kenney.nl (asset packs). Wrap the GLTF loader in a `<Suspense fallback={<WarriorSilhouettePlaceholder />}>` so Path A's procedural silhouette can serve as the loading fallback even after Path B is added — this also functions as a perfect low-cost mobile fallback (see 3.9).

### 3.4 Rune Circle Ground Plane

```jsx
// src/components/hero/RuneCircleGround.jsx
function RuneCircleGround() {
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.z += delta * 0.03; });

  return (
    <group position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Base ground disc — near-black, faint reflective */}
      <mesh receiveShadow>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#08070d" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Rotating rune ring — emissive texture-mapped ring, this is the glowing
          circular sigil visible in the screenshot's hero background */}
      <mesh ref={ref} position={[0, 0, 0.01]}>
        <ringGeometry args={[1.1, 1.6, 64]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={1.8}
          emissiveMap={useLoader(THREE.TextureLoader, "/textures/rune-ring-alpha.png")}
          transparent
          toneMapped={false}
        />
      </mesh>
      {/* Inner counter-rotating smaller ring for depth */}
      <mesh rotation={[0,0, Math.PI/4]} position={[0,0,0.015]}>
        <ringGeometry args={[0.5, 0.65, 48]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.4} transparent opacity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}
```

*(Note for agent: if `/textures/rune-ring-alpha.png` doesn't exist yet, generate the ring procedurally using a `CanvasTexture` with hand-drawn arc segments + small tick marks at 12 positions around the circle — this avoids needing an external texture file and still produces a convincing "ancient rune circle" look.)*

### 3.5 Ember Particle System

```jsx
// src/components/hero/EmberParticles.jsx
function EmberParticles({ count = 180 }) {
  const points = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3]     = (Math.random() - 0.5) * 6;
      arr[i*3 + 1] = Math.random() * 4 - 0.6;
      arr[i*3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => new Float32Array(count).map(() => 0.15 + Math.random() * 0.35), [count]);

  useFrame((_, delta) => {
    const posAttr = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i*3 + 1] += speeds[i] * delta;
      posAttr.array[i*3]     += Math.sin(performance.now()*0.0003 + i) * 0.0015;
      if (posAttr.array[i*3+1] > 3.6) posAttr.array[i*3+1] = -0.6; // recycle
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#fdba74" transparent opacity={0.75} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
```

### 3.6 Camera & GSAP Scroll Choreography

This is what makes the hero feel "alive" rather than a static render. Bind GSAP ScrollTrigger to the React Three Fiber camera via a shared ref/state bridge:

```jsx
// src/components/hero/CameraRig.jsx
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();
  useFrame(() => {
    // scrollProgress is 0->1, driven by GSAP ScrollTrigger (see HeroSection.jsx)
    camera.position.z = gsap.utils.interpolate(6.2, 4.4, scrollProgress.current);
    camera.position.y = gsap.utils.interpolate(1.6, 2.4, scrollProgress.current);
    camera.lookAt(0, 1.3, 0);
  });
  return null;
}
```

```jsx
// src/components/hero/HeroSection.jsx (orchestration)
function HeroSection() {
  const scrollProgress = useRef(0);
  const heroRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ENTRANCE TIMELINE — plays once on mount, before any scroll
      const tl = gsap.timeline({ defaults: { ease: "cinematic" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.6 })
        .from(".hero-title-line", { opacity: 0, y: 60, duration: 0.9, stagger: 0.12 }, "-=0.3")
        .from(".hero-description", { opacity: 0, y: 20, duration: 0.7 }, "-=0.5")
        .from(".hero-tag-pill", { opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.06, ease: "snap" }, "-=0.4")
        .from(".hero-cta-group", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from(".hero-score-card", { opacity: 0, x: 30, scale: 0.9, duration: 0.8, stagger: 0.1, ease: "snap" }, "-=0.9");

      // SCROLL-DRIVEN PARALLAX / CAMERA PUSH
      gsap.to(scrollProgress, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Hero content fades + scales down as user scrolls past
      gsap.to(".hero-content-panel", {
        opacity: 0, y: -40, scale: 0.96,
        ease: "signature",
        scrollTrigger: { trigger: heroRef.current, start: "10% top", end: "70% top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-canvas-layer">
        <Canvas shadows camera={{ fov: 42 }}>
          <Suspense fallback={null}>
            {/* lights, FantasyWarrior, RuneCircleGround, EmberParticles, EffectComposer */}
            <CameraRig scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>
      <div className="hero-content-panel">
        {/* eyebrow / title / description / tags / CTAs / carousel arrows — see Section 4 */}
      </div>
    </section>
  );
}
```

### 3.7 Postprocessing Notes

- `Bloom` is what makes the ember glow and rune-circle emissive elements feel "next-gen" rather than flat-emissive. Keep `luminanceThreshold` tuned so ONLY emissive elements bloom — not the whole scene (avoids the washed-out "everything glows" amateur mistake).
- `ChromaticAberration` offset must stay extremely subtle (`0.0004–0.0008`) — anything higher looks like a cheap Instagram filter, not cinematic grading.
- Film grain `Noise` at `opacity 0.02–0.03` is the single highest-leverage trick for killing the "too-clean = AI render" look. Do not skip this layer.

### 3.8 Carousel Integration (5 featured games, as seen in screenshot's dot indicator)

The 3D scene's character/rune/lighting should subtly re-tint per active carousel slide (e.g., Cyberpunk slide → camera point light shifts toward `--info-500` cyan-blue; horror/dark-fantasy slide → stays ember/violet). Implement via GSAP tweening the `pointLight` color and `intensity` props through a small color-interpolation helper, NOT instant swaps — color transition duration `1.1s`, ease `"settle"`.

```jsx
function useCarouselLightSync(activeIndex, lightRef) {
  const palette = [
    { color: "#8b5cf6", intensity: 3.2 }, // Elden Ring slide — violet/ember
    { color: "#38bdf8", intensity: 2.6 }, // Cyberpunk slide — cyan
    { color: "#a78bfa", intensity: 3.0 }, // Baldur's Gate slide — soft violet
    { color: "#ef4444", intensity: 2.8 }, // Valorant slide — red accent
    { color: "#4ade80", intensity: 2.4 }, // Minecraft slide — green
  ];
  useEffect(() => {
    gsap.to(lightRef.current.color, { ...new THREE.Color(palette[activeIndex].color), duration: 1.1, ease: "settle" });
    gsap.to(lightRef.current, { intensity: palette[activeIndex].intensity, duration: 1.1, ease: "settle" });
  }, [activeIndex]);
}
```

### 3.9 Adaptive Quality System (CRITICAL — do not skip)

Detect device capability on mount and scale the scene accordingly. This is what separates "ultra cinematic for high-end PC" from "site that crashes on a mid-range phone":

```jsx
// src/hooks/useAdaptiveQuality.js
function useAdaptiveQuality() {
  const [tier, setTier] = useState("high");
  useEffect(() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    if (!gl || isMobile || cores <= 4 || mem <= 4) setTier("low");
    else if (cores <= 8 || mem <= 8) setTier("medium");
    else setTier("high");
  }, []);
  return tier;
}

// Usage: tier === "low" => disable Bloom/ChromaticAberration/Noise, reduce ember count to 40,
// drop shadow maps, use dpr={[1, 1]} on <Canvas>.
// tier === "medium" => keep Bloom only, ember count 100, dpr={[1, 1.5]}.
// tier === "high" => full effect stack, ember count 180, dpr={[1, 2]}.
```

Also wrap the entire `<Canvas>` in an `<ErrorBoundary>` that falls back to a static high-quality hero image/poster frame if WebGL context creation fails entirely (some corporate/locked-down browsers disable WebGL).

---

## SECTION 4 — HERO CONTENT PANEL (the text/CTA layer over the 3D scene)

### 4.1 Layout

Unlike the screenshot's symmetric centered-left-card-plus-right-image layout, restructure as:
- Content panel anchored bottom-left, NOT vertically centered — this asymmetric anchoring is itself a "designed, not generated" signal.
- 3D character occupies right-of-center and slightly back in z-space, partially bleeding off the right edge of the viewport (intentional crop — confident, not "fit everything safely inside a box").
- Glass-panel content card with `backdrop-filter: blur(24px)`, NOT a solid card — so the 3D scene is visible blurred-through it, tying the layers together.

### 4.2 Markup Structure

```jsx
<div className="hero-content-panel">
  <div className="hero-eyebrow-row">
    <span className="badge-must-play">
      <SparkleIcon size={14} /> MUST PLAY
    </span>
    <span className="hero-meta-dot">·</span>
    <span className="hero-meta-text">2022</span>
    <span className="hero-meta-dot">·</span>
    <span className="hero-meta-text">Action / RPG</span>
  </div>

  <h1 className="hero-title">
    <span className="hero-title-line">Elden</span>
    <span className="hero-title-line hero-title-accent">Ring</span>
  </h1>

  <p className="hero-description">
    FromSoftware's open-world masterpiece achieves near-perfection,
    merging breathtaking exploration mechanics with the studio's
    signature gameplay challenge.
  </p>

  <div className="hero-platform-tags">
    {["PC","PS5","Xbox Series X/S","PS4","Xbox One"].map(p => (
      <span key={p} className="hero-tag-pill">{p}</span>
    ))}
  </div>

  <div className="hero-cta-group">
    <button className="btn-primary-glow">
      <GamepadIcon size={18}/> Read Review
    </button>
    <button className="btn-secondary-ghost">
      <PlayIcon size={16}/> Watch Trailer
    </button>
  </div>
</div>

<div className="hero-score-stack">
  <ScoreCard label="CRITIC SCORE" value="95" variant="neutral" />
  <ScoreCard label="USER SCORE" value="8.8" variant="success" />
</div>

<CarouselControls activeIndex={activeIndex} total={5} onPrev={...} onNext={...} />
```

### 4.3 CSS for Key Hero Elements

```css
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end; /* anchors content panel to bottom */
  overflow: hidden;
  background: var(--surface-void);
}

.hero-canvas-layer {
  position: absolute; inset: 0; z-index: var(--z-base);
}

.hero-canvas-layer::after {
  content: "";
  position: absolute; inset: 0;
  background: var(--gradient-hero-overlay);
  pointer-events: none;
}

.hero-content-panel {
  position: relative; z-index: var(--z-card);
  max-width: 620px;
  margin: 0 var(--space-16) var(--space-16) var(--space-16);
  padding: var(--space-8);
  background: var(--surface-glass);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card-hero);
}

.badge-must-play {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--accent-600), var(--accent-500));
  border-radius: var(--radius-pill);
  font-size: var(--text-xs); font-weight: 700; letter-spacing: var(--tracking-wide);
  box-shadow: var(--shadow-rim-violet);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5.5vw, 5.5rem);
  font-weight: 600;
  line-height: 0.95;
  margin: var(--space-4) 0;
}
.hero-title-line { display: block; }
.hero-title-accent {
  background: var(--gradient-accent-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-primary-glow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--accent-600), var(--accent-500));
  border-radius: var(--radius-md);
  font-weight: 600;
  box-shadow: var(--shadow-rim-violet);
  transition: none; /* all motion handled by GSAP, not CSS transitions */
}
```

### 4.4 Button Hover Physics (GSAP, not CSS `:hover` transitions)

```jsx
function MagneticGlowButton({ children, ...props }) {
  const btnRef = useRef();
  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, { x: x * 0.18, y: y * 0.28, duration: 0.5, ease: "signature" });
  };
  const handleMouseLeave = () => gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: "snap" });
  const handleMouseEnter = () => gsap.to(btnRef.current, { scale: 1.04, boxShadow: "var(--shadow-rim-violet)", duration: 0.3 });

  return (
    <button ref={btnRef} className="btn-primary-glow" {...props}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      {children}
    </button>
  );
}
```

*Magnetic button physics* (cursor-following lean) is a high-signal "premium, hand-built" interaction pattern lifted from award-winning agency sites (Awwwards-tier), and is almost never present in AI-generated UI scaffolds.

---

## SECTION 5 — TRENDING NOW SECTION (Asymmetric Bento Grid + Card System)

### 5.1 Why NOT a uniform grid

The screenshot's 4-equal-column grid is the most "default template" part of the current design. Replace with a **bento-style asymmetric grid** where the top-rated/featured game (Elden Ring, 9.6) occupies a visually larger "hero card" slot, and remaining cards vary between 1x and 1.4x width based on a `featured` boolean flag — exactly how human-curated editorial game sites (IGN, PC Gamer redesigns) lay out "trending" rails.

### 5.2 Grid Spec

```css
.trending-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: var(--space-6);
}

/* First card spans 2 columns AND both rows — the "hero trending" slot */
.trending-card--featured {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 560px;
}

.trending-card--standard { grid-column: span 1; min-height: 320px; }

/* Responsive collapse */
@media (max-width: 1024px) {
  .trending-grid { grid-template-columns: repeat(2, 1fr); }
  .trending-card--featured { grid-column: span 2; grid-row: span 1; min-height: 380px; }
}
@media (max-width: 640px) {
  .trending-grid { grid-template-columns: 1fr; }
  .trending-card--featured, .trending-card--standard { grid-column: span 1; }
}
```

### 5.3 GameCard Component — Full Spec

```jsx
// src/components/cards/GameCard.jsx
function GameCard({ game, featured = false, index }) {
  const cardRef = useRef();
  const imgRef = useRef();
  const tiltRef = useRef({ x: 0, y: 0 });

  // Scroll-in reveal (staggered by index, NOT all-at-once)
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 48, rotateZ: index % 2 === 0 ? -1.2 : 1.2 },
      {
        opacity: 1, y: 0, rotateZ: 0, duration: 0.8, ease: "cinematic",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%" },
        delay: (index % 4) * 0.08,
      }
    );
  }, []);

  // 3D tilt-on-hover (subtle, max 6deg) — the single highest-impact "premium card" trick
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: px * 7, rotateX: -py * 7, scale: 1.02,
      duration: 0.5, ease: "signature", transformPerspective: 900,
    });
    gsap.to(imgRef.current, { x: px * 10, y: py * 10, scale: 1.08, duration: 0.6, ease: "signature" });
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "settle" });
    gsap.to(imgRef.current, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "settle" });
  };

  return (
    <article
      ref={cardRef}
      className={`game-card ${featured ? "game-card--featured" : "game-card--standard"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="game-card__media">
        <img ref={imgRef} src={game.cover} alt={game.title} loading="lazy" />
        <div className="game-card__media-gradient" />
        <div className="game-card__badges">
          <span className="badge-trending"><TrendingUpIcon size={13}/> Trending</span>
          <span className="badge-ai-score">AI {game.aiScore}</span>
        </div>
        <div className="game-card__rating">
          <StarIcon size={14} fill="var(--ember-400)" /> {game.rating}
        </div>
      </div>
      <div className="game-card__body">
        <h3 className="game-card__title">{game.title}</h3>
        <p className="game-card__desc">{game.description}</p>
        <div className="game-card__meta-row">
          <span><ClockIcon size={13}/> {game.playtime}</span>
          {game.multiplayer && <span><UsersIcon size={13}/> Multiplayer</span>}
        </div>
        <div className="game-card__tags">
          {game.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
        </div>
      </div>
      <div className="game-card__sheen" />
    </article>
  );
}
```

```css
.game-card {
  position: relative;
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-card-rest);
  will-change: transform;
}

.game-card__media { position: relative; aspect-ratio: 16/10; overflow: hidden; }
.game-card--featured .game-card__media { aspect-ratio: 4/5; }
.game-card__media img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.game-card__media-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(5,5,10,0.85) 100%);
}

.game-card__sheen {
  position: absolute; inset: 0;
  background: var(--gradient-card-sheen);
  opacity: 0; transition: opacity 0.4s ease;
  pointer-events: none; mix-blend-mode: overlay;
}
.game-card:hover .game-card__sheen { opacity: 1; }

.badge-trending {
  display: inline-flex; align-items: center; gap: 4px;
  background: linear-gradient(135deg, var(--ember-600), var(--ember-500));
  padding: 5px 10px; border-radius: var(--radius-pill);
  font-size: 11px; font-weight: 700;
}
.badge-ai-score {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  background: var(--surface-overlay); border: 1px solid var(--border-accent);
  padding: 5px 10px; border-radius: var(--radius-pill); color: var(--accent-300);
}
```

### 5.4 Distinct Card Personalities Per Section (avoid card-clone syndrome)

- **Trending cards**: tilt-on-hover + image zoom (above).
- **AI Decision Engine result card** (Section 7): flips on a Y-axis (`rotateY: 180deg`) to reveal match explanation on the back face — different interaction model entirely, so it doesn't feel like the same card reused.
- **Chat message bubbles** (Section 6): no tilt; instead a soft elastic scale-in on arrival (`scale: 0.92 -> 1.02 -> 1`, ease `"snap"`) to feel conversational, not card-like.

---

## SECTION 6 — AI GAME ADVISOR CHAT PANEL

### 6.1 Layout (split 60/40)

```jsx
<section className="advisor-section">
  <div className="advisor-chat-panel">
    <ChatHeader />
    <ChatMessageList />
    <SuggestedPrompts />
    <ChatInput />
  </div>
  <div className="advisor-features-panel">
    <h2>Why PixelVerse AI?</h2>
    <FeatureRow icon={<LockIcon/>} title="100% Private" desc="Powered by GitHub Models. Your queries stay secure." />
    <FeatureRow icon={<BrainIcon/>} title="Context-Aware" desc="Understands your gaming history, mood, and preferences." />
    <FeatureRow icon={<ZapIcon/>} title="Instant Results" desc="GPT-4o-mini delivers fast, accurate recommendations." />
    <FeatureRow icon={<GamepadIcon/>} title="Gamer-First" desc="Built by gamers. Understands genres, mechanics, and vibes." />
  </div>
</section>
```

### 6.2 Chat Message Entrance Animation

```jsx
function ChatMessage({ message, isAI }) {
  const ref = useRef();
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.92, y: 12, x: isAI ? -8 : 8 },
      { opacity: 1, scale: 1, y: 0, x: 0, duration: 0.45, ease: "snap" }
    );
  }, []);
  return (
    <div ref={ref} className={`chat-bubble ${isAI ? "chat-bubble--ai" : "chat-bubble--user"}`}>
      {message.text}
    </div>
  );
}
```

### 6.3 "Typing" Indicator (AI thinking state)

Three dots, NOT a generic CSS spinner — staggered scale-pulse using GSAP timeline `repeat: -1`:

```jsx
useEffect(() => {
  const dots = gsap.utils.toArray(".typing-dot");
  gsap.to(dots, { scale: 1.4, opacity: 1, duration: 0.4, stagger: { each: 0.15, repeat: -1, yoyo: true } });
}, []);
```

### 6.4 FeatureRow Hover Micro-interaction

Icon container does a subtle rotate + scale on row hover, color-shifts border from `--border-subtle` to a feature-specific accent (Lock=violet, Brain=ember, Zap=score-green, Gamepad=info-blue) — each feature gets its OWN accent tint, not all four sharing one color. This per-item color variation is another "human curated this, didn't just apply one theme color everywhere" signal.

---

## SECTION 7 — AI DECISION ENGINE (Interactive Constraint Builder)

### 7.1 Layout

Left: interactive control panel (time available / mood / device — pill-button selectors). Right: animated 3-step "How it works" vertical timeline with connecting line that draws itself in via GSAP `DrawSVG`-style stroke-dashoffset animation on scroll-into-view.

### 7.2 Pill Selector Component (Time/Mood/Device)

```jsx
function PillSelector({ options, selected, onSelect, icon: Icon }) {
  return (
    <div className="pill-selector-row">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`pill-option ${selected === opt.value ? "pill-option--active" : ""}`}
          onClick={() => onSelect(opt.value)}
        >
          {opt.icon && <opt.icon size={15} />}
          <span>{opt.label}</span>
          {opt.sublabel && <span className="pill-option__sub">{opt.sublabel}</span>}
        </button>
      ))}
    </div>
  );
}
```

Active state transition (GSAP, triggered on click via a `useLayoutEffect` watching `selected`):

```jsx
function animatePillSelection(activeEl) {
  gsap.fromTo(activeEl,
    { scale: 0.94 },
    { scale: 1, duration: 0.35, ease: "snap" }
  );
  gsap.to(activeEl, {
    boxShadow: "var(--shadow-rim-violet)",
    borderColor: "var(--accent-500)",
    backgroundColor: "var(--accent-600)",
    duration: 0.3, ease: "signature"
  });
}
```

### 7.3 "How It Works" Timeline — Self-Drawing Connector Line

```jsx
function HowItWorksTimeline({ steps }) {
  const lineRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const length = lineRef.current.getTotalLength();
    gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(lineRef.current, {
      strokeDashoffset: 0, duration: 1.6, ease: "cinematic",
      scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
    });
    steps.forEach((_, i) => {
      gsap.fromTo(`.timeline-step-${i}`,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.6, ease: "signature", delay: i * 0.25,
          scrollTrigger: { trigger: containerRef.current, start: "top 70%" } }
      );
    });
  }, []);

  return (
    <div ref={containerRef} className="timeline-container">
      <svg className="timeline-connector" viewBox="0 0 4 320">
        <path ref={lineRef} d="M2,0 L2,320" stroke="var(--accent-500)" strokeWidth="2" fill="none" />
      </svg>
      {steps.map((step, i) => (
        <div key={i} className={`timeline-step timeline-step-${i}`}>
          <span className="timeline-step__number">{String(i+1).padStart(2,"0")}</span>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 7.4 "Find My Games" Result Reveal

On submit, the button morphs into a loading state (icon rotates, text crossfades to "Analyzing..."), then the result area below expands height via GSAP (`height: "auto"` using a measured-height technique, NOT CSS `max-height` hacks which look janky) and the result card does the Y-axis flip mentioned in 5.4.

```jsx
function expandResultPanel(panelEl, contentEl) {
  const targetHeight = contentEl.scrollHeight;
  gsap.fromTo(panelEl, { height: 0, opacity: 0 }, { height: targetHeight, opacity: 1, duration: 0.7, ease: "cinematic" });
}
```

---

## SECTION 8 — STICKY NAVIGATION BAR

### 8.1 Behavior Spec

- At scroll top: transparent background, logo + nav links + auth buttons at full size, no border.
- After 60px scroll: GSAP-driven shrink — height `88px -> 64px`, background fades to `--surface-glass` with blur, a subtle `border-bottom: 1px solid var(--border-subtle)` fades in, logo scales `1 -> 0.88`.
- Implement via `ScrollTrigger` with `start: "top top"`, `end: "+=60"`, `scrub: true` — NOT a scroll-event-listener + setState (causes jank); ScrollTrigger handles this on a GPU-friendly RAF loop.

```jsx
useEffect(() => {
  gsap.to(".navbar", {
    height: 64, backgroundColor: "var(--surface-glass)", backdropFilter: "blur(20px)",
    borderColor: "var(--border-subtle)",
    scrollTrigger: { start: "top top", end: "+=60", scrub: true },
  });
  gsap.to(".navbar-logo", { scale: 0.88, scrollTrigger: { start: "top top", end: "+=60", scrub: true } });
}, []);
```

### 8.2 Nav Link Underline Interaction

Each nav link gets an animated underline that draws left-to-right on hover (`scaleX: 0 -> 1`, `transform-origin: left`) and retracts right-to-left on leave — directional retraction (not just fade) is a small but telling "designed interaction" detail.

---

## SECTION 9 — FOOTER (required addition, not in original screenshot)

Build a footer with: brand column (logo + tagline + social icons), 3 link columns (Platform / Resources / Legal), and a bottom bar with copyright + a subtle "Built with PixelVerse AI" animated badge that pulses softly (`opacity: 0.6 -> 1`, `duration: 2.4s`, `repeat: -1`, `yoyo: true`, `ease: "sine.inOut"`). Footer background uses `--surface-void` (darker than page background) to create clear visual closure.

---

## SECTION 10 — GLOBAL MICRO-INTERACTIONS CHECKLIST

Apply these consistently sitewide — this checklist is what makes the *whole* site feel like one cohesive human hand rather than disjointed AI-assembled sections:

1. **Custom cursor** (desktop only, `tier !== "low"`): a small 8px dot that lerps toward actual cursor position with slight lag (`gsap.to(cursorDot, { x, y, duration: 0.15, ease: "signature" })`), and scales to 2.5x with an outline ring when hovering any clickable element.
2. **Page transition**: on route change (if multi-page), a brief 0.4s violet-to-transparent wipe overlay, not an abrupt cut.
3. **Image loading**: every game cover image loads with a low-res blurred placeholder (`filter: blur(20px)`) that sharpens (`blur(0)`, `duration: 0.6`) once loaded — never a jarring pop-in.
4. **Number count-up**: all score numerals (95, 8.8, 9.6, etc.) animate counting up from 0 on scroll-into-view using `gsap.to({val:0}, {val: target, duration: 1.2, ease:"signature", onUpdate: () => setDisplay(Math.round(val))})`.
5. **Scrollbar styling**: custom thin scrollbar (`8px` wide, `--accent-600` thumb, `--surface-base` track, rounded) — default browser scrollbars are another subtle "didn't finish polishing" tell.
6. **Focus states**: every interactive element has a visible, on-brand focus ring (`outline: 2px solid var(--accent-400); outline-offset: 2px`) for accessibility — never `outline: none` without a replacement.
7. **Reduced motion respect**: wrap all GSAP entrance/scroll animations in a check for `window.matchMedia('(prefers-reduced-motion: reduce)')` and provide instant-appear fallbacks. This is both an accessibility requirement and a sign of careful, professional engineering.

---

## SECTION 10A — MOCK DATA FILE (complete, ready to paste)

This is the exact mock dataset the AI agent should use to populate Trending Now, the hero carousel, and the AI Decision Engine demo results. Matching the screenshot's real entries (Elden Ring, Cyberpunk 2077, Baldur's Gate 3, Valorant, Minecraft) keeps the visual QA process honest — the agent can directly compare its output against the reference screenshot.

```js
// src/data/games.mock.js

export const HERO_SLIDES = [
  {
    id: "elden-ring",
    title: "Elden Ring",
    year: 2022,
    genre: "Action / RPG",
    tag: "MUST PLAY",
    description:
      "FromSoftware's open-world masterpiece achieves near-perfection, merging breathtaking exploration mechanics with the studio's signature gameplay challenge.",
    platforms: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One"],
    criticScore: 95,
    userScore: 8.8,
    cover: "/assets/covers/elden-ring-hero.jpg",
    accentTheme: { color: "#8b5cf6", glow: "#fb923c", lightIntensity: 3.2 },
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    year: 2020,
    genre: "Action / RPG",
    tag: "REDEFINED",
    description:
      "A story-driven open world RPG set in Night City, a megalopolis obsessed with power, glamour, and unrelenting body modification.",
    platforms: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One"],
    criticScore: 86,
    userScore: 8.4,
    cover: "/assets/covers/cyberpunk-hero.jpg",
    accentTheme: { color: "#38bdf8", glow: "#a78bfa", lightIntensity: 2.6 },
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    year: 2023,
    genre: "RPG / Turn-based",
    tag: "GAME OF THE YEAR",
    description:
      "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.",
    platforms: ["PC", "PS5", "Xbox Series X/S"],
    criticScore: 96,
    userScore: 9.6,
    cover: "/assets/covers/bg3-hero.jpg",
    accentTheme: { color: "#a78bfa", glow: "#7c3aed", lightIntensity: 3.0 },
  },
  {
    id: "valorant",
    title: "Valorant",
    year: 2020,
    genre: "FPS / Tactical Shooter",
    tag: "ESPORTS FAVORITE",
    description:
      "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities in high-stakes competitive play.",
    platforms: ["PC"],
    criticScore: 80,
    userScore: 8.7,
    cover: "/assets/covers/valorant-hero.jpg",
    accentTheme: { color: "#ef4444", glow: "#f97316", lightIntensity: 2.8 },
  },
  {
    id: "minecraft",
    title: "Minecraft",
    year: 2011,
    genre: "Sandbox / Survival",
    tag: "ALL-TIME CLASSIC",
    description:
      "A game about placing blocks and going on adventures. Explore randomly generated worlds and build everything from the simplest of homes to the grandest of castles.",
    platforms: ["PC", "PS5", "Xbox Series X/S", "Mobile", "Switch"],
    criticScore: 93,
    userScore: 9.2,
    cover: "/assets/covers/minecraft-hero.jpg",
    accentTheme: { color: "#4ade80", glow: "#22c55e", lightIntensity: 2.4 },
  },
];

export const TRENDING_GAMES = [
  {
    id: "elden-ring",
    title: "Elden Ring",
    description: "An action RPG set in the Lands Between, featuring an open world crafted by Hidetaka Miyazaki and George R. R. Martin.",
    cover: "/assets/covers/elden-ring-card.jpg",
    rating: 9.6,
    aiScore: 95,
    playtime: "60-100h",
    multiplayer: false,
    tags: ["RPG", "Action"],
    featured: true, // occupies the bento "hero" slot
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description: "A story-driven open world RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification.",
    cover: "/assets/covers/cyberpunk-card.jpg",
    rating: 8.9,
    aiScore: 88,
    playtime: "50-80h",
    multiplayer: false,
    tags: ["RPG", "Action"],
    featured: false,
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.",
    cover: "/assets/covers/bg3-card.jpg",
    rating: 9.8,
    aiScore: 98,
    playtime: "100-200h",
    multiplayer: true,
    tags: ["RPG", "Turn-based"],
    featured: false,
  },
  {
    id: "valorant",
    title: "Valorant",
    description: "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.",
    cover: "/assets/covers/valorant-card.jpg",
    rating: 8.7,
    aiScore: 85,
    playtime: "Unlimited",
    multiplayer: true,
    tags: ["FPS", "Tactical Shooter"],
    featured: false,
  },
  {
    id: "minecraft",
    title: "Minecraft",
    description: "A game about placing blocks and going on adventures. Explore randomly generated worlds and build anything.",
    cover: "/assets/covers/minecraft-card.jpg",
    rating: 9.2,
    aiScore: 90,
    playtime: "Unlimited",
    multiplayer: true,
    tags: ["Sandbox", "Survival"],
    featured: false,
  },
];

export const ADVISOR_SUGGESTED_PROMPTS = [
  "What game should I play if I love Elden Ring?",
  "I want something relaxing tonight",
  "Best co-op games for friends?",
];

export const ADVISOR_FEATURES = [
  {
    id: "private",
    icon: "Lock",
    title: "100% Private",
    description: "Powered by GitHub Models. Your queries stay secure.",
    accent: "violet",
  },
  {
    id: "context",
    icon: "Brain",
    title: "Context-Aware",
    description: "Understands your gaming history, mood, and preferences.",
    accent: "ember",
  },
  {
    id: "instant",
    icon: "Zap",
    title: "Instant Results",
    description: "GPT-4o-mini delivers fast, accurate recommendations.",
    accent: "green",
  },
  {
    id: "gamer-first",
    icon: "Gamepad2",
    title: "Gamer-First",
    description: "Built by gamers. Understands genres, mechanics, and vibes.",
    accent: "blue",
  },
];

export const DECISION_ENGINE_OPTIONS = {
  timeAvailable: [
    { value: 30, label: "30 min" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
    { value: 300, label: "5+ hours" },
  ],
  mood: [
    { value: "chill", label: "Chill", icon: "Coffee" },
    { value: "action", label: "Action", icon: "Swords" },
    { value: "competitive", label: "Competitive", icon: "Trophy" },
    { value: "adventurous", label: "Adventurous", icon: "Compass" },
    { value: "creative", label: "Creative", icon: "Palette" },
    { value: "social", label: "Social", icon: "Users" },
    { value: "horror", label: "Horror", icon: "Ghost" },
  ],
  device: [
    { value: "low-end", label: "Low-End", sublabel: "Older PC / Budget" },
    { value: "mid-range", label: "Mid-Range", sublabel: "PS4 / Mid PC" },
    { value: "high-end", label: "High-End", sublabel: "PS5 / RTX PC" },
  ],
};

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Set your constraints",
    description: "Tell us how much time you have, your current mood, and what device you're on.",
  },
  {
    number: "02",
    title: "AI analyzes your profile",
    description: "GPT-4o-mini cross-references your inputs against our game database to find the perfect match.",
  },
  {
    number: "03",
    title: "Get your recommendation",
    description: "Receive a tailored game pick with a match score and explanation — no generic answers.",
  },
];
```

---

## SECTION 10B — COMPLETE COMPONENT CSS (ScoreCard, Navbar, Footer, FeatureRow, PillSelector, Timeline, Chat)

The agent must NOT improvise these styles loosely — paste them verbatim into their respective CSS modules and adjust only where component prop names differ.

### 10B.1 ScoreCard (Critic Score / User Score boxes from hero)

```jsx
// src/components/cards/ScoreCard.jsx
function ScoreCard({ label, value, variant = "neutral" }) {
  const ref = useRef();
  const displayRef = useRef();

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, x: 24, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "snap", delay: 0.6 }
    );
    const counter = { val: 0 };
    const target = parseFloat(value);
    gsap.to(counter, {
      val: target, duration: 1.3, delay: 0.9, ease: "signature",
      onUpdate: () => {
        displayRef.current.textContent = target % 1 === 0
          ? Math.round(counter.val)
          : counter.val.toFixed(1);
      },
    });
  }, [value]);

  return (
    <div ref={ref} className={`score-card score-card--${variant}`}>
      <span ref={displayRef} className="score-card__value score-numeral">0</span>
      <span className="score-card__label eyebrow-label">{label}</span>
    </div>
  );
}
```

```css
.score-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 96px; padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-card-rest);
}
.score-card--neutral { border-color: var(--border-default); }
.score-card--success {
  border-color: rgba(74, 222, 128, 0.35);
  box-shadow: var(--shadow-ambient), 0 0 24px var(--score-green-glow);
}
.score-card__value {
  font-size: var(--text-3xl);
  color: var(--text-primary);
  line-height: 1;
}
.score-card--success .score-card__value { color: var(--score-green-400); }
.score-card__label { margin-top: var(--space-1); font-size: 10px; }
```

### 10B.2 Navbar

```jsx
// src/components/layout/Navbar.jsx
function Navbar() {
  const navRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top top", end: "+=60", scrub: true,
      onUpdate: (self) => {
        gsap.to(navRef.current, {
          height: gsap.utils.interpolate(88, 64, self.progress),
          backgroundColor: self.progress > 0 ? "var(--surface-glass)" : "transparent",
          backdropFilter: self.progress > 0 ? "blur(20px) saturate(140%)" : "none",
          borderBottomColor: self.progress > 0 ? "var(--border-subtle)" : "transparent",
          duration: 0.1, overwrite: "auto",
        });
        gsap.to(logoRef.current, { scale: gsap.utils.interpolate(1, 0.88, self.progress), overwrite: "auto" });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <nav ref={navRef} className="navbar">
      <div ref={logoRef} className="navbar__logo">
        <GamepadIcon size={22} />
        <div>
          <span className="navbar__logo-name">PixelVerse</span>
          <span className="navbar__logo-tag">AI GAMING</span>
        </div>
      </div>
      <ul className="navbar__links">
        {["Home", "Explore", "Profile"].map(link => (
          <li key={link} className="navbar__link-item">
            <a href={`#${link.toLowerCase()}`}>{link}<span className="navbar__link-underline" /></a>
          </li>
        ))}
      </ul>
      <div className="navbar__actions">
        <button className="btn-ghost-sm">Log In</button>
        <button className="btn-primary-glow btn-primary-glow--sm">Sign Up</button>
        <button className="navbar__theme-toggle" aria-label="Toggle theme"><MoonIcon size={18}/></button>
      </div>
    </nav>
  );
}
```

```css
.navbar {
  position: sticky; top: 0; z-index: var(--z-sticky-nav);
  height: 88px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--space-10);
  border-bottom: 1px solid transparent;
  transition: none; /* GSAP-driven only */
}
.navbar__logo { display: flex; align-items: center; gap: var(--space-2); }
.navbar__logo-name { font-family: var(--font-display); font-weight: 600; font-size: var(--text-lg); display: block; }
.navbar__logo-tag { font-size: 10px; letter-spacing: var(--tracking-widest); color: var(--text-tertiary); }
.navbar__links { display: flex; gap: var(--space-8); list-style: none; }
.navbar__link-item a {
  position: relative; font-size: var(--text-sm); font-weight: 500; color: var(--text-secondary);
  padding-bottom: 6px;
}
.navbar__link-underline {
  position: absolute; left: 0; bottom: 0; height: 2px; width: 100%;
  background: var(--gradient-accent-text);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s var(--ease-signature, cubic-bezier(0.16,1,0.3,1));
}
.navbar__link-item a:hover .navbar__link-underline { transform: scaleX(1); }
.navbar__actions { display: flex; align-items: center; gap: var(--space-3); }
```

### 10B.3 Footer

```jsx
// src/components/layout/Footer.jsx
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <div className="navbar__logo">
            <GamepadIcon size={22} />
            <span className="navbar__logo-name">PixelVerse</span>
          </div>
          <p className="site-footer__tagline">AI-powered game discovery, built by gamers, for gamers.</p>
          <div className="site-footer__socials">
            {["Twitter", "Discord", "Github", "Youtube"].map(s => (
              <a key={s} href="#" className="site-footer__social-icon" aria-label={s}><SocialIcon name={s} size={18}/></a>
            ))}
          </div>
        </div>
        <FooterColumn title="Platform" links={["Explore", "Trending", "AI Advisor", "Decision Engine"]} />
        <FooterColumn title="Resources" links={["Documentation", "API", "Changelog", "Status"]} />
        <FooterColumn title="Legal" links={["Privacy Policy", "Terms of Service", "Cookie Settings"]} />
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} PixelVerse AI. All rights reserved.</span>
        <span className="site-footer__badge">
          <span className="site-footer__badge-pulse" /> Built with PixelVerse AI
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="site-footer__column">
      <h4>{title}</h4>
      <ul>{links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
    </div>
  );
}
```

```css
.site-footer { background: var(--surface-void); border-top: 1px solid var(--border-subtle); padding: var(--space-16) var(--space-10) var(--space-8); }
.site-footer__top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: var(--space-12); max-width: 1440px; margin: 0 auto; }
.site-footer__tagline { color: var(--text-tertiary); font-size: var(--text-sm); margin: var(--space-3) 0 var(--space-5); max-width: 280px; }
.site-footer__socials { display: flex; gap: var(--space-3); }
.site-footer__social-icon {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); color: var(--text-secondary);
}
.site-footer__social-icon:hover { border-color: var(--border-accent); color: var(--accent-300); }
.site-footer__column h4 { font-size: var(--text-sm); margin-bottom: var(--space-4); color: var(--text-primary); }
.site-footer__column ul { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.site-footer__column a { font-size: var(--text-sm); color: var(--text-tertiary); }
.site-footer__column a:hover { color: var(--text-primary); }
.site-footer__bottom {
  display: flex; justify-content: space-between; align-items: center;
  max-width: 1440px; margin: var(--space-12) auto 0; padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
  font-size: var(--text-xs); color: var(--text-tertiary);
}
.site-footer__badge { display: inline-flex; align-items: center; gap: 6px; }
.site-footer__badge-pulse {
  width: 6px; height: 6px; border-radius: 50%; background: var(--score-green-400);
  animation: badgePulse 2.4s ease-in-out infinite;
}
@keyframes badgePulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
```

### 10B.4 FeatureRow (with per-feature accent tint, per Section 6.4)

```jsx
// src/components/advisor/FeatureRow.jsx
const ACCENT_MAP = {
  violet: { border: "var(--border-accent)", icon: "var(--accent-400)", glow: "var(--shadow-rim-violet)" },
  ember:  { border: "rgba(251,146,60,0.35)", icon: "var(--ember-400)", glow: "var(--shadow-rim-ember)" },
  green:  { border: "rgba(74,222,128,0.35)", icon: "var(--score-green-400)", glow: "0 0 24px var(--score-green-glow)" },
  blue:   { border: "rgba(56,189,248,0.35)", icon: "var(--info-500)", glow: "0 0 24px rgba(56,189,248,0.3)" },
};

function FeatureRow({ icon: Icon, title, description, accent }) {
  const iconBoxRef = useRef();
  const theme = ACCENT_MAP[accent];

  const handleEnter = () => gsap.to(iconBoxRef.current, {
    rotate: 8, scale: 1.08, borderColor: theme.border, boxShadow: theme.glow,
    duration: 0.4, ease: "snap",
  });
  const handleLeave = () => gsap.to(iconBoxRef.current, {
    rotate: 0, scale: 1, borderColor: "var(--border-subtle)", boxShadow: "none",
    duration: 0.4, ease: "settle",
  });

  return (
    <div className="feature-row" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div ref={iconBoxRef} className="feature-row__icon-box" style={{ color: theme.icon }}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h4 className="feature-row__title">{title}</h4>
        <p className="feature-row__desc">{description}</p>
      </div>
    </div>
  );
}
```

```css
.feature-row { display: flex; gap: var(--space-4); padding: var(--space-5); border-radius: var(--radius-md); }
.feature-row__icon-box {
  flex-shrink: 0; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
}
.feature-row__title { font-size: var(--text-base); font-weight: 600; margin-bottom: 4px; }
.feature-row__desc { font-size: var(--text-sm); color: var(--text-tertiary); line-height: 1.5; }
```

### 10B.5 PillSelector (full CSS)

```css
.pill-selector-row { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-6); }
.pill-option {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  background: var(--surface-raised);
  color: var(--text-secondary);
  font-size: var(--text-sm); font-weight: 500;
}
.pill-option__sub { font-size: 11px; color: var(--text-tertiary); display: block; }
.pill-option--active {
  background: var(--accent-600);
  border-color: var(--accent-500);
  color: var(--text-on-accent);
  box-shadow: var(--shadow-rim-violet);
}
```

### 10B.6 Timeline (container + step CSS)

```css
.timeline-container { position: relative; padding-left: var(--space-8); }
.timeline-connector { position: absolute; left: 8px; top: 0; height: 100%; width: 4px; }
.timeline-step { position: relative; padding-bottom: var(--space-10); }
.timeline-step__number {
  position: absolute; left: -52px; top: 0;
  font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700;
  color: var(--accent-400); background: var(--surface-base);
  width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid var(--border-accent);
  display: flex; align-items: center; justify-content: center;
}
.timeline-step h4 { font-size: var(--text-lg); margin-bottom: var(--space-2); }
.timeline-step p { color: var(--text-tertiary); font-size: var(--text-sm); line-height: 1.6; max-width: 380px; }
```

### 10B.7 Chat Bubble CSS

```css
.advisor-chat-panel {
  background: var(--surface-glass); backdrop-filter: blur(20px);
  border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4);
  min-height: 520px;
}
.chat-bubble {
  max-width: 78%; padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md); font-size: var(--text-sm); line-height: 1.6;
}
.chat-bubble--ai {
  align-self: flex-start; background: var(--surface-elevated);
  border: 1px solid var(--border-subtle); border-bottom-left-radius: 4px;
}
.chat-bubble--user {
  align-self: flex-end; background: linear-gradient(135deg, var(--accent-600), var(--accent-500));
  color: var(--text-on-accent); border-bottom-right-radius: 4px;
}
.typing-indicator { display: flex; gap: 4px; padding: var(--space-3) var(--space-4); }
.typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-400); opacity: 0.4; }
.chat-input-row {
  display: flex; align-items: center; gap: var(--space-3);
  background: var(--surface-raised); border: 1px solid var(--border-default);
  border-radius: var(--radius-pill); padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
}
.chat-input-row input { flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: var(--text-sm); }
.chat-input-row input:focus { outline: none; }
.chat-send-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-600), var(--accent-500));
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.suggested-prompts { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2); }
.suggested-prompt-chip {
  font-size: var(--text-xs); padding: 8px 14px; border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle); background: var(--surface-raised); color: var(--text-secondary);
}
.suggested-prompt-chip:hover { border-color: var(--border-accent); color: var(--accent-300); }
```

---

## SECTION 10C — COMMON REUSABLE COMPONENTS (FULL IMPLEMENTATION)

### 10C.1 CustomCursor

```jsx
// src/components/common/CustomCursor.jsx
function CustomCursor() {
  const dotRef = useRef();
  const ringRef = useRef();
  const tier = useAdaptiveQuality();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (tier === "low" || reducedMotion) return;
    const pos = { x: 0, y: 0 };
    const move = (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      gsap.to(dotRef.current, { x: pos.x, y: pos.y, duration: 0.08, ease: "signature" });
      gsap.to(ringRef.current, { x: pos.x, y: pos.y, duration: 0.22, ease: "signature" });
    };
    const onEnterTarget = () => gsap.to(ringRef.current, { scale: 2.5, opacity: 0.4, duration: 0.3, ease: "snap" });
    const onLeaveTarget = () => gsap.to(ringRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "settle" });

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .game-card, .pill-option").forEach(el => {
      el.addEventListener("mouseenter", onEnterTarget);
      el.addEventListener("mouseleave", onLeaveTarget);
    });
    return () => window.removeEventListener("mousemove", move);
  }, [tier, reducedMotion]);

  if (tier === "low" || reducedMotion) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
```

```css
.custom-cursor-dot, .custom-cursor-ring {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: var(--z-cursor);
  transform: translate(-50%, -50%); border-radius: 50%;
}
.custom-cursor-dot { width: 8px; height: 8px; background: var(--accent-400); }
.custom-cursor-ring { width: 32px; height: 32px; border: 1.5px solid var(--accent-400); opacity: 0.6; }
@media (hover: none) { .custom-cursor-dot, .custom-cursor-ring { display: none; } }
```

### 10C.2 CountUpNumber (standalone reusable version)

```jsx
// src/components/common/CountUpNumber.jsx
function CountUpNumber({ value, decimals = 0, duration = 1.2, suffix = "" }) {
  const ref = useRef();
  const spanRef = useRef();

  useEffect(() => {
    const counter = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: ref.current, start: "top 90%", once: true,
      onEnter: () => gsap.to(counter, {
        val: value, duration, ease: "signature",
        onUpdate: () => { spanRef.current.textContent = counter.val.toFixed(decimals) + suffix; },
      }),
    });
    return () => trigger.kill();
  }, [value]);

  return <span ref={ref}><span ref={spanRef} className="score-numeral">0</span></span>;
}
```

### 10C.3 useReducedMotion hook

```js
// src/hooks/useReducedMotion.js
import { useState, useEffect } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

### 10C.4 useScrollProgress hook (generic, reusable beyond hero)

```js
// src/hooks/useScrollProgress.js
import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsapSetup";

export function useScrollProgress(targetRef, options = {}) {
  const progress = useRef(0);
  useEffect(() => {
    if (!targetRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: targetRef.current,
      start: options.start || "top top",
      end: options.end || "bottom top",
      scrub: options.scrub ?? 0.6,
      onUpdate: (self) => { progress.current = self.progress; },
    });
    return () => trigger.kill();
  }, [targetRef]);
  return progress;
}
```

### 10C.5 WarriorSilhouettePlaceholder (Suspense fallback / low-tier fallback)

A lightweight 2D-plane "silhouette card" shown while the heavier procedural or GLB warrior is still mounting, or permanently substituted on `tier === "low"` devices instead of the full mesh group:

```jsx
// src/components/hero/WarriorSilhouettePlaceholder.jsx
function WarriorSilhouettePlaceholder() {
  return (
    <mesh position={[0, 0.9, 0]}>
      <planeGeometry args={[1.4, 2.2]} />
      <meshBasicMaterial color="#0d0c14" transparent opacity={0.92} />
    </mesh>
  );
}
```

### 10C.6 FloatingDebris (ambient mid-distance rotating fragments)

```jsx
// src/components/hero/FloatingDebris.jsx
function FloatingDebris({ count = 6 }) {
  const groupRef = useRef();
  const fragments = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: [(Math.random() - 0.5) * 5, Math.random() * 2 + 0.5, (Math.random() - 0.5) * 3 - 1],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.06 + Math.random() * 0.1,
      speed: 0.1 + Math.random() * 0.2,
    })), [count]);

  useFrame((state) => {
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += fragments[i].speed * 0.01;
      child.rotation.y += fragments[i].speed * 0.015;
      child.position.y = fragments[i].pos[1] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#2a2638" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
```

### 10C.7 CarouselControls

```jsx
// src/components/hero/CarouselControls.jsx
function CarouselControls({ activeIndex, total, onPrev, onNext }) {
  return (
    <div className="carousel-controls">
      <button className="carousel-arrow carousel-arrow--prev" onClick={onPrev} aria-label="Previous slide">
        <ChevronLeftIcon size={20} />
      </button>
      <div className="carousel-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`carousel-dot ${i === activeIndex ? "carousel-dot--active" : ""}`} />
        ))}
      </div>
      <button className="carousel-arrow carousel-arrow--next" onClick={onNext} aria-label="Next slide">
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
}
```

```css
.carousel-controls { position: absolute; bottom: var(--space-10); right: var(--space-10); display: flex; align-items: center; gap: var(--space-4); z-index: var(--z-card); }
.carousel-arrow {
  width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--border-default); background: var(--surface-glass); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; color: var(--text-primary);
}
.carousel-dots { display: flex; gap: 6px; }
.carousel-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--border-strong); transition: none; }
.carousel-dot--active { width: 24px; background: var(--gradient-accent-text); }
```

GSAP for the active-dot width expansion (replacing the `transition: none` CSS placeholder above — dots must animate via GSAP for consistency with the rest of the motion system):

```jsx
useEffect(() => {
  gsap.utils.toArray(".carousel-dot").forEach((dot, i) => {
    gsap.to(dot, {
      width: i === activeIndex ? 24 : 6,
      backgroundColor: i === activeIndex ? "var(--accent-500)" : "var(--border-strong)",
      duration: 0.4, ease: "signature",
    });
  });
}, [activeIndex]);
```

---

## SECTION 10D — RESPONSIVE BEHAVIOR SPEC (mobile/tablet adaptations)

The 3D hero, bento grid, and split-panel sections all need explicit mobile rules — do not just let the desktop layout "squish":

- **Hero (< 768px):** Canvas stays full-bleed but `<Canvas dpr={[1,1]}>` and `tier` forces `"low"` regardless of detected hardware (mobile GPUs throttle aggressively under thermal load — assume low tier on all touch devices as a safety default, even high-end phones). Content panel becomes full-width with `border-radius` only on top corners, anchored to the very bottom of the viewport, `backdrop-filter` blur reduced to `12px` (cheaper to composite). Score cards stack horizontally below description instead of floating beside the carousel.
- **Trending grid (< 1024px):** Bento collapses to 2-column per Section 5.2; featured card keeps 2-column span but drops to single-row height.
- **Trending grid (< 640px):** Single column, all cards equal size, featured card loses special treatment (just appears first in DOM order).
- **Advisor / Decision Engine split panels (< 900px):** Stack vertically, chat/control-panel first, feature-list/timeline second — NOT side by side at any tablet breakpoint, since cramming a chat UI into a narrow column breaks usability.
- **Navbar (< 768px):** Collapses nav links into a hamburger triggering a full-screen GSAP-animated overlay menu (slide up `yPercent: 100 -> 0`, ease `"cinematic"`, staggered link reveal `0.06s` apart) — not a generic dropdown.
- **Custom cursor:** disabled entirely below `(hover: none)` media query (already handled in 10C.1's CSS) — touch devices never see it.

---

## SECTION 11 — FILE/FOLDER STRUCTURE

```
src/
├── components/
│   ├── hero/
│   │   ├── HeroSection.jsx
│   │   ├── FantasyWarrior.jsx
│   │   ├── WarriorSilhouettePlaceholder.jsx
│   │   ├── RuneCircleGround.jsx
│   │   ├── EmberParticles.jsx
│   │   ├── FloatingDebris.jsx
│   │   ├── CameraRig.jsx
│   │   └── CarouselControls.jsx
│   ├── cards/
│   │   ├── GameCard.jsx
│   │   ├── ScoreCard.jsx
│   │   └── ResultFlipCard.jsx
│   ├── advisor/
│   │   ├── ChatPanel.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── ChatInput.jsx
│   │   ├── SuggestedPrompts.jsx
│   │   └── FeatureRow.jsx
│   ├── decision-engine/
│   │   ├── DecisionEnginePanel.jsx
│   │   ├── PillSelector.jsx
│   │   └── HowItWorksTimeline.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── SectionDivider.jsx
│   └── common/
│       ├── MagneticGlowButton.jsx
│       ├── CustomCursor.jsx
│       └── CountUpNumber.jsx
├── hooks/
│   ├── useAdaptiveQuality.js
│   ├── useScrollProgress.js
│   └── useReducedMotion.js
├── lib/
│   ├── motionTokens.js
│   └── gsapSetup.js
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   └── components/  (one CSS module per component, co-located)
├── data/
│   └── games.mock.js
└── App.jsx
```

---

## SECTION 12 — BUILD ORDER (follow exactly, milestone-gated)

1. Scaffold project, install deps, create `tokens.css` + `motionTokens.js` + `gsapSetup.js`. Confirm fonts load.
2. Build static (non-3D) layout shell: Navbar, Footer, section containers with placeholder content. Confirm responsive grid works at 375px/768px/1440px.
3. Build `GameCard` + Trending bento grid with mock data (`games.mock.js` — 5 entries matching screenshot: Elden Ring, Cyberpunk 2077, Baldur's Gate 3, Valorant, Minecraft). Confirm tilt-hover + scroll-stagger reveal works.
4. Build AI Advisor chat panel UI (static mock messages first, no real API call needed yet) + Feature rows.
5. Build AI Decision Engine pill selectors + timeline, confirm self-drawing line animation.
6. **Now tackle the 3D hero** — start with Path A procedural `FantasyWarrior`, basic lighting, no postprocessing yet. Confirm it renders and idle-animates at 60fps on a mid-tier machine.
7. Add `RuneCircleGround` + `EmberParticles`. Confirm performance is still smooth.
8. Add `EffectComposer` postprocessing stack. Test on the adaptive-quality low/medium/high tiers explicitly.
9. Wire up `CameraRig` + GSAP ScrollTrigger scroll choreography + hero entrance timeline.
10. Wire carousel light-sync (3.8), Navbar shrink-on-scroll (Section 8), custom cursor (10.1).
11. Final pass: count-up numbers, image blur-up loading, scrollbar styling, focus states, reduced-motion fallbacks — the full Section 10 checklist.
12. Cross-browser + cross-device QA pass. Confirm Path A fallback silhouette displays correctly if GLB (Path B) is ever swapped in and fails to load.

---

## SECTION 13 — FINAL QUALITY BAR (self-check before calling it "done")

Before considering this redesign complete, the AI agent (or the developer reviewing its output) should verify:

- [ ] No two cards across the entire site share an identical hover animation — each card family (trending, result-flip, chat-bubble) has its own interaction signature.
- [ ] The hero does NOT look like a centered text block over a stock background — content is asymmetrically anchored, 3D character bleeds off-frame.
- [ ] Every icon is from one consistent family (Lucide) at consistent stroke-width, with 3-4 deliberately custom hand-built SVGs for brand-specific marks.
- [ ] Shadows are layered (minimum 2 shadow values) on every "important" surface — no single flat `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` anywhere.
- [ ] Color usage shows intentional per-feature variation (FeatureRow icons, carousel light-sync) rather than one accent color reused with zero variation.
- [ ] All entrance animations are staggered, never simultaneous fade-ins of multiple elements at once.
- [ ] The site runs acceptably (target 45fps+) on the "medium" adaptive-quality tier, and doesn't crash/freeze on "low" tier.
- [ ] `prefers-reduced-motion` is respected throughout.
- [ ] Typography uses the two-font system consistently — no stray default system-font fallback rendering visible due to a missing `@font-face`.
- [ ] Custom cursor, magnetic buttons, and the self-drawing timeline line are all present and functioning — these three details alone are what separate "ultra cinematic, human-crafted" from "competent template."

---

### END OF MASTER PROMPT — Paste this entire document into Kiro/Cursor as project context, then proceed through Section 12's Build Order step by step, confirming each milestone before advancing.
