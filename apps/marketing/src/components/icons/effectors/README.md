# Effector Icons Directory

## Overview

This directory contains icon specifications for all counter-drone weapon systems (effectors) used in the Phoenix Rooivalk Threat Simulator.

## Icon Categories

### Hard Kill Systems

Physical destruction and kinetic engagement systems.

#### 1. Kinetic (`kinetic.md`)

- **Type**: Physical projectile weapon
- **Color**: `#dc2626` (kinetic red)
- **Usage**: Direct kinetic engagement, physical projectiles

#### 2. Smart Slug (`smart-slug.md`)

- **Type**: Precision kinetic projectile
- **Color**: `#dc2626` (kinetic red)
- **Usage**: High-accuracy intercepts, precision targeting

#### 3. Net Interceptor (`net-interceptor.md`)

- **Type**: Physical capture system
- **Color**: `#10b981` (capture emerald)
- **Usage**: Non-destructive neutralization, containment

### Soft Kill Systems

Electronic disruption and non-kinetic engagement systems.

#### 4. EMP (`emp.md`)

- **Type**: Electromagnetic pulse weapon
- **Color**: `#FFA502` (soft-kill orange)
- **Usage**: Electronic disruption, EMP attacks

#### 5. HPM (`hpm.md`)

- **Type**: High power microwave burst
- **Color**: `#FFA502` (soft-kill orange)
- **Usage**: Microwave disruption, electronic warfare

#### 6. RF Jam (`rf-jam.md`)

- **Type**: Radio frequency jamming
- **Color**: `#FFA502` (soft-kill orange)
- **Usage**: Communication disruption, signal blocking

#### 7. RF Takeover (`rf-takeover.md`)

- **Type**: Command and control takeover
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Electronic warfare, C2 hijacking

#### 8. GNSS Denial (`gnss-deny.md`)

- **Type**: GPS/satellite signal denial
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Navigation disruption, GPS blocking

### Directed Energy Systems

Laser and optical weapon systems.

#### 9. Laser/HEL (`laser.md`)

- **Type**: High-energy laser weapon
- **Color**: `#2ED573` (hard-kill green)
- **Usage**: Precision targeting, directed energy

#### 10. Optical Dazzler (`optical-dazzler.md`)

- **Type**: Bright light dazzler
- **Color**: `#f97316` (directed orange)
- **Usage**: Visual disruption, camera blinding

### Deception Systems

Misdirection and target attraction systems.

#### 11. Decoy Beacon (`decoy-beacon.md`)

- **Type**: Lure beacon system
- **Color**: `#70A1FF` (deception blue)
- **Usage**: Target attraction, decoy operations

#### 12. AI Deception (`ai-deception.md`)

- **Type**: AI-powered deception
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Advanced electronic warfare, AI countermeasures

### Countermeasure Systems

Defensive and area denial systems.

#### 13. Chaff/Obscurant (`chaff.md`)

- **Type**: Smoke/obscurant generator
- **Color**: `#6b7280` (countermeasure gray)
- **Usage**: Visual concealment, tracking disruption

#### 14. Acoustic Disruptor (`acoustic.md`)

- **Type**: Acoustic disruption system
- **Color**: `#84cc16` (nonkinetic lime)
- **Usage**: Audio interference, sound-based countermeasures

## Technical Specifications

### Common Standards

- **Format**: SVG with viewBox="0 0 24 24"
- **Stroke Width**: 2px for consistency
- **Style**: Military, outline-based
- **Line Caps**: Round for all strokes
- **Scaling**: Vector-based for crisp rendering

### Color Usage

- **Active State**: Use specified color as fill (20% opacity)
- **Inactive State**: Use specified color as stroke only
- **Hover State**: Increase stroke width to 2.5px
- **Disabled State**: 40% opacity with muted color

### Design Principles

- **Clarity**: Recognizable at 16px minimum size
- **Consistency**: Unified stroke width and corner radius
- **Uniqueness**: Each icon should be distinct and memorable
- **Theme**: Military/defense technology aesthetic

## File Structure

Each effector icon file contains:

1. **Description**: What the effector does
2. **Visual Elements**: Key visual components
3. **Technical Specifications**: Size, color, style details
4. **AI Generation Prompt**: Ready-to-use prompt for AI icon generation
5. **SVG Structure**: Basic SVG template
6. **Usage Context**: When and where to use the effector

## AI Generation Workflow

1. **Review**: Read the icon description and requirements
2. **Generate**: Use the provided AI prompt with your preferred tool
3. **Refine**: Adjust colors, stroke weights, and details for consistency
4. **Test**: Verify clarity at different sizes (16px, 24px, 32px, 48px)
5. **Validate**: Ensure accessibility compliance and cross-browser support

## Integration Notes

- Icons are used in `WeaponStatus.tsx` component
- Each effector has corresponding data in `effectorDatabase.json`
- Colors should match the specified hex values for consistency
- Icons support both active and inactive states

## Maintenance

- Update icon specifications in the `.md` files
- Regenerate icons when design requirements change
- Test new icons across all use cases
- Update component implementations as needed
