# Status Icons Directory

## Overview

This directory contains icon specifications for all status indicators and UI
feedback elements used in the Phoenix Rooivalk Threat Simulator.

## Icon Categories

### System Status Indicators

Visual feedback for system states and readiness.

#### 1. Cooldown Ready (`cooldown-ready.md`)

- **Type**: Ready state indicator
- **Color**: `#10b981` (success green)
- **Usage**: System ready to fire, available state

#### 2. Cooldown Active (`cooldown-active.md`)

- **Type**: Active cooldown indicator
- **Color**: `#f59e0b` (warning amber)
- **Usage**: System in cooldown period, waiting state

### Resource Status Indicators

Visual feedback for resource levels and availability.

#### 3. Energy Low (`energy-low.md`)

- **Type**: Low energy warning
- **Color**: `#ef4444` (danger red)
- **Usage**: Low energy levels, battery warnings

### Risk Assessment Indicators

Visual feedback for operational risk levels.

#### 4. ROE High Risk (`roe-high.md`)

- **Type**: High Rules of Engagement risk
- **Color**: `#ef4444` (danger red)
- **Usage**: High risk warnings, ROE violations

#### 5. Legal Warning (`legal-warning.md`)

- **Type**: Legal compliance warning
- **Color**: `#f59e0b` (warning amber)
- **Usage**: ITAR/export control alerts, regulatory requirements

## Technical Specifications

### Common Standards

- **Format**: SVG with viewBox="0 0 24 24"
- **Stroke Width**: 2px for consistency
- **Style**: Military, outline-based
- **Line Caps**: Round for all strokes
- **Scaling**: Vector-based for crisp rendering

### Color Usage

- **Success/Ready**: `#10b981` (success green)
- **Warning/Caution**: `#f59e0b` (warning amber)
- **Danger/Error**: `#ef4444` (danger red)
- **Info/Neutral**: `#3b82f6` (info blue)

### Design Principles

- **Status Focus**: Icons should convey system state clearly
- **Clarity**: Recognizable at 16px minimum size
- **Consistency**: Unified stroke width and corner radius
- **Uniqueness**: Each icon should be distinct and memorable
- **Theme**: Military/defense technology aesthetic

## File Structure

Each status icon file contains:

1. **Description**: What the status indicator represents
2. **Visual Elements**: Key visual components
3. **Technical Specifications**: Size, color, style details
4. **AI Generation Prompt**: Ready-to-use prompt for AI icon generation
5. **SVG Structure**: Basic SVG template
6. **Usage Context**: When and where to use the status indicator

## AI Generation Workflow

1. **Review**: Read the icon description and requirements
2. **Generate**: Use the provided AI prompt with your preferred tool
3. **Refine**: Adjust colors, stroke weights, and details for consistency
4. **Test**: Verify clarity at different sizes (16px, 24px, 32px, 48px)
5. **Validate**: Ensure accessibility compliance and cross-browser support

## Integration Notes

- Icons are used in UI status components
- Each status has corresponding logic in game state management
- Colors should match the specified hex values for consistency
- Icons support both active and inactive states
- Status indicators provide real-time feedback to users

## Status Classification

### By System State

- **Ready/Available**: Cooldown Ready
- **Processing/Waiting**: Cooldown Active
- **Warning/Low**: Energy Low
- **Error/Danger**: ROE High Risk, Legal Warning

### By Urgency Level

- **Low Priority**: Cooldown Ready (informational)
- **Medium Priority**: Cooldown Active, Energy Low (attention needed)
- **High Priority**: ROE High Risk, Legal Warning (immediate action required)

### By Color Coding

- **Green**: Success, ready, available
- **Amber**: Warning, caution, processing
- **Red**: Danger, error, critical
- **Blue**: Information, neutral state

## Accessibility Considerations

- **High Contrast**: All status icons meet WCAG AA contrast requirements
- **Screen Readers**: Include proper ARIA labels and descriptions
- **Color Independence**: Icons should be recognizable without color alone
- **Size Scaling**: Must remain clear at all supported sizes

## Maintenance

- Update icon specifications in the `.md` files
- Regenerate icons when design requirements change
- Test new icons across all use cases
- Update component implementations as needed
- Maintain consistency with the military/defense theme
- Ensure accessibility compliance with each update
