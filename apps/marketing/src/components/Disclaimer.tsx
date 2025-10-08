import React from "react";
import styles from "./Disclaimer.module.css";

const Disclaimer: React.FC = () => {
  return (
    <p className={styles.disclaimer}>
      This is a <strong>concept simulation</strong> for visualization only. It
      does not represent real sensor performance, ranges, or decision latency.
    </p>
  );
};

export default Disclaimer;
