# Icon System Documentation

## Overview
This directory contains the complete icon system for the Phoenix Rooivalk Threat Simulator, organized by category with detailed descriptions and AI generation prompts for each icon.

## Directory Structure
```
icons/
├── effectors/          # Counter-drone weapon systems (18 icons)
├── drones/             # Deployable UAV types (17 icons)
├── powerups/           # Enhancement and power-up systems (4 icons)
├── status/             # Status and UI indicators (5 icons)
├── README.md           # Main documentation
└── Icon_Requirements.md # Complete specifications
```

## Icon Categories

### Effectors (Weapon Systems)
Located in `effectors/` directory - Contains all counter-drone weapon systems including:
- **Hard Kill**: Kinetic, Smart Slug, Net Interceptor
- **Soft Kill**: EMP, HPM, RF Jam, RF Takeover, GNSS Denial
- **Directed Energy**: Laser (HEL), Optical Dazzler
- **Deception**: Decoy Beacon, AI Deception
- **Countermeasures**: Chaff/Obscurant, Acoustic Disruptor

### Drones (Deployable Systems)
Located in `drones/` directory - Contains all UAV and deployable systems including:
- **Core Types**: Effector, Jammer, Surveillance, Shield, Swarm Coordinator
- **Extended Types**: Decoy UAV, Net-Capture UAV, EW Relay UAV, Tethered Overwatch, Recovery Drone, Micro-Decoy Swarm, Perimeter Sentry, Spotter UAV, HPM Pod UAV, Shield Wall, LiDAR Mapper, Optical Mesh Drone

### Power-ups (Enhancement Systems)
Located in `powerups/` directory - Contains all temporary enhancement systems including:
- **Damage Boost**: Increased weapon effectiveness
- **Rapid Fire**: Enhanced firing rate
- **Area Effect**: Expanded weapon coverage
- **Range Boost**: Increased weapon reach

### Status Icons (UI Indicators)
Located in `status/` directory - Contains all status and feedback indicators including:
- **System Status**: Cooldown Ready, Cooldown Active
- **Resource Status**: Energy Low
- **Risk Assessment**: ROE High Risk, Legal Warning

## Icon Specifications

### Technical Standards
- **Format**: SVG with viewBox="0 0 24 24"
- **Stroke Width**: 2px for consistency
- **Style**: Military, outline-based
- **Scaling**: Vector-based for crisp rendering at any size

### Color Palette
- **Hard Kill**: `#dc2626` (kinetic red)
- **Soft Kill**: `#FFA502` (soft-kill orange)
- **Deception**: `#70A1FF` (deception blue)
- **Denial**: `#ECCC68` (denial yellow)
- **Capture**: `#10b981` (capture emerald)
- **ECM**: `#8b5cf6` (ECM purple)
- **Directed Energy**: `#2ED573` (hard-kill green)
- **Nonkinetic**: `#84cc16` (nonkinetic lime)
- **Countermeasure**: `#6b7280` (countermeasure gray)

## Usage Guidelines

### File Naming Convention
- **Effectors**: Use kebab-case (e.g., `rf-takeover.md`)
- **Drones**: Use kebab-case (e.g., `decoy-uav.md`)
- **Status**: Use kebab-case (e.g., `cooldown-ready.md`)

### AI Generation
Each icon file contains:
1. **Description**: What the icon represents
2. **Visual Elements**: Key visual components
3. **Technical Specifications**: Size, color, style details
4. **AI Generation Prompt**: Ready-to-use prompt for AI icon generation
5. **SVG Structure**: Basic SVG template
6. **Usage Context**: When and where to use the icon

### Implementation
- Use the AI prompts with your preferred AI image generation tool
- Generate SVG icons following the technical specifications
- Test icons at multiple sizes (16px, 24px, 32px, 48px)
- Ensure accessibility compliance (WCAG AA contrast ratios)

## Development Workflow

1. **Design**: Review the icon descriptions and visual requirements
2. **Generate**: Use AI prompts to create initial icon concepts
3. **Refine**: Adjust colors, stroke weights, and details for consistency
4. **Test**: Verify clarity at different sizes and contexts
5. **Implement**: Convert to React components or SVG assets
6. **Validate**: Test accessibility and cross-browser compatibility

## Maintenance

### Adding New Icons
1. Create a new `.md` file in the appropriate directory
2. Follow the established template format
3. Update this README with the new icon
4. Update any relevant documentation

### Updating Existing Icons
1. Modify the `.md` file with new specifications
2. Regenerate the icon using the updated prompt
3. Test the new icon across all use cases
4. Update any affected components

## Resources

### Design System
- See `apps/docs/docs/design/Icon_Requirements.md` for complete design system documentation
- Color palette and styling guidelines are defined there

### Component Integration
- Icons are integrated into React components in the main components directory
- See `WeaponStatus.tsx` and `DroneDeployment.tsx` for implementation examples

### Accessibility
- All icons must meet WCAG AA contrast requirements
- Include proper ARIA labels and descriptions
- Support keyboard navigation and screen readers

## Support
For questions about the icon system or to request new icons, please refer to the main project documentation or contact the development team.
