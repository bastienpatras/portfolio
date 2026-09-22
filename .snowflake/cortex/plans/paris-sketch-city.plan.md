# Paris Sketch City — 3D Hero Redesign

## Aesthetic
**Glass-volume maquette** — semi-transparent grey volumes with visible edges, like a frosted architectural model. Monochrome palette, no color. Subtle surface shading gives depth.

## Color Palette (monochrome greys)
| Element | Color | Opacity |
|---------|-------|---------|
| Haussmannian blocks | `#94a3b8` (slate-400) | 0.35 |
| Mansard rooftops | `#64748b` (slate-500) | 0.5 |
| Eiffel Tower | `#475569` (slate-600) | 0.4 |
| Ground plane | `#f1f5f9` (slate-50) | 0.2 |
| Seine water | `#cbd5e1` (slate-300) | 0.25 |
| Bridges | `#94a3b8` | 0.5 |
| Edge outlines | `#334155` (slate-700) | 0.15 |

Container opacity: **0.45** (up slightly from 0.38 since buildings themselves are translucent)

## 3D Components

### 1. Eiffel Tower (center-back of scene)
- Simplified geometric silhouette — 4 angled legs converging to a tapered spire
- Built from 3 stacked sections: wide base lattice, middle platform, narrow top + antenna
- Implementation: custom geometry using `THREE.BufferGeometry` with vertices forming the iconic A-frame legs and tapering profile
- Height: tallest element (~5 units), positioned slightly off-center for visual interest
- Material: `MeshPhysicalMaterial` with transmission (glass-like), grey tint

### 2. Haussmannian Blocks (main urban fabric)
- **Shape**: Rectangular volumes, 6-7 floors tall (~1.2-1.5 units), elongated along boulevards
- **Mansard roofs**: Trapezoidal cap on each block (wider at base, angled inward) — this is the defining Paris roofline
- **Courtyards**: Some blocks are hollow U-shapes or C-shapes (open courtyard facing interior)
- **Alignment**: Placed along radial boulevards emanating from center, plus a grid in the fabric
- **Variation**: Slight height differences (±0.1), varied widths, some corner chamfers (like Place de l'Etoile)
- Material: translucent grey `MeshPhysicalMaterial` with `transmission: 0.6`, edges via `EdgesGeometry + LineSegments`

### 3. Seine River
- Curved path through the scene (gentle S-curve like the real Seine through central Paris)
- Rendered as a flat plane with slight transparency and a subtle ripple using vertex displacement
- Width: ~0.4 units
- Positioned to pass near/behind the Eiffel Tower (geographically accurate feel)

### 4. Bridges
- 3-4 small flat rectangles crossing the Seine at intervals
- Simple arch silhouette (half-cylinder or just a flat plank with rounded underside)
- Same grey translucent material

### 5. Boulevards
- Wide avenues radiating from the Eiffel Tower area (like real Paris radiating from Place de l'Etoile)
- Rendered as thin gaps in the building fabric + subtle ground-level lines
- 2-3 major boulevards + orthogonal streets

### 6. Edge Outlines
- Every building volume gets `EdgesGeometry` → `LineSegments` with thin grey lines
- This gives the sketch/plan feel — you can see through the translucent volumes to the edges behind

## Animation
- **Same slow emergence**: buildings rise from ground over 8-10 seconds
- **Eiffel Tower rises last**: delayed by +2s after surrounding buildings, dramatic slow reveal
- **Seine appears first**: the water plane fades in before buildings (setting the stage)
- **Stagger**: center-out ripple pattern, Haussmannian blocks rise in waves
- **Auto-rotation**: 0.04 rad/s (slightly slower than current)

## Scene Layout (top-down sketch)
```
          [Haussmann blocks]
    [blocks]    |    [blocks]
         \      |      /
    ~~~Seine~~~~|~~~~~Seine~~~
    ===bridge===|===bridge====
         /      |      \
    [blocks]  [EIFFEL] [blocks]
         \    TOWER    /
    [blocks]    |    [blocks]
          [Haussmann blocks]
```

## Technical Approach
- Replace `generateCity()` with `generateParis()` 
- New `EiffelTower` component (hand-crafted geometry)
- New `Seine` component (curved plane)
- Reuse instanced mesh pattern for Haussmannian blocks
- `MeshPhysicalMaterial` with `transmission` + `thickness` for glass look
- `EdgesGeometry` + `LineSegments` for sketch outlines on each building
