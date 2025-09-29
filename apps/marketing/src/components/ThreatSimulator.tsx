"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Threat {
  id: string;
  x: number;
  y: number;
  type: 'drone' | 'swarm' | 'stealth';
  health: number;
  speed: number;
}

interface GameState {
  score: number;
  threats: Threat[];
  neutralized: number;
  level: number;
  isRunning: boolean;
  selectedWeapon: 'kinetic' | 'electronic' | 'laser';
}

export const ThreatSimulator: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    threats: [],
    neutralized: 0,
    level: 1,
    isRunning: true,
    selectedWeapon: 'kinetic'
  });

  // Spawn new threat
  const spawnThreat = useCallback(() => {
    if (!gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const types: ('drone' | 'swarm' | 'stealth')[] = ['drone', 'swarm', 'stealth'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const threat: Threat = {
      id: `threat-${Date.now()}-${Math.random()}`,
      x: Math.random() * Math.max(rect.width - 40, 200),
      y: Math.random() * Math.max(rect.height - 40, 200),
      type,
      health: type === 'stealth' ? 3 : type === 'swarm' ? 2 : 1,
      speed: type === 'stealth' ? 0.5 : type === 'swarm' ? 1.5 : 1,
    };
    
    setGameState(prev => ({
      ...prev,
      threats: [...prev.threats, threat]
    }));
  }, []);

  // Move threats toward center
  const moveThreats = useCallback(() => {
    if (!gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setGameState(prev => {
      const updatedThreats = prev.threats.map(threat => {
        const dx = centerX - threat.x;
        const dy = centerY - threat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          const moveX = (dx / distance) * threat.speed;
          const moveY = (dy / distance) * threat.speed;
          
          return {
            ...threat,
            x: threat.x + moveX,
            y: threat.y + moveY,
          };
        }
        
        return threat;
      });
      
      return { ...prev, threats: updatedThreats };
    });
  }, []);

  // Neutralize threat
  const neutralizeThreat = useCallback((threatId: string) => {
    setGameState(prev => ({
      ...prev,
      threats: prev.threats.filter(t => t.id !== threatId),
      neutralized: prev.neutralized + 1,
      score: prev.score + 100
    }));
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isRunning) return;
    
    const interval = setInterval(() => {
      moveThreats();
      
      // Spawn new threats aggressively
      if (gameState.threats.length < 5 && Math.random() < 0.5) {
        spawnThreat();
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [gameState.isRunning, gameState.threats.length, moveThreats, spawnThreat]);

  // Initial spawn
  useEffect(() => {
    const timer = setTimeout(() => {
      spawnThreat();
      spawnThreat();
      spawnThreat();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [spawnThreat]);

  // Generate swarm
  const generateSwarm = useCallback(() => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnThreat(), i * 150);
    }
  }, [spawnThreat]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      score: 0, 
      threats: [], 
      neutralized: 0, 
      level: 1 
    }));
  }, []);

  // Get threat appearance
  const getThreatAppearance = (type: string) => {
    switch (type) {
      case 'drone':
        return { emoji: '🚁', color: 'bg-red-500' };
      case 'swarm':
        return { emoji: '🐝', color: 'bg-orange-500' };
      case 'stealth':
        return { emoji: '👻', color: 'bg-purple-500' };
      default:
        return { emoji: '🚁', color: 'bg-red-500' };
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 overflow-hidden">
      {/* Game Area */}
      <div 
        ref={gameRef}
        className="absolute inset-0 w-full h-full"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const el = target.closest<HTMLElement>('[data-threat-id]');
          const threatId = el?.getAttribute('data-threat-id');
          if (threatId) neutralizeThreat(threatId);
        }}
      >
        {/* Central Shield */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl z-20">
          <span className="text-2xl">🛡️</span>
        </div>
        
        {/* Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-green-500/30 rounded-full opacity-20">
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-spin origin-left"></div>
        </div>

        {/* Threats */}
        {gameState.threats.map((threat) => {
          const appearance = getThreatAppearance(threat.type);
          
          return (
            <div
              key={threat.id}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:scale-110 ${appearance.color}`}
              style={{
                left: threat.x,
                top: threat.y,
                zIndex: 15,
              }}
              data-threat-id={threat.id}
            >
              <div className="text-lg">{appearance.emoji}</div>
              {/* Health bar */}
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-600 rounded">
                <div
                  className="h-full bg-red-500 rounded transition-all"
                  style={{ width: `${(threat.health / (threat.type === 'stealth' ? 3 : threat.type === 'swarm' ? 2 : 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Overlay - Top Right */}
      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-md shadow-lg">
        <div className="flex gap-4 px-3 py-2">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-cyan-400">{gameState.score}</div>
            <div className="text-xs text-gray-400 font-mono">SCORE</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-orange-400">{gameState.threats.length}</div>
            <div className="text-xs text-gray-400 font-mono">THREATS</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-green-400">{gameState.neutralized}</div>
            <div className="text-xs text-gray-400 font-mono">NEUTRALIZED</div>
          </div>
        </div>
      </div>

      {/* Controls Overlay - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-md shadow-lg">
        <div className="flex gap-2 px-3 py-2">
          <button
            onClick={() => setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors border border-gray-600"
            title={gameState.isRunning ? 'Pause System' : 'Resume System'}
          >
            {gameState.isRunning ? 'PAUSE' : 'RESUME'}
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors border border-gray-600"
            title="Reset System"
          >
            RESET
          </button>
          <button
            onClick={generateSwarm}
            className="px-3 py-1.5 bg-orange-700 hover:bg-orange-600 text-orange-100 rounded text-xs font-mono transition-colors border border-orange-600"
            title="Generate Swarm Attack"
          >
            SWARM
          </button>
          <button
            onClick={() => spawnThreat()}
            className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-green-100 rounded text-xs font-mono transition-colors border border-green-600"
            title="Spawn Single Threat"
          >
            SPAWN
          </button>
          {[
            { key: 'kinetic', color: 'bg-red-700 border-red-600 text-red-100', name: 'Kinetic' },
            { key: 'electronic', color: 'bg-blue-700 border-blue-600 text-blue-100', name: 'Electronic' },
            { key: 'laser', color: 'bg-purple-700 border-purple-600 text-purple-100', name: 'Laser' }
          ].map(weapon => (
            <button
              key={weapon.key}
              onClick={() => setGameState(prev => ({ ...prev, selectedWeapon: weapon.key as any }))}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
                gameState.selectedWeapon === weapon.key
                  ? `${weapon.color} shadow-lg`
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
              }`}
              title={`Select ${weapon.name} Weapon`}
            >
              {weapon.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};