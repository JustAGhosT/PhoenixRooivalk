# Drone Icons Directory

## Overview
This directory contains icon specifications for all deployable UAV and drone systems used in the Phoenix Rooivalk Threat Simulator.

## Icon Categories

### Core Drone Types
Essential drone systems for basic counter-drone operations.

#### 1. Effector (`effector.md`)
- **Type**: Kinetic interceptor drone
- **Color**: `#dc2626` (kinetic red)
- **Usage**: Direct engagement, kinetic energy systems

#### 2. Jammer (`jammer.md`)
- **Type**: Electronic warfare drone
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: RF disruption, electronic warfare

#### 3. Surveillance (`surveillance.md`)
- **Type**: Reconnaissance drone
- **Color**: `#3b82f6` (info blue)
- **Usage**: Intelligence gathering, observation

#### 4. Shield (`shield.md`)
- **Type**: Protective shield drone
- **Color**: `#10b981` (success green)
- **Usage**: Area defense, protection

#### 5. Swarm Coordinator (`swarm-coordinator.md`)
- **Type**: Swarm coordination drone
- **Color**: `#f59e0b` (warning amber)
- **Usage**: Multi-UAV management, coordination

### Extended Drone Types
Specialized drone systems for advanced operations.

#### 6. Decoy UAV (`decoy-uav.md`)
- **Type**: Decoy and lure drone
- **Color**: `#70A1FF` (deception blue)
- **Usage**: Target attraction, deception

#### 7. Net-Capture UAV (`net-capture-uav.md`)
- **Type**: Net deployment drone
- **Color**: `#10b981` (capture emerald)
- **Usage**: Physical capture, containment

#### 8. EW Relay UAV (`ew-relay-uav.md`)
- **Type**: Electronic warfare relay
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Extended EW range, signal amplification

#### 9. Tethered Overwatch (`tethered-overwatch.md`)
- **Type**: Persistent surveillance mast
- **Color**: `#3b82f6` (info blue)
- **Usage**: Elevated monitoring, stationary observation

#### 10. Recovery Drone (`recovery-drone.md`)
- **Type**: Drone recovery system
- **Color**: `#6b7280` (countermeasure gray)
- **Usage**: Debris cleanup, logistics

#### 11. Micro-Decoy Swarm (`micro-decoy-swarm.md`)
- **Type**: Swarm of micro-decoys
- **Color**: `#70A1FF` (deception blue)
- **Usage**: Saturation, multiple target deception

#### 12. Perimeter Sentry (`perimeter-sentry.md`)
- **Type**: Perimeter patrol drone
- **Color**: `#10b981` (success green)
- **Usage**: Boundary protection, patrol

#### 13. Spotter UAV (`spotter-uav.md`)
- **Type**: Target designation drone
- **Color**: `#3b82f6` (info blue)
- **Usage**: Precision guidance, marking

#### 14. HPM Pod UAV (`hpm-pod-uav.md`)
- **Type**: Mobile HPM platform
- **Color**: `#FFA502` (soft-kill orange)
- **Usage**: Portable electronic attack, mobile platforms

#### 15. Shield Wall (`shield-wall.md`)
- **Type**: Directional shield barrier
- **Color**: `#10b981` (success green)
- **Usage**: Directional protection, defensive barriers

#### 16. LiDAR Mapper (`lidar-mapper.md`)
- **Type**: 3D mapping drone
- **Color**: `#3b82f6` (info blue)
- **Usage**: Scene reconstruction, laser scanning

#### 17. Optical Mesh Drone (`optical-mesh-drone.md`)
- **Type**: Optical communication relay
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Secure communications, mesh networking

## Technical Specifications

### Base Triangle Structure
- **Shape**: Equilateral triangle as base container (except for special cases)
- **Size**: Triangle should occupy ~70% of the 24x24 viewBox
- **Positioning**: Centered in the viewBox
- **Stroke**: 2px stroke width for the triangle outline

### Special Cases
Some drones use non-triangle base shapes:
- **Tethered Overwatch**: Tower structure with eye on top
- **Shield Wall**: Wall section with shield overlay

### Internal Symbol Guidelines
- **Size**: Internal symbols should be ~40-50% of triangle size
- **Positioning**: Centered within the triangle
- **Style**: Consistent with military/technical aesthetic
- **Clarity**: Must be recognizable at 16px minimum size

### Color Usage
- **Triangle Outline**: Use specified color as stroke
- **Internal Symbol**: Use specified color as stroke
- **Active State**: Fill triangle with color at 20% opacity
- **Hover State**: Increase stroke width to 2.5px
- **Disabled State**: 40% opacity with muted color

### Consistency Rules
- **Most drone icons**: Must use triangle base
- **Stroke width**: 2px for all elements
- **Line caps**: Round for all strokes
- **Fill**: None unless in active state
- **Scaling**: Vector-based for crisp rendering

## File Structure
Each drone icon file contains:
1. **Description**: What the drone does
2. **Visual Elements**: Key visual components
3. **Technical Specifications**: Size, color, style details
4. **AI Generation Prompt**: Ready-to-use prompt for AI icon generation
5. **SVG Structure**: Basic SVG template
6. **Usage Context**: When and where to use the drone

## AI Generation Workflow
1. **Review**: Read the icon description and requirements
2. **Generate**: Use the provided AI prompt with your preferred tool
3. **Refine**: Adjust colors, stroke weights, and details for consistency
4. **Test**: Verify clarity at different sizes (16px, 24px, 32px, 48px)
5. **Validate**: Ensure accessibility compliance and cross-browser support

## Integration Notes
- Icons are used in `DroneDeployment.tsx` component
- Each drone has corresponding data in `effectorDatabase.json`
- Colors should match the specified hex values for consistency
- Icons support both active and inactive states
- Special attention needed for non-triangle base shapes

## Drone Role Classification

### By Function
- **Guard/Protection**: Effector, Shield, Perimeter Sentry, Shield Wall
- **Reconnaissance**: Surveillance, Spotter UAV, LiDAR Mapper, Tethered Overwatch
- **Electronic Warfare**: Jammer, EW Relay UAV, HPM Pod UAV, Optical Mesh Drone
- **Deception**: Decoy UAV, Micro-Decoy Swarm
- **Capture**: Net-Capture UAV
- **Support**: Swarm Coordinator, Recovery Drone

### By Energy Cost
- **Low Cost (6-8)**: Recovery Drone, EW Relay UAV, Optical Mesh Drone
- **Medium Cost (9-12)**: Surveillance, Spotter UAV, LiDAR Mapper, Perimeter Sentry, Tethered Overwatch
- **High Cost (14-20)**: Net-Capture UAV, Micro-Decoy Swarm, HPM Pod UAV

## Maintenance
- Update icon specifications in the `.md` files
- Regenerate icons when design requirements change
- Test new icons across all use cases
- Update component implementations as needed
- Maintain consistency with the triangle-based design system
