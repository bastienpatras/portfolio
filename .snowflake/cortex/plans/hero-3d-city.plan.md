# Plan: 3D City Rising from the Ground

## Design Direction

Drop the globe entirely. Build a **detailed isometric cityscape** that sits on the right side of the hero and **rises from a flat ground plane** when the page loads. The aesthetic should feel like an architectural model / urban planning visualization — clean, precise, sophisticated.

## Color Palette (grounded in the site theme)

The site is monochrome with hue 240 (blue-tinted neutrals). The 3D city should echo this:

| Element | Color | Hex | Why |
|---|---|---|---|
| Tallest towers (CBD) | Deep indigo | `#1e1b4b` | Matches `--primary` near-black with blue tint |
| Mid-rise buildings | Cool slate | `#334155` | Slight blue undertone, reads as concrete |
| Residential / short | Warm gray | `#64748b` | Lighter, creates depth layering |
| Glass facades (accent) | Indigo highlight | `#6366f1` | Pop of color on select tower faces |
| Ground plane | Off-white | `#f1f5f9` | Near `--background`, the city emerges from "paper" |
| Street grid lines | Light border | `#e2e8f0` | Matches `--border` |
| Window dots | Warm white | `#fef3c7` | Tiny lit-window effect on dark buildings |

This keeps everything within the site's cool-neutral aesthetic while the indigo accents tie to the existing primary color family.

## City Layout

A ~60-building city arranged in concentric zones on a rectangular ground plane:

```
  Ground plane (subtle grid lines = streets)
  ┌────────────────────────────────────────┐
  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
  │  ░░  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ░░░░  │
  │  ░░  ▒▒  ▓▓  ▓▓  ▓▓  ▓▓  ▒▒  ░░░░  │
  │  ░░  ▒▒  ▓▓  ██  ██  ▓▓  ▒▒  ░░░░  │  █ = 5-8 tall towers (CBD)
  │  ░░  ▒▒  ▓▓  ██  ██  ▓▓  ▒▒  ░░░░  │  ▓ = 15-20 mid-rise
  │  ░░  ▒▒  ▓▓  ▓▓  ▓▓  ▓▓  ▒▒  ░░░░  │  ▒ = 20-25 low residential
  │  ░░  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ░░░░░░░░  │  ░ = ground / parks
  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
  └────────────────────────────────────────┘
```

### Building variety (not just boxes)

Each building is assembled from stacked box geometries for architectural detail:

- **Towers** (CBD): Tall main shaft + narrower crown/antenna. Some have setbacks (wider base, narrower top). 2-3 signature towers that are noticeably taller.
- **Mid-rise**: Simple boxes but with slight width variation. Some L-shaped footprints (two boxes offset).
- **Residential**: Short, wider, uniform. Arranged in rows.
- **Details**: A few wedge/triangular shapes for variety (sloped roofs on residential).

## Animation

### Entrance: City Rising (2.5 seconds)

Buildings start at `scaleY = 0` (flat on the ground) and rise to full height with staggered timing:

1. **Center towers rise first** (delay 0s) — the skyline's spine appears
2. **Mid-rise ring follows** (delay 0.3-0.8s) — fills in around the core
3. **Residential periphery last** (delay 0.6-1.2s) — completes the city
4. **Easing**: `easeOutBack` (slight overshoot then settle) — gives a satisfying "pop" as each building reaches full height

### Idle: Subtle Life (continuous)

- **Slow rotation**: 0.05 rad/s around Y axis (one full turn every ~2 minutes)
- **Window flicker**: Tiny emissive dots on building surfaces that randomly toggle on/off every few seconds (simulates lights turning on in offices)
- **Breathing**: Very subtle (2% height oscillation) — buildings gently pulse with offset phases

### No orbit controls — just auto-rotation

Remove OrbitControls. The city slowly rotates on its own at a fixed camera angle. This is cleaner for a hero section (no user interaction needed, no accidental scroll-zoom conflicts).

## Camera and Positioning

- Camera: `position=[0, 3.5, 7]`, `fov=40` — slightly elevated isometric-like view
- City group: `position=[3, -1.5, 0]` — right side, sitting below the text baseline
- City tilted 15 degrees toward camera (`rotation.x = -0.15`) for better top-down readability
- Container opacity: `0.50` — visible but doesn't overpower the text

## Implementation

Single file: `src/components/3d/Hero3D.tsx` (complete rewrite)

### Building generator function

Procedural, but organized:
1. Define a grid (8x8 blocks with gaps for streets)
2. For each block, roll dice for building count (1-3), heights, widths
3. Height influenced by distance from center (CBD gradient)
4. Color assigned by height tier
5. Some blocks left empty (parks/plazas)

### Window lights

Implemented as small emissive planes on building faces, randomly placed during generation. Their emissive intensity oscillates per-frame with staggered sine waves to simulate occupancy.

## Verification

- Buildings visually form a recognizable city skyline silhouette
- Rise animation completes in ~2.5s with satisfying stagger
- Text remains readable over the 3D (opacity tuning)
- No scroll/interaction conflicts (OrbitControls removed)
- Reduced motion: static image fallback
- Performance: ~60-80 meshes total, well within budget
