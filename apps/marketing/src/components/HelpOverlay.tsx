import React from "react";
import styles from "./HelpOverlay.module.css";

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => {
  return (
    <div className={styles.helpOverlay}>
      <h2 className={styles.title}>Keyboard Shortcuts</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Pause/Resume</span>
          <kbd className={styles.keyShortcut}>Space</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Spawn Swarm</span>
          <kbd className={styles.keyShortcut}>S</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>+5 Drones</span>
          <kbd className={styles.keyShortcut}>+</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Reset</span>
          <kbd className={styles.keyShortcut}>R</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Switch Weapon</span>
          <kbd className={styles.keyShortcut}>1/2/3</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Toggle Stats Panel</span>
          <kbd className={styles.keyShortcut}>T</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Clear Selection</span>
          <kbd className={styles.keyShortcut}>Esc</kbd>
        </li>
        <li className={styles.listItem}>
          <span className={styles.keyLabel}>Toggle Help</span>
          <kbd className={styles.keyShortcut}>?</kbd>
        </li>
      </ul>
      <button onClick={onClose} className={`btn ${styles.closeButton}`}>
        Close
      </button>
    </div>
  );
};

export default HelpOverlay;
