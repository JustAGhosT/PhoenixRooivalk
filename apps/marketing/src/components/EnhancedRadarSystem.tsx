import React, { useState } from 'react';

export type ThreatType = 'hostile' | 'unknown' | 'friendly';
export type DroneRole = 'guard' | 'recon' | 'ecm' | 'support' | 'deception' | 'capture' | 'sensor' | 'logistics' | 'directed';

export interface RadarTarget {
  id: string;
  type: ThreatType;
  position: { x: number; y: number };
  distance: number; // in meters
  bearing: number; // in degrees
  speed: number; // in m/s
  altitude: number; // in meters
  confidence: number; // 0-1
  lastUpdate: number; // timestamp
}

export interface FriendlyDeployment {
  id: string;
  role: DroneRole;
  position: { x: number; y: number };
  status: 'active' | 'idle' | 'returning' | 'disabled';
  energy: number;
  maxEnergy: number;
}

export interface EnhancedRadarSystemProps {
  targets: RadarTarget[];
  friendlyDeployments: FriendlyDeployment[];
  range: number; // radar range in meters
  centerPosition: { x: number; y: number };
  className?: string;
}

export const EnhancedRadarSystem: React.FC<EnhancedRadarSystemProps> = ({
  targets,
  friendlyDeployments,
  range,
  centerPosition,
  className = ''
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const getThreatColor = (type: ThreatType): string => {
    switch (type) {
      case 'hostile': return '#ef4444'; // Red
      case 'unknown': return '#f59e0b'; // Amber
      case 'friendly': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getThreatShape = (type: ThreatType): string => {
    switch (type) {
      case 'hostile': return '●'; // Filled circle
      case 'unknown': return '○'; // Ring
      case 'friendly': return '▲'; // Triangle
      default: return '?';
    }
  };

  const getRoleIcon = (role: DroneRole): string => {
    const roleIcons = {
      'guard': '🛡',
      'recon': '👁',
      'ecm': '📡',
      'support': '🔧',
      'deception': '🎭',
      'capture': '🕸',
      'sensor': '📊',
      'logistics': '📦',
      'directed': '⚡'
    };
    return roleIcons[role] || '?';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#6b7280';
      case 'returning': return '#f59e0b';
      case 'disabled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const scalePosition = (position: { x: number; y: number }, radarSize: number) => {
    const scale = radarSize / (range * 2); // Convert meters to pixels
    return {
      x: centerPosition.x + (position.x * scale),
      y: centerPosition.y - (position.y * scale) // Flip Y axis for radar display
    };
  };

  const radarSize = 400; // Fixed radar display size

  return (
    <div className={`enhanced-radar-system ${className}`}>
      {/* Radar Display */}
      <div className="radar-container">
        <svg 
          width={radarSize} 
          height={radarSize} 
          className="radar-display"
          viewBox={`0 0 ${radarSize} ${radarSize}`}
        >
          {/* Radar Grid */}
          <defs>
            <pattern id="radarGrid" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--sim-border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          {/* Radar Background */}
          <circle 
            cx={centerPosition.x} 
            cy={centerPosition.y} 
            r={radarSize / 2 - 20} 
            fill="url(#radarGrid)" 
            stroke="var(--sim-border)" 
            strokeWidth="2"
            className="radar-background"
          />
          
          {/* Range Rings */}
          {[0.25, 0.5, 0.75, 1.0].map(ring => (
            <circle
              key={ring}
              cx={centerPosition.x}
              cy={centerPosition.y}
              r={(radarSize / 2 - 20) * ring}
              fill="none"
              stroke="var(--sim-border)"
              strokeWidth="1"
              opacity="0.4"
              className="range-ring"
            />
          ))}

          {/* Center Crosshairs */}
          <line 
            x1={centerPosition.x - 10} 
            y1={centerPosition.y} 
            x2={centerPosition.x + 10} 
            y2={centerPosition.y} 
            stroke="var(--sim-accent)" 
            strokeWidth="2"
          />
          <line 
            x1={centerPosition.x} 
            y1={centerPosition.y - 10} 
            x2={centerPosition.x} 
            y2={centerPosition.y + 10} 
            stroke="var(--sim-accent)" 
            strokeWidth="2"
          />

          {/* Sentinel Core (Center) */}
          <circle
            cx={centerPosition.x}
            cy={centerPosition.y}
            r="8"
            fill="var(--sim-accent)"
            stroke="white"
            strokeWidth="2"
            className="sentinel-core"
          />
          <text
            x={centerPosition.x}
            y={centerPosition.y + 3}
            textAnchor="middle"
            fontSize="8"
            fill="white"
            fontWeight="600"
            className="sentinel-label"
          >
            CORE
          </text>

          {/* Threat Targets */}
          {targets.map(target => {
            const scaledPos = scalePosition(target.position, radarSize);
            const isSelected = selectedTarget === target.id;
            
            return (
              <g key={target.id} className="radar-target">
                <circle
                  cx={scaledPos.x}
                  cy={scaledPos.y}
                  r="6"
                  fill={getThreatColor(target.type)}
                  stroke="white"
                  strokeWidth="1"
                  className={`target-marker ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedTarget(target.id)}
                />
                <text
                  x={scaledPos.x}
                  y={scaledPos.y + 2}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="600"
                  className="target-shape"
                >
                  {getThreatShape(target.type)}
                </text>
                
                {/* Target Info */}
                {isSelected && (
                  <g className="target-info">
                    <rect
                      x={scaledPos.x + 10}
                      y={scaledPos.y - 20}
                      width="80"
                      height="40"
                      fill="var(--sim-elev)"
                      stroke="var(--sim-border)"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text x={scaledPos.x + 15} y={scaledPos.y - 8} fontSize="8" fill="var(--sim-text)">
                      ID: {target.id}
                    </text>
                    <text x={scaledPos.x + 15} y={scaledPos.y + 2} fontSize="8" fill="var(--sim-text)">
                      Range: {Math.round(target.distance)}m
                    </text>
                    <text x={scaledPos.x + 15} y={scaledPos.y + 12} fontSize="8" fill="var(--sim-text)">
                      Speed: {Math.round(target.speed)}m/s
                    </text>
                    <text x={scaledPos.x + 15} y={scaledPos.y + 22} fontSize="8" fill="var(--sim-text)}">
                      Alt: {Math.round(target.altitude)}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Friendly Deployments */}
          {friendlyDeployments.map(deployment => {
            const scaledPos = scalePosition(deployment.position, radarSize);
            
            return (
              <g key={deployment.id} className="friendly-deployment">
                <polygon
                  points={`${scaledPos.x},${scaledPos.y - 8} ${scaledPos.x - 6},${scaledPos.y + 4} ${scaledPos.x + 6},${scaledPos.y + 4}`}
                  fill={getStatusColor(deployment.status)}
                  stroke="white"
                  strokeWidth="1"
                  className="friendly-marker"
                />
                <text
                  x={scaledPos.x}
                  y={scaledPos.y + 1}
                  textAnchor="middle"
                  fontSize="6"
                  fill="white"
                  fontWeight="600"
                  className="role-icon"
                >
                  {getRoleIcon(deployment.role)}
                </text>
                
                {/* Energy Status Ring */}
                <circle
                  cx={scaledPos.x}
                  cy={scaledPos.y}
                  r="12"
                  fill="none"
                  stroke={getStatusColor(deployment.status)}
                  strokeWidth="1"
                  strokeDasharray={`${(deployment.energy / deployment.maxEnergy) * 75.4} 75.4`}
                  opacity="0.6"
                  className="energy-ring"
                />
              </g>
            );
          })}

          {/* Scan Sweep Animation */}
          <g className="scan-sweep">
            <line
              x1={centerPosition.x}
              y1={centerPosition.y}
              x2={centerPosition.x + Math.cos(Date.now() * 0.002) * (radarSize / 2 - 20)}
              y2={centerPosition.y + Math.sin(Date.now() * 0.002) * (radarSize / 2 - 20)}
              stroke="var(--sim-accent)"
              strokeWidth="2"
              opacity="0.8"
              className="sweep-line"
            />
          </g>
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="radar-legend">
          <div className="legend-title">RADAR LEGEND</div>
          
          <div className="legend-section">
            <div className="legend-subtitle">Threat Types</div>
            <div className="legend-item">
              <span className="legend-symbol hostile">●</span>
              <span className="legend-label">Hostile</span>
            </div>
            <div className="legend-item">
              <span className="legend-symbol unknown">○</span>
              <span className="legend-label">Unknown</span>
            </div>
            <div className="legend-item">
              <span className="legend-symbol friendly">▲</span>
              <span className="legend-label">Friendly</span>
            </div>
          </div>

          <div className="legend-section">
            <div className="legend-subtitle">Deployment Status</div>
            <div className="legend-item">
              <span className="legend-symbol active">▲</span>
              <span className="legend-label">Active</span>
            </div>
            <div className="legend-item">
              <span className="legend-symbol idle">▲</span>
              <span className="legend-label">Idle</span>
            </div>
            <div className="legend-item">
              <span className="legend-symbol returning">▲</span>
              <span className="legend-label">Returning</span>
            </div>
          </div>

          <div className="legend-section">
            <div className="legend-subtitle">Range Rings</div>
            <div className="legend-item">
              <span className="legend-range">0-{Math.round(range * 0.25)}m</span>
            </div>
            <div className="legend-item">
              <span className="legend-range">0-{Math.round(range * 0.5)}m</span>
            </div>
            <div className="legend-item">
              <span className="legend-range">0-{Math.round(range * 0.75)}m</span>
            </div>
            <div className="legend-item">
              <span className="legend-range">0-{range}m</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="radar-controls">
        <button 
          className="radar-control-btn"
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? 'Hide' : 'Show'} Legend
        </button>
      </div>
    </div>
  );
};
