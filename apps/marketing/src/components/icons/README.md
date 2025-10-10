# Icon System Documentation

## Overview

This directory contains the complete icon system for the Phoenix Rooivalk Threat
Simulator, organized by category with detailed descriptions and AI generation
prompts for each icon.

## Directory Structure

```text
icons/
├── effectors/          # Counter-drone weapon systems (17 icons)
├── drones/             # Deployable UAV types (17 icons)
├── powerups/           # Enhancement and power-up systems (4 icons)
├── status/             # Status and UI indicators (5 icons)
├── README.md           # Main documentation
└── Icon_Requirements.md # Complete specifications
```

## Icon Categories

### Effectors (Weapon Systems)

Located in `effectors/` directory - Contains all counter-drone weapon systems
including:

- **Hard Kill**: Kinetic, Smart Slug, Net Interceptor
- **Soft Kill**: EMP, HPM, RF Jam, RF Takeover, GNSS Denial
- **Directed Energy**: Laser (HEL), Optical Dazzler
- **Deception**: Decoy Beacon, AI Deception
- **Countermeasures**: Chaff/Obscurant, Acoustic Disruptor

### Drones (Deployable Systems)

Located in `drones/` directory - Contains all UAV and deployable systems
including:

- **Core Types**: Effector, Jammer, Surveillance, Shield, Swarm Coordinator
- **Extended Types**: Decoy UAV, Net-Capture UAV, EW Relay UAV, Tethered
  Overwatch, Recovery Drone, Micro-Decoy Swarm, Perimeter Sentry, Spotter UAV,
  HPM Pod UAV, Shield Wall, LiDAR Mapper, Optical Mesh Drone

### Power-ups (Enhancement Systems)

Located in `powerups/` directory - Contains all temporary enhancement systems
including:

- **Damage Boost**: Increased weapon effectiveness
- **Rapid Fire**: Enhanced firing rate
- **Area Effect**: Expanded weapon coverage
- **Range Boost**: Increased weapon reach

### Status Icons (UI Indicators)

Located in `status/` directory - Contains all status and feedback indicators
including:

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

- **Kinetic Weapons**: `#dc2626` (red)
- **Electronic Warfare**: `#8b5cf6` (purple)
- **Directed Energy**: `#ef4444` (bright red)
- **Countermeasures**: `#f59e0b` (amber)
- **Deception**: `#10b981` (emerald)
- **Power-ups**: `#06b6d4` (cyan)
- **Status Indicators**: `#f59e0b` (amber)

### File Structure

Each icon directory contains:

- **Individual `.md` files**: Detailed specifications for each icon
- **AI Generation Prompts**: Ready-to-use prompts for icon generation
- **SVG Examples**: Sample SVG implementations
- **Usage Context**: When and how to use each icon

## Usage Guidelines

### Integration

- Use SVG format for crisp rendering at any size
- Maintain consistent 2px stroke width
- Follow the established color palette
- Ensure proper contrast ratios for accessibility

### Naming Conventions

- Use kebab-case for file names (e.g., `smart-slug.md`)
- Use descriptive names that match the icon's function
- Include the icon type in the filename when relevant

### Documentation Standards

- Include clear visual descriptions
- Provide technical specifications
- Add usage context and examples
- Include AI generation prompts for consistency

## AI Generation

Each icon includes a standardized AI generation prompt that specifies:

- Icon type and purpose
- Visual style requirements
- Technical specifications (size, stroke width)
- Color requirements
- Aesthetic guidelines

These prompts ensure consistent icon generation across the entire system.
