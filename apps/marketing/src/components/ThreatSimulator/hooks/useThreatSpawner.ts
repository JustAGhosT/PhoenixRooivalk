import { useCallback, useRef } from 'react';
import { threatTypes } from '../types';

export const useThreatSpawner = (
  simulatorRef: React.RefObject<HTMLDivElement>,
  gameRunning: boolean,
  activeThreats: number,
  maxThreats: number,
  updateActiveThreats: (delta: number) => void,
  onThreatCreated: (threat: HTMLElement) => void
) => {
  const threatCounter = useRef(0);

  const spawnThreat = useCallback(() => {
    if (!gameRunning || activeThreats >= maxThreats || !simulatorRef.current) return;
    
    threatCounter.current++;
    const threatTypeKeys = Object.keys(threatTypes);
    const randomType = threatTypeKeys[Math.floor(Math.random() * threatTypeKeys.length)];
    const threatType = threatTypes[randomType as keyof typeof threatTypes];
    
    const threat = document.createElement('div');
    threat.id = `threat-${threatCounter.current}`;
    threat.className = 'absolute w-8 h-8 rounded-full flex items-center justify-center cursor-grab hover:cursor-grabbing hover:scale-110 transition-all shadow-lg threat-moving';
    threat.style.backgroundColor = threatType.color;
    threat.style.zIndex = '10';
    threat.dataset.type = randomType;
    threat.dataset.health = threatType.health.toString();
    threat.dataset.maxHealth = threatType.health.toString();
    
    // Random spawn position at edges
    const side = Math.floor(Math.random() * 4);
    const simulatorRect = simulatorRef.current.getBoundingClientRect();
    
    switch (side) {
      case 0: // top
        threat.style.top = '10px';
        threat.style.left = `${Math.random() * (simulatorRect.width - 40)}px`;
        break;
      case 1: // right
        threat.style.top = `${Math.random() * (simulatorRect.height - 40)}px`;
        threat.style.right = '10px';
        break;
      case 2: // bottom
        threat.style.bottom = '10px';
        threat.style.left = `${Math.random() * (simulatorRect.width - 40)}px`;
        break;
      case 3: // left
        threat.style.top = `${Math.random() * (simulatorRect.height - 40)}px`;
        threat.style.left = '10px';
        break;
    }
    
    threat.innerHTML = `
      <div class="text-lg">${threatType.emoji}</div>
      <div class="absolute -bottom-1 left-0 right-0 h-1 bg-gray-600 rounded">
        <div class="h-full bg-red-500 rounded transition-all" style="width: 100%"></div>
      </div>
    `;
    
    simulatorRef.current.appendChild(threat);
    updateActiveThreats(1);
    onThreatCreated(threat);
  }, [gameRunning, activeThreats, maxThreats, simulatorRef, updateActiveThreats, onThreatCreated]);

  const generateSwarm = useCallback(() => {
    if (!gameRunning || !simulatorRef.current) {
      console.log('Swarm generation blocked:', { gameRunning, hasRef: !!simulatorRef.current });
      return;
    }
    
    // Calculate how many threats we can actually spawn
    const availableSlots = maxThreats - activeThreats;
    if (availableSlots <= 0) {
      console.log('No available slots for swarm:', { activeThreats, maxThreats });
      return;
    }
    
    // Generate 3-5 threats in a coordinated swarm, limited by available slots
    const requestedSwarmSize = Math.floor(Math.random() * 3) + 3; // 3-5 threats
    const swarmSize = Math.min(requestedSwarmSize, availableSlots);
    const swarmType = Math.random() > 0.7 ? 'mixed' : 'uniform'; // 70% uniform, 30% mixed
    
    console.log('Generating swarm:', { swarmSize, activeThreats, maxThreats, availableSlots });
    
    // Choose swarm composition
    let threatTypeKeys = Object.keys(threatTypes);
    if (swarmType === 'uniform') {
      // All same type for coordinated attack
      const selectedType = threatTypeKeys[Math.floor(Math.random() * threatTypeKeys.length)];
      threatTypeKeys = [selectedType];
    }
    
    // Spawn threats in formation
    for (let i = 0; i < swarmSize; i++) {
      
      setTimeout(() => {
        const randomType = threatTypeKeys[Math.floor(Math.random() * threatTypeKeys.length)];
        const threatType = threatTypes[randomType as keyof typeof threatTypes];
        
        threatCounter.current++;
        const threat = document.createElement('div');
        threat.id = `threat-${threatCounter.current}`;
        threat.className = 'absolute w-8 h-8 rounded-full flex items-center justify-center cursor-grab hover:cursor-grabbing hover:scale-110 transition-all shadow-lg threat-moving swarm-threat';
        threat.style.backgroundColor = threatType.color;
        threat.style.zIndex = '10';
        threat.dataset.type = randomType;
        threat.dataset.health = threatType.health.toString();
        threat.dataset.maxHealth = threatType.health.toString();
        threat.dataset.swarmId = `swarm-${Date.now()}`; // Mark as part of swarm
        
        // Spawn from same side for coordinated attack
        const spawnSide = Math.floor(Math.random() * 4);
        const simulatorRect = simulatorRef.current!.getBoundingClientRect();
        const formationOffset = (i - swarmSize / 2) * 60; // Spread formation
        
        switch (spawnSide) {
          case 0: // top
            threat.style.top = '10px';
            threat.style.left = `${Math.max(10, Math.min(simulatorRect.width - 50, simulatorRect.width / 2 + formationOffset))}px`;
            break;
          case 1: // right
            threat.style.top = `${Math.max(10, Math.min(simulatorRect.height - 50, simulatorRect.height / 2 + formationOffset))}px`;
            threat.style.right = '10px';
            break;
          case 2: // bottom
            threat.style.bottom = '10px';
            threat.style.left = `${Math.max(10, Math.min(simulatorRect.width - 50, simulatorRect.width / 2 + formationOffset))}px`;
            break;
          case 3: // left
            threat.style.top = `${Math.max(10, Math.min(simulatorRect.height - 50, simulatorRect.height / 2 + formationOffset))}px`;
            threat.style.left = '10px';
            break;
        }
        
        threat.innerHTML = `
          <div class="text-lg">${threatType.emoji}</div>
          <div class="absolute -bottom-1 left-0 right-0 h-1 bg-gray-600 rounded">
            <div class="h-full bg-red-500 rounded transition-all" style="width: 100%"></div>
          </div>
          <div class="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            S
          </div>
        `;
        
        simulatorRef.current?.appendChild(threat);
        updateActiveThreats(1);
        onThreatCreated(threat);
      }, i * 200); // Stagger spawn by 200ms
    }
  }, [gameRunning, activeThreats, maxThreats, simulatorRef, updateActiveThreats, onThreatCreated]);

  return { spawnThreat, generateSwarm };
};
