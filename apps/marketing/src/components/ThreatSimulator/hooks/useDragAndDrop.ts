import { useCallback, useRef } from 'react';
import { countermeasures } from '../types';

export const useDragAndDrop = (
  simulatorRef: React.RefObject<HTMLDivElement>,
  onThreatNeutralized: (threat: HTMLElement, countermeasureType?: string) => void,
  selectedCountermeasure: string,
  canUseCountermeasure: (countermeasure: string) => boolean
) => {
  const draggedElement = useRef<HTMLElement | null>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const addDragFunctionality = useCallback((threat: HTMLElement) => {
    const handleMouseDown = (e: MouseEvent) => {
      draggedElement.current = threat;
      isDragging.current = true;
      threat.style.cursor = 'grabbing';
      threat.style.zIndex = '1000';
      
      const rect = threat.getBoundingClientRect();
      const simulatorRect = simulatorRef.current!.getBoundingClientRect();
      dragOffset.current.x = e.clientX - rect.left;
      dragOffset.current.y = e.clientY - rect.top;
      
      e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      draggedElement.current = threat;
      isDragging.current = true;
      threat.style.cursor = 'grabbing';
      threat.style.zIndex = '1000';
      
      const touch = e.touches[0];
      const rect = threat.getBoundingClientRect();
      dragOffset.current.x = touch.clientX - rect.left;
      dragOffset.current.y = touch.clientY - rect.top;
      
      e.preventDefault();
    };

    threat.addEventListener('mousedown', handleMouseDown);
    threat.addEventListener('touchstart', handleTouchStart);
  }, [simulatorRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedElement.current || !isDragging.current || !simulatorRef.current) return;
    
    const rect = simulatorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;
    
    // Keep within bounds
    const maxX = rect.width - draggedElement.current.offsetWidth;
    const maxY = rect.height - draggedElement.current.offsetHeight;
    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));
    
    draggedElement.current.style.left = `${boundedX}px`;
    draggedElement.current.style.top = `${boundedY}px`;
    draggedElement.current.style.position = 'absolute';
    
    // Check if within countermeasure range
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const threatCenterX = boundedX + draggedElement.current.offsetWidth / 2;
    const threatCenterY = boundedY + draggedElement.current.offsetHeight / 2;
    const distance = Math.sqrt((threatCenterX - centerX) ** 2 + (threatCenterY - centerY) ** 2);
    
    const countermeasure = countermeasures[selectedCountermeasure];
    if (countermeasure && distance <= countermeasure.range && canUseCountermeasure(selectedCountermeasure)) {
      onThreatNeutralized(draggedElement.current, selectedCountermeasure);
    }
  }, [simulatorRef, onThreatNeutralized]);

  const handleMouseUp = useCallback(() => {
    if (draggedElement.current) {
      draggedElement.current.style.cursor = 'grab';
      draggedElement.current.style.zIndex = 'auto';
      draggedElement.current = null;
      isDragging.current = false;
    }
  }, []);

  return {
    addDragFunctionality,
    handleMouseMove,
    handleMouseUp,
    draggedElement: draggedElement.current
  };
};
