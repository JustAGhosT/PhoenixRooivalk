import React, { useCallback, useEffect, useState } from 'react';
import effectorDatabase from '../data/effectorDatabase.json';
import { EnergyManagement } from './EnergyManagement';
import { WeaponCooldownMeter } from './EnhancedCooldownMeter';
import { CompactROEIndicator } from './EnhancedROEIndicator';
import { EnhancedRadarSystem, FriendlyDeployment, RadarTarget } from './EnhancedRadarSystem';
import { FilterChips } from './FilterChips';
import { InfoPopover } from './InfoPopover';
import { LegalBadge } from './LegalBadge';
import { MultiSelectDeployment } from './MultiSelectDeployment';
import { SynergyEffect, SynergySystem } from './SynergySystem';

export interface EnhancedThreatSimulatorProps {
  className?: string;
}

export const EnhancedThreatSimulator: React.FC<EnhancedThreatSimulatorProps> = ({
  className = ''
}) => {
  // Core system state
  const [currentEnergy, setCurrentEnergy] = useState(100);
  const [maxEnergy, _setMaxEnergy] = useState(100);
  const [selectedEffectors, setSelectedEffectors] = useState<string[]>([]);
  const [selectedDrones, setSelectedDrones] = useState<string[]>([]);
  const [activeSynergies, setActiveSynergies] = useState<SynergyEffect[]>([]);
  
  // Radar and targets
  const [targets, setTargets] = useState<RadarTarget[]>([]);
  const [friendlyDeployments, setFriendlyDeployments] = useState<FriendlyDeployment[]>([]);
  
  // UI state
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [acknowledgedLegal, setAcknowledgedLegal] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'planning' | 'active' | 'complete'>('planning');

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with some demo targets
    const demoTargets: RadarTarget[] = [
      {
        id: 'TGT-001',
        type: 'hostile',
        position: { x: 150, y: 200 },
        distance: 250,
        bearing: 45,
        speed: 15,
        altitude: 100,
        confidence: 0.85,
        lastUpdate: Date.now()
      },
      {
        id: 'TGT-002',
        type: 'unknown',
        position: { x: -100, y: 150 },
        distance: 180,
        bearing: 135,
        speed: 8,
        altitude: 50,
        confidence: 0.65,
        lastUpdate: Date.now()
      }
    ];
    setTargets(demoTargets);

    // Initialize with some demo friendly deployments
    const demoDeployments: FriendlyDeployment[] = [
      {
        id: 'DRONE-001',
        role: 'recon',
        position: { x: 50, y: -100 },
        status: 'active',
        energy: 80,
        maxEnergy: 100
      },
      {
        id: 'DRONE-002',
        role: 'guard',
        position: { x: -80, y: 50 },
        status: 'idle',
        energy: 60,
        maxEnergy: 100
      }
    ];
    setFriendlyDeployments(demoDeployments);
  }, []);

  // Handle effector selection with energy constraints
  const handleEffectorSelection = useCallback((effectorId: string) => {
    const effector = effectorDatabase.effectors.find(e => e.id === effectorId);
    if (!effector) return;

    const energyCost = effector.energy || 0;
    
    if (selectedEffectors.includes(effectorId)) {
      // Remove effector
      setSelectedEffectors(prev => prev.filter(id => id !== effectorId));
      setCurrentEnergy(prev => prev + energyCost);
    } else if (currentEnergy >= energyCost) {
      // Add effector
      setSelectedEffectors(prev => [...prev, effectorId]);
      setCurrentEnergy(prev => prev - energyCost);
    }
  }, [selectedEffectors, currentEnergy]);

  // Handle drone deployment selection
  const handleDroneSelection = useCallback((selected: string[], _usedEnergy: number) => {
    setSelectedDrones(selected);
    // Energy is already managed by MultiSelectDeployment component
  }, []);

  // Handle synergy updates
  const handleSynergyUpdate = useCallback((synergies: SynergyEffect[]) => {
    setActiveSynergies(synergies);
  }, []);

  // Handle energy updates
  const handleEnergyUpdate = useCallback((used: number, remaining: number) => {
    setCurrentEnergy(remaining);
  }, []);

  // Handle legal acknowledgment
  const handleLegalAcknowledgment = useCallback((legalFlag: string) => {
    setAcknowledgedLegal(prev => [...prev, legalFlag]);
  }, []);

  // Get filtered effectors
  const getFilteredEffectors = useCallback(() => {
    let filtered = effectorDatabase.effectors;
    
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(effector => 
        selectedFilters.includes(effector.class)
      );
    }
    
    return filtered;
  }, [selectedFilters]);

  // Check if planning is complete
  const isPlanningComplete = useCallback(() => {
    const hasEffectors = selectedEffectors.length > 0;
    const hasDrones = selectedDrones.length > 0;
    const hasEnergy = currentEnergy >= 0;
    const hasLegalAcknowledgment = selectedEffectors.every(effectorId => {
      const effector = effectorDatabase.effectors.find(e => e.id === effectorId);
      if (!effector || !effector.legal_flags) return true;
      return effector.legal_flags.every(flag => acknowledgedLegal.includes(flag));
    });
    
    return hasEffectors && hasDrones && hasEnergy && hasLegalAcknowledgment;
  }, [selectedEffectors, selectedDrones, currentEnergy, acknowledgedLegal]);

  const centerPosition = { x: 200, y: 200 };
  const radarRange = 500;

  return (
    <div className={`enhanced-threat-simulator ${className}`}>
      <div className="simulator-header">
        <h1 className="simulator-title">SENTINEL CORE (EDN-1) - THREAT SIMULATOR</h1>
        <div className="simulator-status">
          <span className={`status-indicator ${gamePhase}`}>
            {gamePhase.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="simulator-layout">
        {/* Left Panel - Radar and System Status */}
        <div className="simulator-left-panel">
          <EnhancedRadarSystem
            targets={targets}
            friendlyDeployments={friendlyDeployments}
            range={radarRange}
            centerPosition={centerPosition}
            className="radar-panel"
          />
          
          <div className="system-status-panel">
            <h3 className="panel-title">SYSTEM STATUS</h3>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Energy:</span>
                <span className="status-value">{currentEnergy}/{maxEnergy}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Active Synergies:</span>
                <span className="status-value">{activeSynergies.length}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Deployed Drones:</span>
                <span className="status-value">{selectedDrones.length}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Active Effectors:</span>
                <span className="status-value">{selectedEffectors.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Effector Selection */}
        <div className="simulator-center-panel">
          <div className="effector-selection-panel">
            <div className="panel-header">
              <h3 className="panel-title">EFFECTOR SELECTION</h3>
              <FilterChips
                chips={[
                  { id: 'hard_kill', label: 'Hard Kill', color: '#ef4444' },
                  { id: 'soft_kill', label: 'Soft Kill', color: '#f59e0b' },
                  { id: 'deception', label: 'Deception', color: '#70A1FF' },
                  { id: 'denial', label: 'Denial', color: '#8b5cf6' }
                ]}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            </div>

            <div className="effector-grid">
              {getFilteredEffectors().map(effector => {
                const isSelected = selectedEffectors.includes(effector.id);
                const canAfford = currentEnergy >= (effector.energy || 0);
                const needsLegalAck = effector.legal_flags && effector.legal_flags.some(flag => 
                  !acknowledgedLegal.includes(flag)
                );

                return (
                  <div 
                    key={effector.id} 
                    className={`effector-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'insufficient-energy' : ''}`}
                  >
                    <div className="effector-header">
                      <div className="effector-name">{effector.name}</div>
                      <div className="effector-class">{effector.class}</div>
                    </div>

                    <div className="effector-specs">
                      <div className="effector-spec">
                        <span className="spec-label">Energy:</span>
                        <span className="spec-value">{effector.energy}</span>
                      </div>
                      <div className="effector-spec">
                        <span className="spec-label">Cooldown:</span>
                        <span className="spec-value">{effector.cooldown}s</span>
                      </div>
                      <div className="effector-spec">
                        <span className="spec-label">Range:</span>
                        <span className="spec-value">{effector.range}</span>
                      </div>
                    </div>

                    <div className="effector-controls">
                      <CompactROEIndicator riskLevel={effector.roe as 'low' | 'medium' | 'high'} />
                      
                      {effector.legal_flags && (
                        <LegalBadge
                          legalFlags={effector.legal_flags}
                          onAcknowledge={() => handleLegalAcknowledgment(effector.id)}
                        />
                      )}

                      {effector.brands && (
                        <InfoPopover
                          title={effector.name}
                          brands={effector.brands}
                          sources={effector.sources}
                        >
                          <button className="info-btn">ℹ️</button>
                        </InfoPopover>
                      )}
                    </div>

                    <button
                      className={`effector-select-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleEffectorSelection(effector.id)}
                      disabled={!canAfford || needsLegalAck}
                    >
                      {isSelected ? 'Remove' : 'Select'}
                    </button>

                    {needsLegalAck && (
                      <div className="legal-warning">
                        Legal compliance required
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Drone Deployment and Systems */}
        <div className="simulator-right-panel">
          <MultiSelectDeployment
            availableEnergy={currentEnergy}
            onSelectionChange={handleDroneSelection}
          />

          <SynergySystem
            selectedEffectors={selectedEffectors}
            onSynergyUpdate={handleSynergyUpdate}
          />

          <EnergyManagement
            maxEnergy={maxEnergy}
            selectedEffectors={selectedEffectors}
            selectedDrones={selectedDrones}
            activePowerUps={[]}
            onEnergyUpdate={handleEnergyUpdate}
          />
        </div>
      </div>

      {/* Bottom Panel - Active Systems */}
      {selectedEffectors.length > 0 && (
        <div className="simulator-bottom-panel">
          <h3 className="panel-title">ACTIVE SYSTEMS</h3>
          <div className="active-systems-grid">
            {selectedEffectors.map(effectorId => {
              const effector = effectorDatabase.effectors.find(e => e.id === effectorId);
              if (!effector) return null;

              return (
                <div key={effectorId} className="active-system-card">
                  <div className="system-header">
                    <div className="system-name">{effector.name}</div>
                    <CompactROEIndicator riskLevel={effector.roe as 'low' | 'medium' | 'high'} />
                  </div>

                  <div className="system-controls">
                    <WeaponCooldownMeter
                      weaponId={effectorId}
                      cooldownTime={effector.cooldown || 0}
                      isActive={false}
                      isReady={true}
                      energyCost={effector.energy || 0}
                      currentEnergy={currentEnergy}
                    />

                    <button className="fire-btn" disabled={currentEnergy < (effector.energy || 0)}>
                      FIRE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Planning Complete Button */}
      {gamePhase === 'planning' && (
        <div className="planning-controls">
          <button
            className={`start-mission-btn ${isPlanningComplete() ? 'ready' : 'disabled'}`}
            onClick={() => setGamePhase('active')}
            disabled={!isPlanningComplete()}
          >
            {isPlanningComplete() ? 'START MISSION' : 'COMPLETE PLANNING'}
          </button>
        </div>
      )}
    </div>
  );
};
