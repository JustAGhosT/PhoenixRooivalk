# Icon Requirements & Design System

## Overview

This document defines the complete icon requirements for the Phoenix Rooivalk
Threat Simulator, including design specifications, color palettes, and AI
generation prompts for all effector and drone icons.

## Design Principles

### Visual Style

- **Theme**: Military/defense technology, professional and credible
- **Style**: Minimalist, technical, outline-based with optional fills
- **Weight**: Medium weight (2-3px stroke width)
- **Consistency**: Unified stroke width and corner radius
- **Clarity**: Recognizable at 16px minimum size

### Technical Standards

- **Format**: SVG with viewBox="0 0 24 24"
- **Stroke Width**: 2px for consistency
- **Line Caps**: Round for all strokes
- **Line Joins**: Round for all paths
- **Scaling**: Vector-based for crisp rendering at any size
- **Accessibility**: WCAG AA contrast compliance

## Color System

### Effector Class Colors

```css
/* Hard Kill Systems */
--kinetic: #dc2626; /* Kinetic red - Physical destruction */
--hard-kill: #2ed573; /* Hard kill green - Direct energy */

/* Soft Kill Systems */
--soft-kill: #ffa502; /* Soft kill orange - Electronic disruption */
--ecm: #8b5cf6; /* ECM purple - Electronic warfare */

/* Deception Systems */
--deception: #70a1ff; /* Deception blue - Misdirection */
--capture: #10b981; /* Capture emerald - Non-destructive */

/* Countermeasure Systems */
--denial: #eccc68; /* Denial yellow - Area denial */
--countermeasure: #6b7280; /* Countermeasure gray - Defensive */
--nonkinetic: #84cc16; /* Nonkinetic lime - Non-destructive */
--directed: #f97316; /* Directed orange - Directed energy */
```

### Drone Role Colors

```css
/* Core Drone Types */
--kinetic: #dc2626; /* Kinetic red - Direct engagement */
--ecm: #8b5cf6; /* ECM purple - Electronic warfare */
--recon: #3b82f6; /* Recon blue - Intelligence gathering */
--protection: #10b981; /* Protection green - Area defense */
--coordination: #f59e0b; /* Coordination amber - Swarm management */

/* Extended Drone Types */
--deception: #70a1ff; /* Deception blue - Target attraction */
--capture: #10b981; /* Capture emerald - Physical capture */
--support: #8b5cf6; /* Support purple - Extended capabilities */
--sensor: #3b82f6; /* Sensor blue - Persistent monitoring */
--logistics: #6b7280; /* Logistics gray - Recovery operations */
--directed: #ffa502; /* Directed orange - Mobile platforms */
```

## Effector Icons (17 Total)

### Hard Kill Systems

#### 1. Kinetic

- **File**: `effectors/kinetic.md`
- **Description**: Physical projectile weapon for direct kinetic engagement
- **Visual**: Bullet trajectory with target crosshair
- **Color**: `#dc2626` (kinetic red)
- **AI Prompt**: "Create a minimalist kinetic weapon icon: bullet trajectory
  with crosshair target. Military style, outline-based, 24x24px. Color #dc2626.
  Technical, direct, projectile weapon aesthetic."

#### 2. Smart Slug

- **File**: `effectors/smart-slug.md`
- **Description**: Precision kinetic projectile for high-accuracy intercepts
- **Visual**: Crosshair with bullet path
- **Color**: `#dc2626` (kinetic red)
- **AI Prompt**: "Create a precision projectile icon: crosshair with bullet
  trajectory line. Military style, outline-based, 24x24px. Color #dc2626.
  High-precision, targeted weapon aesthetic."

#### 3. Net Interceptor

- **File**: `effectors/net-interceptor.md`
- **Description**: Physical net capture system for non-destructive
  neutralization
- **Visual**: Interlaced net pattern or fishing net mesh
- **Color**: `#10b981` (capture emerald)
- **AI Prompt**: "Create a capture net icon: interlaced net pattern or fishing
  net mesh. Military style, outline-based, 24x24px. Color #10b981. Physical
  capture, containment, non-destructive aesthetic."

### Soft Kill Systems

#### 4. EMP (Electronic)

- **File**: `effectors/emp.md`
- **Description**: Electromagnetic pulse weapon for electronic disruption
- **Visual**: Electrical discharge with pulse waves
- **Color**: `#FFA502` (soft-kill orange)
- **AI Prompt**: "Create an EMP weapon icon: electrical discharge with
  concentric pulse waves. Military style, outline-based, 24x24px. Color #FFA502.
  Electronic disruption, electromagnetic pulse aesthetic."

#### 5. HPM (High Power Microwave)

- **File**: `effectors/hpm.md`
- **Description**: High power microwave burst weapon for electronic disruption
- **Visual**: Concentric wave rings with burst center
- **Color**: `#FFA502` (soft-kill orange)
- **AI Prompt**: "Create a microwave burst weapon icon: concentric wave rings
  emanating from center point. Military style, outline-based, 24x24px. Color
  #FFA502. Electronic disruption, wave propagation effect."

#### 6. RF Jam

- **File**: `effectors/rf-jam.md`
- **Description**: Radio frequency jamming for communication disruption
- **Visual**: Antenna with strike-through or X
- **Color**: `#FFA502` (soft-kill orange)
- **AI Prompt**: "Create an RF jamming icon: antenna with strike-through or X
  mark. Military style, outline-based, 24x24px. Color #FFA502. Communication
  disruption, signal blocking aesthetic."

#### 7. RF Takeover

- **File**: `effectors/rf-takeover.md`
- **Description**: Command and control takeover for electronic warfare
- **Visual**: Two antennas with arrow between
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an RF takeover icon: two antennas with arrow between
  them. Military style, outline-based, 24x24px. Color #8b5cf6. Electronic
  warfare, command and control takeover aesthetic."

#### 8. GNSS Denial

- **File**: `effectors/gnss-deny.md`
- **Description**: GPS/satellite signal denial for navigation disruption
- **Visual**: Satellite with slash or X
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create a GPS denial icon: satellite with slash or X mark.
  Military style, outline-based, 24x24px. Color #8b5cf6. Navigation disruption,
  satellite signal blocking aesthetic."

### Directed Energy Systems

#### 9. Laser/HEL

- **File**: `effectors/laser.md`
- **Description**: High-energy laser weapon for precise directed energy
  engagement
- **Visual**: Concentrated beam with crosshair
- **Color**: `#2ED573` (hard-kill green)
- **AI Prompt**: "Create a laser weapon icon: diagonal energy beam with target
  crosshair. Military style, outline-based, 24x24px. Color #2ED573. Technical,
  precise, direct energy weapon aesthetic."

#### 10. Optical Dazzler

- **File**: `effectors/optical-dazzler.md`
- **Description**: Bright light dazzler for visual disruption and camera
  blinding
- **Visual**: Sun with rays or spotlight
- **Color**: `#f97316` (directed orange)
- **AI Prompt**: "Create an optical dazzler icon: sun with rays or spotlight
  beam. Military style, outline-based, 24x24px. Color #f97316. Visual
  disruption, camera blinding aesthetic."

### Deception Systems

#### 11. Decoy Beacon

- **File**: `effectors/decoy-beacon.md`
- **Description**: Lure beacon system for target attraction and decoy operations
- **Visual**: Lighthouse beacon or radar sweep
- **Color**: `#70A1FF` (deception blue)
- **AI Prompt**: "Create a decoy beacon icon: lighthouse beacon or radar sweep
  pattern. Military style, outline-based, 24x24px. Color #70A1FF. Target
  attraction, decoy systems aesthetic."

#### 12. AI Deception

- **File**: `effectors/ai-deception.md`
- **Description**: AI-powered deception for advanced electronic warfare
- **Visual**: Shimmering effect or neural network pattern
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an AI deception icon: shimmering effect or neural
  network pattern. Military style, outline-based, 24x24px. Color #8b5cf6.
  Advanced electronic warfare, AI-powered aesthetic."

### Countermeasure Systems

#### 13. Chaff/Obscurant

- **File**: `effectors/chaff.md`
- **Description**: Smoke/obscurant generator for visual concealment
- **Visual**: Cloud or fog bank pattern
- **Color**: `#6b7280` (countermeasure gray)
- **AI Prompt**: "Create an obscurant icon: cloud or fog bank pattern. Military
  style, outline-based, 24x24px. Color #6b7280. Visual concealment, smoke
  generation aesthetic."

#### 14. Acoustic Disruptor

- **File**: `effectors/acoustic.md`
- **Description**: Acoustic disruption system for audio interference
- **Visual**: Speaker with sound waves or mute symbol
- **Color**: `#84cc16` (nonkinetic lime)
- **AI Prompt**: "Create an acoustic disruptor icon: speaker with sound waves or
  mute symbol. Military style, outline-based, 24x24px. Color #84cc16. Audio
  disruption, sound interference aesthetic."

#### 15. Ahead Airburst

- **File**: `effectors/ahead-airburst.md`
- **Description**: Proximity-fused explosive for area denial and swarm
  disruption
- **Visual**: Explosion burst with fragmentation pattern
- **Color**: `#dc2626` (kinetic red)
- **AI Prompt**: "Create an ahead airburst icon: explosion burst with
  fragmentation pattern. Military style, outline-based, 24x24px. Color #dc2626.
  Proximity-fused, area denial, explosive aesthetic."

#### 16. Obscurant

- **File**: `effectors/obscurant.md`
- **Description**: Visual concealment and smoke generation system
- **Visual**: Cloud or fog bank pattern
- **Color**: `#6b7280` (countermeasure gray)
- **AI Prompt**: "Create an obscurant icon: cloud or fog bank pattern. Military
  style, outline-based, 24x24px. Color #6b7280. Visual concealment, smoke
  generation aesthetic."

#### 17. HEL (High Energy Laser)

- **File**: `effectors/hel.md`
- **Description**: High energy laser system for directed energy engagement
- **Visual**: Laser beam with energy focus
- **Color**: `#f97316` (directed orange)
- **AI Prompt**: "Create a high energy laser icon: focused laser beam with
  energy concentration. Military style, outline-based, 24x24px. Color #f97316.
  Directed energy, precision targeting aesthetic."

## Drone Icons (17 Total)

### Core Drone Types

#### 1. Effector (Interceptor)

- **File**: `drones/effector.md`
- **Description**: Kinetic interceptor drone for direct engagement
- **Visual**: Triangle with lightning bolt
- **Color**: `#dc2626` (kinetic red)
- **AI Prompt**: "Create a kinetic interceptor drone icon: triangle with
  lightning bolt inside. Military style, outline-based, 24x24px. Color #dc2626.
  Fast attack, kinetic energy, direct engagement aesthetic."

#### 2. Jammer

- **File**: `drones/jammer.md`
- **Description**: Electronic warfare drone for RF disruption
- **Visual**: Triangle with radio wave pattern
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an electronic warfare drone icon: triangle with radio
  wave pattern. Military style, outline-based, 24x24px. Color #8b5cf6. RF
  disruption, electronic warfare, signal interference aesthetic."

#### 3. Surveillance

- **File**: `drones/surveillance.md`
- **Description**: Reconnaissance drone for intelligence gathering
- **Visual**: Triangle with eye symbol
- **Color**: `#3b82f6` (info blue)
- **AI Prompt**: "Create a surveillance drone icon: triangle with eye symbol
  inside. Military style, outline-based, 24x24px. Color #3b82f6. Intelligence
  gathering, observation, monitoring aesthetic."

#### 4. Shield

- **File**: `drones/shield.md`
- **Description**: Protective shield drone for area defense
- **Visual**: Triangle with shield symbol
- **Color**: `#10b981` (success green)
- **AI Prompt**: "Create a shield drone icon: triangle with shield symbol
  inside. Military style, outline-based, 24x24px. Color #10b981. Defense,
  protection, area coverage aesthetic."

#### 5. Swarm Coordinator

- **File**: `drones/swarm-coordinator.md`
- **Description**: Swarm coordination drone for managing multiple UAVs
- **Visual**: Triangle with network nodes
- **Color**: `#f59e0b` (warning amber)
- **AI Prompt**: "Create a swarm coordinator drone icon: triangle with network
  nodes pattern. Military style, outline-based, 24x24px. Color #f59e0b. Swarm
  management, coordination, network control aesthetic."

### Extended Drone Types

#### 6. Decoy UAV

- **File**: `drones/decoy-uav.md`
- **Description**: Decoy and lure drone for target attraction
- **Visual**: Triangle with beacon/flare
- **Color**: `#70A1FF` (deception blue)
- **AI Prompt**: "Create a decoy drone icon: triangle with beacon or flare
  symbol. Military style, outline-based, 24x24px. Color #70A1FF. Target
  attraction, deception, lure systems aesthetic."

#### 7. Net-Capture UAV

- **File**: `drones/net-capture-uav.md`
- **Description**: Net deployment drone for physical capture
- **Visual**: Triangle with net pattern
- **Color**: `#10b981` (capture emerald)
- **AI Prompt**: "Create a net-capture drone icon: triangle with net pattern
  inside. Military style, outline-based, 24x24px. Color #10b981. Physical
  capture, containment, net deployment aesthetic."

#### 8. EW Relay UAV

- **File**: `drones/ew-relay-uav.md`
- **Description**: Electronic warfare relay for extended EW range
- **Visual**: Triangle with antenna array
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an EW relay drone icon: triangle with antenna array
  pattern. Military style, outline-based, 24x24px. Color #8b5cf6. Electronic
  warfare relay, extended range, signal amplification aesthetic."

#### 9. Tethered Overwatch

- **File**: `drones/tethered-overwatch.md`
- **Description**: Persistent surveillance mast for elevated monitoring
- **Visual**: Tower with eye on top
- **Color**: `#3b82f6` (info blue)
- **AI Prompt**: "Create a tethered overwatch icon: tower structure with eye
  symbol on top. Military style, outline-based, 24x24px. Color #3b82f6.
  Persistent surveillance, elevated monitoring, stationary observation
  aesthetic."

#### 10. Recovery Drone

- **File**: `drones/recovery-drone.md`
- **Description**: Drone recovery system for debris cleanup
- **Visual**: Triangle with grappling hook
- **Color**: `#6b7280` (countermeasure gray)
- **AI Prompt**: "Create a recovery drone icon: triangle with grappling hook or
  retrieval mechanism. Military style, outline-based, 24x24px. Color #6b7280.
  Debris cleanup, recovery operations, logistics aesthetic."

#### 11. Micro-Decoy Swarm

- **File**: `drones/micro-decoy-swarm.md`
- **Description**: Swarm of micro-decoys for saturation
- **Visual**: Triangle with multiple dots
- **Color**: `#70A1FF` (deception blue)
- **AI Prompt**: "Create a micro-decoy swarm icon: triangle with multiple small
  dots inside. Military style, outline-based, 24x24px. Color #70A1FF. Swarm
  deception, saturation, multiple targets aesthetic."

#### 12. Perimeter Sentry

- **File**: `drones/perimeter-sentry.md`
- **Description**: Perimeter patrol drone for boundary protection
- **Visual**: Triangle with border shield
- **Color**: `#10b981` (success green)
- **AI Prompt**: "Create a perimeter sentry drone icon: triangle with border
  shield pattern. Military style, outline-based, 24x24px. Color #10b981.
  Perimeter defense, patrol, boundary protection aesthetic."

#### 13. Spotter UAV

- **File**: `drones/spotter-uav.md`
- **Description**: Target designation drone for precision guidance
- **Visual**: Triangle with crosshair
- **Color**: `#3b82f6` (info blue)
- **AI Prompt**: "Create a spotter drone icon: triangle with crosshair symbol
  inside. Military style, outline-based, 24x24px. Color #3b82f6. Target
  designation, precision guidance, marking aesthetic."

#### 14. HPM Pod UAV

- **File**: `drones/hpm-pod-uav.md`
- **Description**: Mobile HPM platform for portable electronic attack
- **Visual**: Triangle with wave burst
- **Color**: `#FFA502` (soft-kill orange)
- **AI Prompt**: "Create an HPM pod drone icon: triangle with wave burst pattern
  inside. Military style, outline-based, 24x24px. Color #FFA502. Mobile
  electronic attack, high power microwave, portable platform aesthetic."

#### 15. Shield Wall

- **File**: `drones/shield-wall.md`
- **Description**: Directional shield barrier for area protection
- **Visual**: Wall section with shield overlay
- **Color**: `#10b981` (success green)
- **AI Prompt**: "Create a shield wall icon: wall section with shield overlay
  pattern. Military style, outline-based, 24x24px. Color #10b981. Directional
  protection, barrier, defensive wall aesthetic."

#### 16. LiDAR Mapper

- **File**: `drones/lidar-mapper.md`
- **Description**: 3D mapping drone for scene reconstruction
- **Visual**: Triangle with scanning laser lines
- **Color**: `#3b82f6` (info blue)
- **AI Prompt**: "Create a LiDAR mapper drone icon: triangle with scanning laser
  lines pattern. Military style, outline-based, 24x24px. Color #3b82f6. 3D
  mapping, laser scanning, scene reconstruction aesthetic."

#### 17. Optical Mesh Drone

- **File**: `drones/optical-mesh-drone.md`
- **Description**: Optical communication relay for secure communications
- **Visual**: Triangle with light beam
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an optical mesh drone icon: triangle with light beam or
  optical link pattern. Military style, outline-based, 24x24px. Color #8b5cf6.
  Secure communications, optical link, mesh networking aesthetic."

## Power-up Icons (4 Total)

### Combat Enhancement Power-ups

Temporary enhancements that boost weapon system effectiveness.

#### 1. Damage Boost

- **File**: `powerups/damage-boost.md`
- **Description**: Damage enhancement power-up for increased weapon
  effectiveness
- **Visual**: Upward arrow with explosion or burst
- **Color**: `#ef4444` (danger red)
- **AI Prompt**: "Create a damage boost power-up icon: upward arrow with
  explosion or burst effect. Military style, outline-based, 24x24px. Color
  #ef4444. Damage enhancement, weapon boost aesthetic."

#### 2. Rapid Fire

- **File**: `powerups/rapid-fire.md`
- **Description**: Rapid fire enhancement power-up for increased firing rate
- **Visual**: Multiple projectiles or bullets in sequence
- **Color**: `#f59e0b` (warning amber)
- **AI Prompt**: "Create a rapid fire power-up icon: multiple projectiles or
  bullets in sequence. Military style, outline-based, 24x24px. Color #f59e0b.
  Speed enhancement, rapid fire aesthetic."

#### 3. Area Effect

- **File**: `powerups/area-effect.md`
- **Description**: Area effect enhancement power-up for expanded weapon coverage
- **Visual**: Expanding circle or burst pattern
- **Color**: `#8b5cf6` (ECM purple)
- **AI Prompt**: "Create an area effect power-up icon: expanding circle or burst
  pattern. Military style, outline-based, 24x24px. Color #8b5cf6. Area coverage,
  expansion aesthetic."

#### 4. Range Boost

- **File**: `powerups/range-boost.md`
- **Description**: Range enhancement power-up for increased weapon reach
- **Visual**: Long-range arrow or targeting reticle
- **Color**: `#06b6d4` (info cyan)
- **AI Prompt**: "Create a range boost power-up icon: long-range arrow or
  targeting reticle. Military style, outline-based, 24x24px. Color #06b6d4.
  Distance enhancement, range extension aesthetic."

## Status Icons (5 Total)

### System Status Indicators

Visual feedback for system states and readiness.

#### 1. Cooldown Ready

- **File**: `status/cooldown-ready.md`
- **Description**: Status indicator showing weapon/system is ready to fire
- **Visual**: Checkmark or ready indicator
- **Color**: `#10b981` (success green)
- **AI Prompt**: "Create a cooldown ready status icon: checkmark or ready
  indicator. Military style, outline-based, 24x24px. Color #10b981. Ready state,
  system available aesthetic."

#### 2. Cooldown Active

- **File**: `status/cooldown-active.md`
- **Description**: Status indicator showing weapon/system is in cooldown period
- **Visual**: Circular progress indicator or timer
- **Color**: `#f59e0b` (warning amber)
- **AI Prompt**: "Create a cooldown active status icon: circular progress
  indicator or timer. Military style, outline-based, 24x24px. Color #f59e0b.
  Active cooldown, waiting state aesthetic."

#### 3. Energy Low

- **File**: `status/energy-low.md`
- **Description**: Status indicator showing low energy levels
- **Visual**: Battery with low charge indicator
- **Color**: `#ef4444` (danger red)
- **AI Prompt**: "Create an energy low status icon: battery with low charge
  indicator. Military style, outline-based, 24x24px. Color #ef4444. Low energy,
  warning state aesthetic."

#### 4. ROE High Risk

- **File**: `status/roe-high.md`
- **Description**: Status indicator showing high Rules of Engagement risk level
- **Visual**: Warning triangle with exclamation mark
- **Color**: `#ef4444` (danger red)
- **AI Prompt**: "Create a ROE high risk status icon: warning triangle with
  exclamation mark. Military style, outline-based, 24x24px. Color #ef4444. High
  risk, warning state aesthetic."

#### 5. Legal Warning

- **File**: `status/legal-warning.md`
- **Description**: Status indicator showing legal compliance requirements or
  warnings
- **Visual**: Shield with legal symbol or scales
- **Color**: `#f59e0b` (warning amber)
- **AI Prompt**: "Create a legal warning status icon: shield with legal symbol
  or scales. Military style, outline-based, 24x24px. Color #f59e0b. Legal
  compliance, warning state aesthetic."

## Implementation Guidelines

### SVG Specifications

- **Format**: SVG with viewBox="0 0 24 24"
- **Stroke Width**: 2px for consistency
- **Fill**: None for outline icons, solid for active states
- **Strokes**: Round line caps and joins
- **Scaling**: Vector-based for crisp rendering at any size

### React Component Structure

```tsx
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  active?: boolean;
}

const EffectorIcon: React.FC<IconProps> = ({
  size = 24,
  color = "#6b7280",
  className = "",
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={active ? color : "none"}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Icon path data */}
    </svg>
  );
};
```

### CSS Integration

```css
.effector-icon {
  transition: all 0.2s ease;
  cursor: pointer;
}

.effector-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.effector-icon--active {
  fill: var(--effector-color);
}

.effector-icon--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

## File Organization

### Directory Structure

```text
src/components/icons/
├── effectors/          # Counter-drone weapon systems (17 icons)
├── drones/             # Deployable UAV types (17 icons)
├── powerups/           # Enhancement and power-up systems (4 icons)
├── status/             # Status and UI indicators (5 icons)
├── README.md           # Main documentation
└── Icon_Requirements.md # This file
```

### File Naming Convention

- **Effectors**: Use kebab-case (e.g., `rf-takeover.md`)
- **Drones**: Use kebab-case (e.g., `decoy-uav.md`)
- **Power-ups**: Use kebab-case (e.g., `damage-boost.md`)
- **Status**: Use kebab-case (e.g., `cooldown-ready.md`)

### Export Pattern

```tsx
// index.ts
export { Kinetic } from "./effectors/Kinetic";
export { HPM } from "./effectors/HPM";
export { Effector } from "./drones/Effector";
// ... all other icons
```

## Accessibility

### ARIA Labels

```tsx
<EffectorIcon aria-label="High Energy Laser - Hard Kill System" role="img" />
```

### Screen Reader Support

- Provide descriptive `aria-label` attributes for meaningful icons (with
  `role="img"` if needed)
- Mark purely decorative elements `aria-hidden="true"` with no role or label so
  screen readers ignore them

## Testing Requirements

### Visual Testing

- Icon clarity at 16px, 24px, 32px sizes
- Color contrast compliance (WCAG AA)
- Recognition accuracy in user testing
- Consistency across different screen densities

### Technical Testing

- SVG optimization and file size
- Rendering performance
- Cross-browser compatibility
- Touch target size (44px minimum)

## Future Considerations

### Scalability

- Icon system supports easy addition of new effector/drone types
- Consistent naming conventions for automated generation
- Version control for icon updates and modifications

### Theming

- Dark/light mode support
- High contrast mode compatibility
- Custom color palette support for different deployments

---

_This document serves as the definitive guide for icon design and implementation
in the Phoenix Rooivalk Threat Simulator. All icons should follow these
specifications for consistency and professional appearance._
