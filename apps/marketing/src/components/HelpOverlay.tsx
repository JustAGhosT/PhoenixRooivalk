import React from 'react';
import './HelpOverlay.css';

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => {
  return (
    <div className="help-overlay">
      <h2 className="help-overlay__title">Keyboard Shortcuts</h2>
      <ul className="help-overlay__list">
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Pause/Resume</span>
          <kbd className="help-overlay__key-shortcut">Space</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Spawn Swarm</span>
          <kbd className="help-overlay__key-shortcut">S</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">+5 Drones</span>
          <kbd className="help-overlay__key-shortcut">+</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Reset</span>
          <kbd className="help-overlay__key-shortcut">R</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Set Level</span>
          <kbd className="help-overlay__key-shortcut">1/2/3</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Clear Selection</span>
          <kbd className="help-overlay__key-shortcut">Esc</kbd>
        </li>
        <li className="help-overlay__list-item">
          <span className="help-overlay__key-label">Toggle Help</span>
          <kbd className="help-overlay__key-shortcut">?</kbd>
        </li>
      </ul>
      <button onClick={onClose} className="btn help-overlay__close-button">Close</button>
    </div>
  );
};

export default HelpOverlay;