"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || '';
  
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - elementVisible) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Add custom animations for threat simulator
    const style = document.createElement('style');
    style.textContent = `
      @keyframes explosion {
        0% { transform: scale(0.5); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes scoreFloat {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
      }
      
      @keyframes neutralizationPulse {
        0% { transform: scale(1); border-width: 2px; }
        50% { transform: scale(1.5); border-width: 4px; }
        100% { transform: scale(2); border-width: 1px; opacity: 0; }
      }
      
      @keyframes radar {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .animate-radar {
        animation: radar 3s linear infinite;
        will-change: transform;
      }
      
      .threat-moving {
        will-change: transform;
      }
      
      .threat-moving:not(.neutralized) {
        will-change: auto;
      }
    `;
    document.head.appendChild(style);

    // Enhanced Game Logic
    let draggedElement: HTMLElement | null = null;
    let neutralizedCount = 0;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let score = 0;
    let gameLevel = 1;
    let activeThreats = 0;
    let maxThreats = 3;
    let threatSpawnRate = 3000; // milliseconds
    let gameRunning = true;
    let threatCounter = 0;
    let selectedCountermeasure = 'kinetic'; // default countermeasure
    
    const simulator = document.getElementById('threat-simulator');
    const threatsNeutralizedEl = document.getElementById('threats-neutralized');
    const scoreDisplayEl = document.getElementById('score-display');
    
    // Threat types with different behaviors and countermeasures
    const threatTypes = {
      drone: { emoji: '🚁', speed: 1.5, health: 1, points: 100, weakness: 'kinetic', color: '#ef4444' },
      radar: { emoji: '📡', speed: 1.0, health: 2, points: 150, weakness: 'electronic', color: '#f97316' },
      stealth: { emoji: '🛸', speed: 2.0, health: 1, points: 200, weakness: 'laser', color: '#eab308' },
      swarm: { emoji: '🐝', speed: 2.5, health: 1, points: 75, weakness: 'kinetic', color: '#8b5cf6' },
      heavy: { emoji: '🚀', speed: 0.8, health: 3, points: 300, weakness: 'laser', color: '#dc2626' }
    };
    
    // Countermeasures
    const countermeasures = {
      kinetic: { name: 'Kinetic Interceptor', color: '#00ff88', effectiveness: { drone: 1.0, swarm: 1.0, radar: 0.5, stealth: 0.7, heavy: 0.3 } },
      electronic: { name: 'EW Jammer', color: '#0088ff', effectiveness: { drone: 0.7, swarm: 0.8, radar: 1.0, stealth: 0.5, heavy: 0.6 } },
      laser: { name: 'Directed Energy', color: '#ff0088', effectiveness: { drone: 0.8, swarm: 0.6, radar: 0.7, stealth: 1.0, heavy: 1.0 } }
    };
    
    // Neutralization function with enhanced effects
    const neutralizeThreat = (threat: HTMLElement) => {
      if (threat.classList.contains('neutralized')) return;
      
      // Stop dragging immediately
      if (draggedElement === threat) {
        draggedElement = null;
        isDragging = false;
      }
      
      threat.classList.add('neutralized');
      threat.style.pointerEvents = 'none';
      threat.style.cursor = 'default';
      
      // Create explosion effect
      const explosionEffect = document.createElement('div');
      explosionEffect.className = 'absolute pointer-events-none';
      explosionEffect.style.left = threat.style.left;
      explosionEffect.style.top = threat.style.top;
      explosionEffect.style.width = '60px';
      explosionEffect.style.height = '60px';
      explosionEffect.style.borderRadius = '50%';
      explosionEffect.style.background = 'radial-gradient(circle, #ff6b6b, #ff8e53, #ff6b6b)';
      explosionEffect.style.animation = 'explosion 0.6s ease-out forwards';
      explosionEffect.style.zIndex = '999';
      explosionEffect.innerHTML = '💥';
      explosionEffect.style.display = 'flex';
      explosionEffect.style.alignItems = 'center';
      explosionEffect.style.justifyContent = 'center';
      explosionEffect.style.fontSize = '24px';
      
      simulator?.appendChild(explosionEffect);
      
      // Threat destruction animation
      threat.style.transition = 'all 0.5s ease-out';
      threat.style.transform = 'scale(0.3) rotate(180deg)';
      threat.style.opacity = '0.1';
      threat.style.filter = 'grayscale(100%)';
      
      // Show neutralization ring effect
      const effectId = `neutralization-effect-${threat.id.split('-')[1]}`;
      const effect = document.getElementById(effectId);
      if (effect) {
        effect.style.opacity = '1';
        effect.style.borderColor = '#00ff88';
        effect.style.animation = 'neutralizationPulse 1s ease-out forwards';
      }
      
      // Add score effect
      const scoreEffect = document.createElement('div');
      scoreEffect.className = 'absolute pointer-events-none text-green-400 font-bold text-lg';
      scoreEffect.style.left = threat.style.left;
      scoreEffect.style.top = `${parseFloat(threat.style.top) - 30}px`;
      scoreEffect.style.animation = 'scoreFloat 2s ease-out forwards';
      scoreEffect.style.zIndex = '1000';
      scoreEffect.textContent = '+100';
      simulator?.appendChild(scoreEffect);
      
      neutralizedCount++;
      score += 100;
      
      if (threatsNeutralizedEl) {
        const neutralizedSpan = threatsNeutralizedEl.querySelector('span:last-child');
        if (neutralizedSpan) neutralizedSpan.textContent = neutralizedCount.toString();
      }
      
      if (scoreDisplayEl) {
        const scoreSpan = scoreDisplayEl.querySelector('span:last-child');
        if (scoreSpan) scoreSpan.textContent = score.toString();
      }
      
      // Clean up effects
      setTimeout(() => {
        explosionEffect.remove();
        scoreEffect.remove();
        if (effect) {
          effect.style.opacity = '0';
          effect.style.animation = '';
        }
      }, 2000);
      
      // Reset after 4 seconds
      setTimeout(() => {
        resetThreat(threat);
      }, 4000);
    };
    
    // Reset threat function
    const resetThreat = (threat: HTMLElement) => {
      threat.classList.remove('neutralized');
      threat.style.opacity = '1';
      threat.style.pointerEvents = 'auto';
      threat.style.cursor = 'grab';
      threat.style.transition = 'all 0.3s ease-in';
      threat.style.transform = 'scale(1) rotate(0deg)';
      threat.style.filter = 'none';
      
      // Reset to original position with animation
      const threatNum = threat.id.split('-')[1];
      switch (threatNum) {
        case '1':
          threat.style.top = '4rem';
          threat.style.right = '4rem';
          threat.style.left = 'auto';
          threat.style.bottom = 'auto';
          break;
        case '2':
          threat.style.bottom = '5rem';
          threat.style.left = '3rem';
          threat.style.top = 'auto';
          threat.style.right = 'auto';
          break;
        case '3':
          threat.style.top = '8rem';
          threat.style.left = '5rem';
          threat.style.bottom = 'auto';
          threat.style.right = 'auto';
          // Restart automated movement for threat 3
          setTimeout(() => startAutomatedThreat(threat), 1000);
          break;
      }
      
      neutralizedCount--;
      if (threatsNeutralizedEl) {
        threatsNeutralizedEl.textContent = `Neutralized: ${neutralizedCount}`;
      }
      
      // Clear transition after reset
      setTimeout(() => {
        threat.style.transition = '';
      }, 300);
    };
    
    // Enhanced automated threat movement
    const startAutomatedThreat = (threat: HTMLElement) => {
      if (!simulator) return;
      
      const threatType = threatTypes[threat.dataset.type as keyof typeof threatTypes];
      if (!threatType) return;
      
      const moveTowardShield = () => {
        if (threat.classList.contains('neutralized') || !gameRunning) return;
        
        const rect = simulator.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const currentX = parseFloat(threat.style.left) || parseInt(getComputedStyle(threat).left);
        const currentY = parseFloat(threat.style.top) || parseInt(getComputedStyle(threat).top);
        
        const dx = centerX - (currentX + threat.offsetWidth / 2);
        const dy = centerY - (currentY + threat.offsetHeight / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if threat reached the shield (game over condition)
        if (distance < 50) {
          gameOver();
          return;
        }
        
        // Random movement variation for more realistic behavior
        const randomX = (Math.random() - 0.5) * 0.5;
        const randomY = (Math.random() - 0.5) * 0.5;
        
        const speed = threatType.speed;
        const moveX = (dx / distance) * speed + randomX;
        const moveY = (dy / distance) * speed + randomY;
        
        threat.style.position = 'absolute';
        threat.style.left = `${Math.max(0, Math.min(rect.width - 40, currentX + moveX))}px`;
        threat.style.top = `${Math.max(0, Math.min(rect.height - 40, currentY + moveY))}px`;
        
        requestAnimationFrame(moveTowardShield);
      };
      
      // Random delay before starting movement
      const delay = Math.random() * 1000 + 500;
      setTimeout(() => {
        moveTowardShield();
      }, delay);
    };
    
    // Game over function
    const gameOver = () => {
      gameRunning = false;
      
      // Create game over overlay
      const gameOverOverlay = document.createElement('div');
      gameOverOverlay.className = 'absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
      gameOverOverlay.innerHTML = `
        <div class="text-center">
          <div class="text-4xl mb-4">💥 SYSTEM BREACHED 💥</div>
          <div class="text-2xl text-red-400 mb-2">Defense Overwhelmed</div>
          <div class="text-lg text-white mb-4">Final Score: ${score}</div>
          <div class="text-lg text-white mb-6">Level Reached: ${gameLevel}</div>
          <button class="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition" onclick="this.parentElement.parentElement.remove(); location.reload();">
            Restart Defense System
          </button>
        </div>
      `;
      
      simulator?.appendChild(gameOverOverlay);
    };
    
    // Update UI function
    const updateUI = () => {
      if (threatsNeutralizedEl) {
        const neutralizedSpan = threatsNeutralizedEl.querySelector('span:last-child');
        if (neutralizedSpan) neutralizedSpan.textContent = neutralizedCount.toString();
      }
      
      if (scoreDisplayEl) {
        const scoreSpan = scoreDisplayEl.querySelector('span:last-child');
        if (scoreSpan) scoreSpan.textContent = score.toString();
      }
      
      // Update threats detected count
      const threatsDetectedEl = document.getElementById('threats-detected');
      if (threatsDetectedEl) {
        const detectedSpan = threatsDetectedEl.querySelector('span:last-child');
        if (detectedSpan) detectedSpan.textContent = activeThreats.toString();
      }
      
      // Update level display
      const levelDisplayEl = document.getElementById('level-display');
      if (levelDisplayEl) {
        const levelSpan = levelDisplayEl.querySelector('span:last-child');
        if (levelSpan) levelSpan.textContent = gameLevel.toString();
      }
      
      // Level progression
      if (neutralizedCount > 0 && neutralizedCount % 10 === 0) {
        gameLevel++;
        maxThreats = Math.min(8, 3 + Math.floor(gameLevel / 2));
        threatSpawnRate = Math.max(1000, 3000 - (gameLevel * 200));
      }
    };
    
    // Create threat spawning system
    const spawnThreat = () => {
      if (!gameRunning || activeThreats >= maxThreats) return;
      
      threatCounter++;
      const threatTypeKeys = Object.keys(threatTypes);
      const randomType = threatTypeKeys[Math.floor(Math.random() * threatTypeKeys.length)];
      const threatType = threatTypes[randomType as keyof typeof threatTypes];
      
      const threat = document.createElement('div');
      threat.id = `threat-${threatCounter}`;
      threat.className = 'absolute w-10 h-10 rounded-full flex items-center justify-center cursor-grab hover:cursor-grabbing hover:scale-110 transition-all shadow-lg threat-moving';
      threat.style.backgroundColor = threatType.color;
      threat.style.zIndex = '10';
      threat.dataset.type = randomType;
      threat.dataset.health = threatType.health.toString();
      threat.dataset.maxHealth = threatType.health.toString();
      
      // Random spawn position at edges
      const side = Math.floor(Math.random() * 4);
      const simulatorRect = simulator?.getBoundingClientRect();
      if (!simulatorRect) return;
      
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
      
      simulator?.appendChild(threat);
      activeThreats++;
      
      // Add drag functionality
      addDragFunctionality(threat);
      
      // Start automated movement
      startAutomatedThreat(threat);
      
      updateUI();
    };
    
    // Add drag functionality to threats
    const addDragFunctionality = (threat: HTMLElement) => {
      threat.addEventListener('mousedown', (e) => {
        draggedElement = threat;
        isDragging = true;
        threat.style.cursor = 'grabbing';
        threat.style.zIndex = '1000';
        
        const rect = threat.getBoundingClientRect();
        const simulatorRect = simulator!.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
      });
      
      threat.addEventListener('touchstart', (e) => {
        draggedElement = threat;
        isDragging = true;
        threat.style.cursor = 'grabbing';
        threat.style.zIndex = '1000';
        
        const touch = e.touches[0];
        const rect = threat.getBoundingClientRect();
        dragOffset.x = touch.clientX - rect.left;
        dragOffset.y = touch.clientY - rect.top;
        
        e.preventDefault();
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedElement || !isDragging || !simulator) return;
      
      const rect = simulator.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      // Keep within bounds
      const maxX = rect.width - draggedElement.offsetWidth;
      const maxY = rect.height - draggedElement.offsetHeight;
      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));
      
      draggedElement.style.left = `${boundedX}px`;
      draggedElement.style.top = `${boundedY}px`;
      draggedElement.style.position = 'absolute';
      
      // Check if near shield (center of simulator)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const threatCenterX = boundedX + draggedElement.offsetWidth / 2;
      const threatCenterY = boundedY + draggedElement.offsetHeight / 2;
      const distance = Math.sqrt((threatCenterX - centerX) ** 2 + (threatCenterY - centerY) ** 2);
      
      if (distance < 60) { // Within neutralization zone
        neutralizeThreat(draggedElement);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!draggedElement || !isDragging || !simulator) return;
      
      const touch = e.touches[0];
      const rect = simulator.getBoundingClientRect();
      const x = touch.clientX - rect.left - dragOffset.x;
      const y = touch.clientY - rect.top - dragOffset.y;
      
      // Keep within bounds
      const maxX = rect.width - draggedElement.offsetWidth;
      const maxY = rect.height - draggedElement.offsetHeight;
      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));
      
      draggedElement.style.left = `${boundedX}px`;
      draggedElement.style.top = `${boundedY}px`;
      draggedElement.style.position = 'absolute';
      
      // Check neutralization
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const threatCenterX = boundedX + draggedElement.offsetWidth / 2;
      const threatCenterY = boundedY + draggedElement.offsetHeight / 2;
      const distance = Math.sqrt((threatCenterX - centerX) ** 2 + (threatCenterY - centerY) ** 2);
      
      if (distance < 60) {
        neutralizeThreat(draggedElement);
      }
      
      e.preventDefault();
    };
    
    const handleMouseUp = () => {
      if (draggedElement) {
        draggedElement.style.cursor = 'grab';
        draggedElement.style.zIndex = 'auto';
        draggedElement = null;
        isDragging = false;
      }
    };
    
    const handleTouchEnd = () => {
      if (draggedElement) {
        draggedElement.style.cursor = 'grab';
        draggedElement.style.zIndex = 'auto';
        draggedElement = null;
        isDragging = false;
      }
    };
    
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Initialize game
    const initializeGame = () => {
      // Clear any existing threats
      const existingThreats = simulator?.querySelectorAll('[id^="threat-"]');
      existingThreats?.forEach(threat => threat.remove());
      
      // Reset game state
      activeThreats = 0;
      neutralizedCount = 0;
      score = 0;
      gameLevel = 1;
      maxThreats = 3;
      threatSpawnRate = 3000;
      gameRunning = true;
      threatCounter = 0;
      
      updateUI();
      
      // Start spawning threats
      const spawnInterval = setInterval(() => {
        if (gameRunning) {
          spawnThreat();
        } else {
          clearInterval(spawnInterval);
        }
      }, threatSpawnRate);
      
      // Spawn initial threats
      setTimeout(() => spawnThreat(), 1000);
      setTimeout(() => spawnThreat(), 2000);
      setTimeout(() => spawnThreat(), 3000);
    };
    
    // Countermeasure selection
    const setupCountermeasureSelection = () => {
      const kineticBtn = document.getElementById('kinetic-btn');
      const electronicBtn = document.getElementById('electronic-btn');
      const laserBtn = document.getElementById('laser-btn');
      
      const updateButtonStyles = () => {
        [kineticBtn, electronicBtn, laserBtn].forEach(btn => {
          btn?.classList.remove('bg-[#00ff88]', 'bg-[#0088ff]', 'bg-[#ff0088]');
          btn?.classList.add('bg-[rgba(0,0,0,0.3)]');
        });
        
        const activeBtn = selectedCountermeasure === 'kinetic' ? kineticBtn :
                         selectedCountermeasure === 'electronic' ? electronicBtn : laserBtn;
        const activeColor = selectedCountermeasure === 'kinetic' ? 'bg-[#00ff88]' :
                           selectedCountermeasure === 'electronic' ? 'bg-[#0088ff]' : 'bg-[#ff0088]';
        
        activeBtn?.classList.remove('bg-[rgba(0,0,0,0.3)]');
        activeBtn?.classList.add(activeColor, 'text-black');
      };
      
      kineticBtn?.addEventListener('click', () => {
        selectedCountermeasure = 'kinetic';
        updateButtonStyles();
      });
      
      electronicBtn?.addEventListener('click', () => {
        selectedCountermeasure = 'electronic';
        updateButtonStyles();
      });
      
      laserBtn?.addEventListener('click', () => {
        selectedCountermeasure = 'laser';
        updateButtonStyles();
      });
      
      updateButtonStyles();
    };
    
    // Start the game
    initializeGame();
    setupCountermeasureSelection();
    
    // Sticky header CTA
    const stickyHeader = document.createElement('div');
    stickyHeader.className = 'fixed top-0 left-0 right-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur border-b border-[rgba(0,255,136,0.2)] transform -translate-y-full transition-transform duration-300';
    stickyHeader.innerHTML = `
      <div class="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div class="text-sm text-[var(--gray)]">
          <span class="text-[var(--primary)] font-semibold">Phoenix Rooivalk</span> - Counter-UAS Defense System
        </div>
        <a href="#contact" class="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded font-bold text-sm hover:-translate-y-0.5 transition">
          Schedule Demo
        </a>
      </div>
    `;
    document.body.appendChild(stickyHeader);
    
    const showStickyHeader = () => {
      if (window.scrollY > 600) {
        stickyHeader.style.transform = 'translateY(0)';
      } else {
        stickyHeader.style.transform = 'translateY(-100%)';
      }
    };
    
    window.addEventListener('scroll', showStickyHeader);

    // Exit-intent popup
    let exitIntentShown = false;
    const exitIntentPopup = document.createElement('div');
    exitIntentPopup.className = 'fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300';
    exitIntentPopup.innerHTML = `
      <div class="bg-[var(--darker)] border border-[rgba(0,255,136,0.3)] rounded-xl p-8 max-w-md mx-4 transform scale-95 transition-transform duration-300">
        <button class="absolute top-4 right-4 text-[var(--gray)] hover:text-white text-xl" onclick="this.parentElement.parentElement.style.opacity='0'; this.parentElement.parentElement.style.pointerEvents='none';">&times;</button>
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📋</span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-[var(--primary)]">Wait! Get Our Technical Whitepaper</h3>
          <p class="text-[var(--gray)] mb-6 text-sm">Download comprehensive technical specifications, financial projections, and deployment guides before you go.</p>
          <div class="space-y-3">
            <a href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20Whitepaper%20Request" 
               class="block bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition">
              Download Whitepaper
            </a>
            <button onclick="this.parentElement.parentElement.parentElement.parentElement.style.opacity='0'; this.parentElement.parentElement.parentElement.parentElement.style.pointerEvents='none';" 
                    class="block w-full text-[var(--gray)] hover:text-white text-sm">
              No thanks, continue browsing
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(exitIntentPopup);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        exitIntentPopup.style.opacity = '1';
        exitIntentPopup.style.pointerEvents = 'auto';
        exitIntentPopup.querySelector('div > div')?.classList.remove('scale-95');
        exitIntentPopup.querySelector('div > div')?.classList.add('scale-100');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // Chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'fixed bottom-6 right-6 z-50';
    chatWidget.innerHTML = `
      <div class="relative">
        <button id="chat-toggle" class="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <span class="text-2xl">💬</span>
        </button>
        <div id="chat-popup" class="absolute bottom-16 right-0 w-80 bg-[var(--darker)] border border-[rgba(0,255,136,0.3)] rounded-xl shadow-xl opacity-0 pointer-events-none transition-all duration-300 transform scale-95">
          <div class="p-4 border-b border-[rgba(0,255,136,0.2)]">
            <h4 class="font-semibold text-[var(--primary)]">Quick Questions?</h4>
            <p class="text-xs text-[var(--gray)]">Get instant answers about Phoenix Rooivalk</p>
          </div>
          <div class="p-4 space-y-3">
            <button class="w-full text-left p-3 rounded bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] transition text-sm">
              📋 Request technical specifications
            </button>
            <button class="w-full text-left p-3 rounded bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] transition text-sm">
              💰 View pricing and ROI details
            </button>
            <button class="w-full text-left p-3 rounded bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] transition text-sm">
              🎯 Schedule live demonstration
            </button>
            <button class="w-full text-left p-3 rounded bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] transition text-sm">
              🤝 Partnership opportunities
            </button>
          </div>
          <div class="p-4 border-t border-[rgba(0,255,136,0.2)]">
            <a href="mailto:smit.jurie@gmail.com" class="block text-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded font-bold text-sm hover:-translate-y-0.5 transition">
              Contact Directly
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(chatWidget);

    const chatToggle = document.getElementById('chat-toggle');
    const chatPopup = document.getElementById('chat-popup');
    let chatOpen = false;

    chatToggle?.addEventListener('click', () => {
      chatOpen = !chatOpen;
      if (chatOpen) {
        chatPopup!.style.opacity = '1';
        chatPopup!.style.pointerEvents = 'auto';
        chatPopup!.classList.remove('scale-95');
        chatPopup!.classList.add('scale-100');
      } else {
        chatPopup!.style.opacity = '0';
        chatPopup!.style.pointerEvents = 'none';
        chatPopup!.classList.remove('scale-100');
        chatPopup!.classList.add('scale-95');
      }
    });

    // Chat quick actions
    chatPopup?.querySelectorAll('button').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const subjects = [
          'Technical Specifications Request',
          'Pricing and ROI Information',
          'Live Demonstration Request', 
          'Partnership Inquiry'
        ];
        window.location.href = `mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20${subjects[index]}`;
      });
    });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', showStickyHeader);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (stickyHeader.parentNode) {
        stickyHeader.parentNode.removeChild(stickyHeader);
      }
      if (exitIntentPopup.parentNode) {
        exitIntentPopup.parentNode.removeChild(exitIntentPopup);
      }
      if (chatWidget.parentNode) {
        chatWidget.parentNode.removeChild(chatWidget);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Add font preloading via useEffect instead
  useEffect(() => {
    // Add font preloading links
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/fonts/inter-var.woff2';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);

    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    return () => {
      // Cleanup on unmount
      if (preloadLink.parentNode) preloadLink.parentNode.removeChild(preloadLink);
      if (preconnect1.parentNode) preconnect1.parentNode.removeChild(preconnect1);
      if (preconnect2.parentNode) preconnect2.parentNode.removeChild(preconnect2);
    };
  }, []);

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
        </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Phoenix Rooivalk</Link>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li><Link href="/technical" className="hover:text-[var(--primary)]">Technical</Link></li>
            <li><Link href="/financial" className="hover:text-[var(--primary)]">Financial</Link></li>
            <li><Link href="/compliance" className="hover:text-[var(--primary)]">Compliance</Link></li>
            <li><a href="#contact" className="hover:text-[var(--primary)]">Contact</a></li>
          </ul>
          <a href="#contact" className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 py-2 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">Request Demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center px-[5%] py-12 relative" id="hero">
        <div className="mx-auto max-w-[1400px] grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-3 py-1 rounded-full text-sm font-bold">Real-Time Defense on Solana</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
              Drone Detection System - Counter-UAS Defense
            </h1>
            <p className="mt-4 text-lg text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
              Sub-second threat verification at $0.00025 per transaction. Modular design with 20-30% cost advantage over competitors.
            </p>
            <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>Multi-sensor detection with AI classification</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>Blockchain evidence logging on Solana + EtherLink</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>ITAR compliant with ISO 27001 certification</span>
              </div>
            </div>
            <div className="mt-8 flex gap-4 animate-fadeInUp [animation-delay:600ms]">
              <a href="#contact" className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">
                Schedule Technical Demo
              </a>
              <Link href="/financial" className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
                View Projections
              </Link>
            </div>
          </div>
          <div className="relative animate-float">
            <div id="threat-simulator" className="h-[500px] w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))] flex items-center justify-center overflow-hidden relative border border-[rgba(0,255,136,0.3)]">
              {/* Countermeasure Selection */}
              <div className="absolute top-4 left-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 border border-[rgba(0,255,136,0.3)]">
                <div className="text-xs text-[var(--primary)] font-bold mb-2">Select Countermeasure:</div>
                <div className="flex gap-2">
                  <button id="kinetic-btn" className="px-2 py-1 text-xs rounded bg-[#00ff88] text-black font-bold hover:scale-105 transition">
                    Kinetic
                  </button>
                  <button id="electronic-btn" className="px-2 py-1 text-xs rounded bg-[rgba(0,136,255,0.3)] text-[#0088ff] border border-[#0088ff] hover:bg-[#0088ff] hover:text-black hover:scale-105 transition">
                    EW
                  </button>
                  <button id="laser-btn" className="px-2 py-1 text-xs rounded bg-[rgba(255,0,136,0.3)] text-[#ff0088] border border-[#ff0088] hover:bg-[#ff0088] hover:text-black hover:scale-105 transition">
                    Laser
                  </button>
                </div>
              </div>
              
              {/* Game Instructions */}
              <div className="absolute top-4 right-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 text-xs text-[var(--gray)] max-w-48">
                <div className="text-[var(--primary)] font-bold mb-1">Mission:</div>
                <div>Drag threats to shield or let countermeasures auto-engage. Match countermeasure to threat type for maximum effectiveness!</div>
              </div>
              
              {/* Enhanced 3D-style drone interception visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Radar sweep */}
                <div className="absolute h-80 w-80 rounded-full border-2 border-[var(--primary)] opacity-20">
                  <div className="absolute top-1/2 left-1/2 h-0.5 w-full origin-left bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-radar" />
                </div>
                {/* Detection zones with labels */}
                <div className="absolute h-60 w-60 rounded-full border border-[var(--primary)] opacity-30">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-[var(--primary)]">Detection Zone</div>
                </div>
                <div className="absolute h-40 w-40 rounded-full border border-[var(--primary)] opacity-40">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-[var(--primary)]">Neutralization Zone</div>
                </div>
                
                {/* Central shield - much larger and prominent */}
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <div className="text-4xl">🛡️</div>
                </div>
              </div>
              
              {/* Enhanced status display */}
              <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-4 text-sm border border-[rgba(0,255,136,0.3)]">
                <div className="text-[var(--primary)] font-bold mb-2 flex items-center">
                  <span className="text-lg mr-2">🎯</span>
                  Defense System
                </div>
                <div id="threats-detected" className="text-white mb-1 flex justify-between">
                  <span>Threats Active:</span>
                  <span className="text-red-400 font-bold">0</span>
                </div>
                <div id="threats-neutralized" className="text-green-400 mb-1 flex justify-between">
                  <span>Neutralized:</span>
                  <span className="font-bold">0</span>
                </div>
                <div id="score-display" className="text-yellow-400 mb-1 flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold">0</span>
                </div>
                <div id="level-display" className="text-blue-400 flex justify-between border-t border-[rgba(0,255,136,0.2)] pt-2 mt-2">
                  <span>Level:</span>
                  <span className="font-bold">1</span>
                </div>
              </div>
              
              {/* Countermeasure effectiveness legend */}
              <div className="absolute bottom-4 left-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 text-xs border border-[rgba(0,255,136,0.3)]">
                <div className="text-[var(--primary)] font-bold mb-2">Threat Types:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🚁</span><span className="text-red-400">Drone</span><span className="text-[#00ff88]">(Kinetic)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📡</span><span className="text-orange-400">Radar</span><span className="text-[#0088ff]">(EW)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛸</span><span className="text-yellow-400">Stealth</span><span className="text-[#ff0088]">(Laser)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]" id="metrics">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Proven Performance</h2>
            <p className="text-[var(--gray)] mt-2">Data-driven results from documented projections</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              ['$47K', 'Unit Price', 'Complete system cost'],
              ['Year 3', 'Break-Even', '50 units sold'],
              ['$9.4M', 'Year 5 Revenue', 'Projected growth'],
              ['20-30%', 'Cost Advantage', 'vs competitors'],
            ].map(([value, label, description]) => (
              <div key={label} className="text-center rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 hover:shadow-glow transition">
                <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] mb-2">{value}</div>
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-[var(--gray)] text-sm">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="px-[5%] py-16" id="capabilities">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Multi-Layered Defense</h2>
            <p className="text-[var(--gray)] mt-2">Comprehensive threat detection and neutralization</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: '📡',
                title: 'Detection',
                description: 'RF, radar, optical, acoustic, and infrared sensors with AI-powered threat classification',
                features: ['Multi-sensor fusion', 'AI classification', 'Behavioral analysis']
              },
              {
                icon: '⚡',
                title: 'Neutralization',
                description: 'RF jamming, GPS spoofing, and physical countermeasures for comprehensive threat response',
                features: ['Electronic warfare', 'Net entanglement', 'Kinetic interceptors']
              },
              {
                icon: '🔗',
                title: 'Evidence',
                description: 'Blockchain-anchored audit trails on Solana and EtherLink for military-grade integrity',
                features: ['Immutable logging', 'Multi-chain anchoring', 'Compliance ready']
              }
            ].map((capability) => (
              <div key={capability.title} className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8 hover:-translate-y-1 transition">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl mb-6">{capability.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                <p className="text-[var(--gray)] mb-4">{capability.description}</p>
                <ul className="space-y-2">
                  {capability.features.map((feature) => (
                    <li key={feature} className="text-sm text-[var(--gray)] flex items-center">
                      <span className="text-[var(--primary)] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Link href="/technical" className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
              Technical Specifications
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-[5%] py-16 text-center bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))]" id="contact">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">Ready to Deploy?</h2>
            <p className="text-[var(--gray)] mt-3 max-w-2xl mx-auto">
              Join defense organizations worldwide deploying blockchain-secured counter-UAS systems
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20Technical%20Demo" 
                 className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">
                Schedule Technical Demo
              </a>
              <Link href="/financial" 
                    className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
                Financial Projections
              </Link>
            </div>
            <div className="mt-8 text-sm text-[var(--gray)]">
              <p><strong>Contact:</strong> Jurie Smit | PhoenixVC | smit.jurie@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>© 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified</p>
          <div className="mt-4">
            <Link href="/technical" className="text-[var(--primary)] hover:underline mr-6">Technical</Link>
            <Link href="/financial" className="text-[var(--primary)] hover:underline mr-6">Financial</Link>
            <Link href="/compliance" className="text-[var(--primary)] hover:underline">Compliance</Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Phoenix Rooivalk drone detection system?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk is a counter-UAS defense system that provides real-time drone detection and neutralization with blockchain evidence logging on Solana and EtherLink networks. It offers sub-second threat verification at $0.00025 per transaction."
                }
              },
              {
                "@type": "Question", 
                "name": "How much does the Phoenix Rooivalk system cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The complete Phoenix Rooivalk counter-UAS system is priced at $47,000 per unit, offering a 20-30% cost advantage over competitors with projected break-even by Year 3."
                }
              },
              {
                "@type": "Question",
                "name": "What blockchain networks does Phoenix Rooivalk use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk uses dual blockchain anchoring across Solana and EtherLink networks for secure evidence logging and transaction verification at extremely low costs."
                }
              },
              {
                "@type": "Question",
                "name": "Is Phoenix Rooivalk compliant with defense regulations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Phoenix Rooivalk is ITAR compliant with ISO 27001 certification, meeting international defense and security standards for counter-UAS systems."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
