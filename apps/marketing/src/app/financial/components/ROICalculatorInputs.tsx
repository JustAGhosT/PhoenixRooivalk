import React from "react";
import styles from "../financial.module.css";

interface ROICalculatorInputsProps {
  inputs: {
    threatFrequency: number;
    averageResponseTime: number;
    deploymentCost: number;
    personnelCost: number;
    downtimeCost: number;
  };
  setInputs: React.Dispatch<
    React.SetStateAction<{
      threatFrequency: number;
      averageResponseTime: number;
      deploymentCost: number;
      personnelCost: number;
      downtimeCost: number;
    }>
  >;
}

export function ROICalculatorInputs({
  inputs,
  setInputs,
}: ROICalculatorInputsProps): React.ReactElement {
  return (
    <div className={styles.inputGroup}>
      <div className={styles.calculatorCard}>
        <h2 className={styles.calculatorTitle}>Configure Your Scenario</h2>

        <div className={styles.inputGroup}>
          <div>
            <label htmlFor="threat-frequency" className={styles.label}>
              Threat Frequency (per month)
            </label>
            <input
              id="threat-frequency"
              type="range"
              min="1"
              max="50"
              value={inputs.threatFrequency}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  threatFrequency: parseInt(e.target.value),
                }))
              }
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>1</span>
              <span className={styles.sliderValue}>
                {inputs.threatFrequency} threats/month
              </span>
              <span>50</span>
            </div>
          </div>

          <div>
            <label htmlFor="response-time" className={styles.label}>
              Current Response Time (milliseconds)
            </label>
            <input
              id="response-time"
              type="range"
              min="500"
              max="10000"
              step="100"
              value={inputs.averageResponseTime}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  averageResponseTime: parseInt(e.target.value),
                }))
              }
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>500ms</span>
              <span className={styles.sliderValue}>
                {inputs.averageResponseTime.toLocaleString()}ms
              </span>
              <span>10s</span>
            </div>
          </div>

          <div>
            <label htmlFor="deployment-cost" className={styles.label}>
              System Deployment Cost (USD)
            </label>
            <input
              id="deployment-cost"
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={inputs.deploymentCost}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  deploymentCost: parseInt(e.target.value),
                }))
              }
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>$50K</span>
              <span className={styles.sliderValue}>
                ${inputs.deploymentCost.toLocaleString()}
              </span>
              <span>$2M</span>
            </div>
          </div>

          <div>
            <label htmlFor="personnel-cost" className={styles.label}>
              Annual Personnel Cost (USD)
            </label>
            <input
              id="personnel-cost"
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={inputs.personnelCost}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  personnelCost: parseInt(e.target.value),
                }))
              }
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>$50K</span>
              <span className={styles.sliderValue}>
                ${inputs.personnelCost.toLocaleString()}
              </span>
              <span>$500K</span>
            </div>
          </div>

          <div>
            <label htmlFor="downtime-cost" className={styles.label}>
              Cost Per Successful Attack (USD)
            </label>
            <input
              id="downtime-cost"
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={inputs.downtimeCost}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  downtimeCost: parseInt(e.target.value),
                }))
              }
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>$100K</span>
              <span className={styles.sliderValue}>
                ${inputs.downtimeCost.toLocaleString()}
              </span>
              <span>$10M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
