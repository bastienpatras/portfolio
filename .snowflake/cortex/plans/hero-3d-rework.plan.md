# Plan: Hero 3D Rework -- Abstract Data-Viz Blocks

## Context

The current Hero3D (`src/components/3d/Hero3D.tsx`) renders 27 hardcoded wireframe boxes at 20% opacity. They're nearly invisible and don't convey the urban economics theme effectively. It uses React Three Fiber + drei (already installed).

## Design

A procedural grid of ~120 blocks on a ~12x12 grid. Each block has:
- **Height** driven by a radial gradient (taller in center, shorter at edges) with Perlin-like noise for organic variation
- **Color** mapped to height along a gradient: cool blue (short/peripheral) to warm red (tall/central) -- evoking a DPE energy label or property value heatmap
- **Material**: solid `MeshStandardMaterial` with slight metallic sheen (metalness 0.1, roughness 0.7) -- not wireframe
- **Entrance animation**: blocks rise from y=0 with staggered timing (center first, rippling outward) using a sine wave over ~2 seconds on mount
- **Idle animation**: gentle slow rotation (current 0.1 rad/s is fine) + subtle breathing effect (blocks oscillate height by ~5% with offset phases)
- **Gaps**: small gaps between blocks to show the grid pattern (like a city grid with streets)

```
  Visual impression (top-down):

  ░░░░░░░░░░░░
  ░░▒▒▒▒▒▒░░░░
  ░░▒▓▓▓▓▒▒░░░
  ░▒▓████▓▒░░░    █ = tall red (center)
  ░▒▓████▓▒░░░    ▓ = medium orange
  ░░▒▓▓▓▓▒▒░░░    ▒ = short yellow-blue
  ░░▒▒▒▒▒▒░░░░    ░ = very short blue
  ░░░░░░░░░░░░
```

### Color gradient (height-mapped)
- 0.0 (short): `#3b82f6` (blue-500)
- 0.33: `#8b5cf6` (violet-500) 
- 0.66: `#f59e0b` (amber-500)
- 1.0 (tall): `#ef4444` (red-500)

Interpolated via HSL for smooth transitions.

### Lighting
- Ambient light at 0.4 intensity (up from 0.6 -- let directional light do more work)
- One directional light from upper-right for clean shadows
- Subtle rim/back light from lower-left for depth

### Camera and positioning
- Keep existing camera position `[0, 0, 8]`
- Group positioned at `[5, -1.5, 0]` (shifted right to sit behind the text, slightly higher than current)
- Scale ~1.0
- Opacity raised to 35-40% on the container (up from 20%) so the visual actually reads

## Single file change

Only `src/components/3d/Hero3D.tsx` needs to be rewritten. No other files change.

The `Building` component becomes `Block` (a single instanced mesh with color prop). The `CityScape` component becomes `DataVizCity` with procedural generation. The `Scene` and `Hero3D` wrapper stay structurally the same.

## Performance

- ~120 boxes is lightweight for Three.js (each is just a box geometry)
- Entrance animation uses `useFrame` with an elapsed time ref, no spring physics library needed
- Reduced motion users still get the static gradient fallback

## Verification

- Visual check: blocks should form a clear radial gradient pattern, visible at 35-40% opacity behind the hero text
- Animation: blocks should rise smoothly on page load, then rotate gently
- Responsive: the 3D canvas is `absolute inset-0 pointer-events-none` so it fills the hero section regardless of viewport
- Performance: should render at 60fps on any modern device (120 simple meshes)
