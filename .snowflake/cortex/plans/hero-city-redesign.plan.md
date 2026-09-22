# Hero City Redesign

## Goals
1. **Lower opacity** — from 0.55 to ~0.35-0.40 for better text readability
2. **Much slower rise animation** — buildings emerge over 8-10 seconds total (currently ~2s)
3. **Green/nature color palette** — earth tones, forest greens, warm stone
4. **Trees and nature** — procedural trees along streets and in parks
5. **Less blocky buildings** — tapered shapes, varied rooftops, cylinder towers

## Color Palette
| Element | Current | New |
|---------|---------|-----|
| CBD towers | `#1e1b4b` deep indigo | `#1a3a2a` dark forest green |
| Mid-rise | `#334155` cool slate | `#4a6741` sage/olive |
| Residential | `#64748b` warm gray | `#8b7d6b` warm stone |
| Glass accent | `#6366f1` indigo | `#2dd4bf` teal |
| Ground | `#f1f5f9` off-white | `#e8f0e4` soft green |
| Streets | `#e2e8f0` light gray | `#d4d8c8` warm gray-green |
| Window glow | `#fef3c7` amber | `#fef3c7` (keep) |

## Building Geometry Improvements
- **CBD towers**: Mix of box + cylinder shapes, slight top taper (0.85x width at crown)
- **Mid-rise**: Boxes with sloped roof caps (wedge geometry on top)
- **Residential**: Slightly randomized proportions, some with peaked roofs
- **All**: Small random rotation (±3°) to break grid rigidity

## Trees
- **Geometry**: Cone canopy (green) on thin cylinder trunk (brown)
- **Placement**: Along streets, in empty park blocks, clustered in residential areas
- **Variation**: 3-4 size classes, canopy color varies (dark green to lime)
- **Rise**: Trees rise with the same stagger animation but slightly delayed after buildings

## Animation Timing
- Rise duration: 0.8s → **4.0s** per building
- Stagger factor: 0.15 → **0.6** (distance-based delay)
- Total emergence: ~8-10 seconds from center to edges
- Trees delayed by +1.5s after their local buildings
