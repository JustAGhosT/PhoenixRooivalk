# Power-up Icons Directory

## Overview

This directory contains icon specifications for all power-up and enhancement systems used in the Phoenix Rooivalk Threat Simulator.

## Icon Categories

### Combat Enhancement Power-ups

Temporary enhancements that boost weapon system effectiveness.

#### 1. Damage Boost (`damage-boost.md`)

- **Type**: Damage enhancement power-up
- **Color**: `#ef4444` (danger red)
- **Usage**: Increased weapon effectiveness, damage amplification

#### 2. Rapid Fire (`rapid-fire.md`)

- **Type**: Firing rate enhancement power-up
- **Color**: `#f59e0b` (warning amber)
- **Usage**: Increased firing rate, speed enhancement

#### 3. Area Effect (`area-effect.md`)

- **Type**: Coverage expansion power-up
- **Color**: `#8b5cf6` (ECM purple)
- **Usage**: Expanded weapon coverage, area enhancement

#### 4. Range Boost (`range-boost.md`)

- **Type**: Distance enhancement power-up
- **Color**: `#06b6d4` (info cyan)
- **Usage**: Increased weapon reach, range extension

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

- **Enhancement Focus**: Icons should convey improvement/boost
- **Clarity**: Recognizable at 16px minimum size
- **Consistency**: Unified stroke width and corner radius
- **Uniqueness**: Each icon should be distinct and memorable
- **Theme**: Military/defense technology aesthetic

## File Structure

Each power-up icon file contains:

1. **Description**: What the power-up does
2. **Visual Elements**: Key visual components
3. **Technical Specifications**: Size, color, style details
4. **AI Generation Prompt**: Ready-to-use prompt for AI icon generation
5. **SVG Structure**: Basic SVG template
6. **Usage Context**: When and where to use the power-up

## AI Generation Workflow

1. **Review**: Read the icon description and requirements
2. **Generate**: Use the provided AI prompt with your preferred tool
3. **Refine**: Adjust colors, stroke weights, and details for consistency
4. **Test**: Verify clarity at different sizes (16px, 24px, 32px, 48px)
5. **Validate**: Ensure accessibility compliance and cross-browser support

## Integration Notes

- Icons are used in power-up UI components
- Each power-up has corresponding data in `weaponTypes.ts`
- Colors should match the specified hex values for consistency
- Icons support both active and inactive states
- Power-ups are temporary enhancements with duration limits

## Power-up Classification

### By Enhancement Type

- **Damage**: Damage Boost
- **Speed**: Rapid Fire
- **Coverage**: Area Effect
- **Range**: Range Boost

### By Duration

- **Temporary**: All power-ups have limited duration
- **Stackable**: Multiple power-ups can be active simultaneously
- **Visual Feedback**: Icons should show active/inactive states

### By Rarity/Effectiveness

- **Common**: Basic enhancements (damage boost, rapid fire)
- **Uncommon**: Advanced enhancements (area effect, range boost)
- **Visual Hierarchy**: Rarer power-ups should have more distinctive visual elements

## Maintenance

- Update icon specifications in the `.md` files
- Regenerate icons when design requirements change
- Test new icons across all use cases
- Update component implementations as needed
- Maintain consistency with the military/defense theme
