"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { WasmThreatSimulator } from "../WasmThreatSimulator";
import { Button } from "../ui/button";
import styles from "./InteractiveElementsSection.module.css";

export const InteractiveElementsSection: React.FC = () => {
  const [roiInputs, setRoiInputs] = useState({
    threatFrequency: 5, // threats per month
    averageResponseTime: 3000, // milliseconds
    deploymentCost: 250000, // USD
    personnelCost: 150000, // USD per year
  });

  const [sensitivity, setSensitivity] = useState<
    "conservative" | "median" | "aggressive"
  >("conservative");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateROI = () => {
    const {
      threatFrequency,
      averageResponseTime,
      deploymentCost,
      personnelCost,
    } = roiInputs;

    // Calculate annual threat events
    const annualThreats = threatFrequency * 12;

    // Apply sensitivity multipliers
    const getSensitivityMultipliers = (sensitivity: string) => {
      switch (sensitivity) {
        case "conservative":
          return { phoenix: 0.7, traditional: 0.9, incidentCost: 300000 };
        case "median":
          return { phoenix: 0.85, traditional: 0.75, incidentCost: 500000 };
        case "aggressive":
          return { phoenix: 0.95, traditional: 0.6, incidentCost: 750000 };
        default:
          return { phoenix: 0.7, traditional: 0.9, incidentCost: 300000 };
      }
    };

    const multiplier = getSensitivityMultipliers(sensitivity);

    // Calculate success rates based on response time and sensitivity
    const phoenixSuccessRate =
      (averageResponseTime <= 120 ? 0.95 : 0.85) * multiplier.phoenix;
    const traditionalSuccessRate =
      (averageResponseTime <= 3000 ? 0.65 : 0.45) * multiplier.traditional;

    // Calculate prevented incidents
    const phoenixPrevented = annualThreats * phoenixSuccessRate;
    const traditionalPrevented = annualThreats * traditionalSuccessRate;

    // Estimate cost per incident (varies by sensitivity)
    const avgIncidentCost = multiplier.incidentCost;

    // Calculate savings
    const phoenixSavings = phoenixPrevented * avgIncidentCost;
    const traditionalSavings = traditionalPrevented * avgIncidentCost;

    // Calculate ROI
    const phoenixROI =
      ((phoenixSavings - deploymentCost - personnelCost) /
        (deploymentCost + personnelCost)) *
      100;
    const traditionalROI =
      ((traditionalSavings - deploymentCost * 2 - personnelCost) /
        (deploymentCost * 2 + personnelCost)) *
      100;

    return {
      phoenix: {
        prevented: phoenixPrevented,
        savings: phoenixSavings,
        roi: phoenixROI,
        successRate: phoenixSuccessRate,
      },
      traditional: {
        prevented: traditionalPrevented,
        savings: traditionalSavings,
        roi: traditionalROI,
        successRate: traditionalSuccessRate,
      },
    };
  };

  const roi = calculateROI();

  return (
    <section className={styles.section}>
      {/* Background pattern */}
      <div className={styles.backgroundPattern} />

      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* Section Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Projected ROI Analysis</h2>
            <p className={styles.subtitle}>
              Explore the potential return on investment for Phoenix
              Rooivalk&apos;s target 120ms response time based on current market
              analysis and projected performance.
            </p>
          </div>

          {/* ROI Calculator */}
          <div className={styles.calculatorCard}>
            {/* Hypothetical Disclaimer */}
            <div className={styles.disclaimer}>
              <p className={styles.disclaimerText}>
                ⚠️ HYPOTHETICAL ANALYSIS: All inputs/outputs are assumptions for
                illustrative purposes only. No real-world performance data
                available.
              </p>
            </div>
            <div className={styles.grid}>
              {/* Input Controls */}
              <div className={styles.inputSection}>
                {/* Sensitivity Toggle */}
                <div>
                  <fieldset>
                    <legend className={styles.legend}>
                      Analysis Sensitivity (Default: Conservative)
                    </legend>
                    <div className={styles.buttonGroup}>
                      {(["conservative", "median", "aggressive"] as const).map(
                        (option) => (
                          <button
                            key={option}
                            onClick={() => setSensitivity(option)}
                            className={`btn ${
                              sensitivity === option
                                ? "btn--primary"
                                : "btn--secondary"
                            } text-sm capitalize`}
                            aria-pressed={sensitivity === option}
                          >
                            {option}
                          </button>
                        ),
                      )}
                    </div>
                  </fieldset>
                  <p className={styles.helperText}>
                    Conservative uses lower success rates and incident costs for
                    realistic projections.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="roi-threat-frequency"
                    className={styles.label}
                  >
                    Threat Frequency (per month)
                  </label>
                  <input
                    id="roi-threat-frequency"
                    type="range"
                    min="1"
                    max="20"
                    value={roiInputs.threatFrequency}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        threatFrequency: parseInt(e.target.value),
                      }))
                    }
                    className={styles.rangeInput}
                  />
                  <div className={styles.rangeLabels}>
                    <span className="flex-shrink-0">1</span>
                    <span className={styles.rangeValue}>
                      {roiInputs.threatFrequency} threats/month
                    </span>
                    <span className="flex-shrink-0">20</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="roi-response-time" className={styles.label}>
                    Current Response Time (ms)
                  </label>
                  <input
                    id="roi-response-time"
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={roiInputs.averageResponseTime}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        averageResponseTime: parseInt(e.target.value),
                      }))
                    }
                    className={styles.rangeInput}
                  />
                  <div className={styles.rangeLabels}>
                    <span className="flex-shrink-0">1s</span>
                    <span className={styles.rangeValue}>
                      {roiInputs.averageResponseTime}ms
                    </span>
                    <span className="flex-shrink-0">10s</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="roi-deployment-cost" className={styles.label}>
                    Deployment Cost (USD)
                  </label>
                  <input
                    id="roi-deployment-cost"
                    type="range"
                    min="100000"
                    max="1000000"
                    step="50000"
                    value={roiInputs.deploymentCost}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        deploymentCost: parseInt(e.target.value),
                      }))
                    }
                    className={styles.rangeInput}
                  />
                  <div className={styles.rangeLabels}>
                    <span className="flex-shrink-0">$100K</span>
                    <span className={styles.rangeValue}>
                      $
                      {isClient
                        ? roiInputs.deploymentCost.toLocaleString()
                        : roiInputs.deploymentCost.toString()}
                    </span>
                    <span className="flex-shrink-0">$1M</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className={styles.inputSection}>
                <div className={styles.resultCard}>
                  <h4 className={styles.resultCardTitle}>
                    Phoenix Rooivalk Results
                  </h4>
                  <div className={styles.resultRows}>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>Success Rate:</span>
                      <span className={styles.resultValueSuccess}>
                        {(roi.phoenix.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>
                        Threats Prevented/Year:
                      </span>
                      <span className={styles.resultValueWhite}>
                        {roi.phoenix.prevented.toFixed(1)}
                      </span>
                    </div>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>
                        Annual Savings:
                      </span>
                      <span className={styles.resultValueSuccess}>
                        {isClient
                          ? `$${Math.round(roi.phoenix.savings).toLocaleString()}`
                          : `$${Math.round(roi.phoenix.savings).toString()}`}
                      </span>
                    </div>
                    <div
                      className={`${styles.resultRow} ${styles.resultRowDivider}`}
                    >
                      <span className={styles.resultLabel}>ROI:</span>
                      <span className={styles.resultValueAccent}>
                        {roi.phoenix.roi.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.resultCardSecondary}>
                  <h4 className={styles.resultCardTitleSecondary}>
                    Traditional Systems
                  </h4>
                  <div className={styles.resultRows}>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>Success Rate:</span>
                      <span className={styles.resultValueWarning}>
                        {(roi.traditional.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>
                        Threats Prevented/Year:
                      </span>
                      <span className={styles.resultValueWhite}>
                        {roi.traditional.prevented.toFixed(1)}
                      </span>
                    </div>
                    <div className={styles.resultRow}>
                      <span className={styles.resultLabel}>
                        Annual Savings:
                      </span>
                      <span className={styles.resultValueWarning}>
                        {isClient
                          ? `$${Math.round(roi.traditional.savings).toLocaleString()}`
                          : `$${Math.round(roi.traditional.savings).toString()}`}
                      </span>
                    </div>
                    <div
                      className={`${styles.resultRow} ${styles.resultRowDivider}`}
                    >
                      <span className={styles.resultLabel}>ROI:</span>
                      <span className={styles.resultValueGray}>
                        {roi.traditional.roi.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Teaser */}
          <div className={styles.demoSection}>
            <div className={styles.demoHeader}>
              <h3 className={styles.demoTitle}>
                Experience the System
              </h3>
              <p className={styles.demoSubtitle}>
                Try our interactive defense simulator to see Phoenix Rooivalk
                technology in action. Experience real-time threat detection,
                autonomous response, and tactical coordination.
              </p>
            </div>

            <div className={styles.demoContainer}>
              <div className={styles.demoCard}>
                <WasmThreatSimulator isTeaser={true} />
              </div>

              <div className={styles.demoButtonWrapper}>
                <Button href="/interactive-demo" variant="primary" size="lg">
                  🚀 Try Full Interactive Demo (Rust/WASM)
                </Button>
              </div>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className={styles.performanceSection}>
            <div className={styles.performanceCard}>
              <h3 className={styles.performanceTitle}>
                Performance Comparison
              </h3>

              <div className={styles.performanceGrid}>
                <div className={styles.performanceItem}>
                  <div
                    className={`${styles.performanceValue} ${styles.performanceValueDanger}`}
                  >
                    3-10s
                  </div>
                  <div className={styles.performanceLabel}>
                    Traditional Systems
                  </div>
                  <div
                    className={`${styles.performanceBar} ${styles.performanceBarDanger}`}
                  >
                    <div
                      className={`${styles.performanceFill} ${styles.performanceFillDanger}`}
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <div className={styles.performanceNote}>
                    Network dependent
                  </div>
                </div>

                <div className={styles.performanceItem}>
                  <div
                    className={`${styles.performanceValue} ${styles.performanceValuePrimary}`}
                  >
                    1-3s
                  </div>
                  <div className={styles.performanceLabel}>Current Best</div>
                  <div
                    className={`${styles.performanceBar} ${styles.performanceBarPrimary}`}
                  >
                    <div
                      className={`${styles.performanceFill} ${styles.performanceFillPrimary}`}
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className={styles.performanceNote}>
                    With network dependency
                  </div>
                </div>

                <div className={styles.performanceItem}>
                  <div
                    className={`${styles.performanceValue} ${styles.performanceValueSuccess}`}
                  >
                    120ms
                  </div>
                  <div className={styles.performanceLabel}>
                    Phoenix Rooivalk
                  </div>
                  <div
                    className={`${styles.performanceBar} ${styles.performanceBarSuccess}`}
                  >
                    <div
                      className={`${styles.performanceFill} ${styles.performanceFillSuccess}`}
                      style={{ width: "4%" }}
                    ></div>
                  </div>
                  <div className={styles.performanceNote}>
                    Autonomous edge processing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concept Adaptation Calculator */}
          <div className={styles.adaptationSection}>
            <h3 className={styles.adaptationTitle}>
              Concept Adaptation Explorer
            </h3>
            <p className={styles.adaptationSubtitle}>
              Explore how Phoenix Rooivalk&apos;s core technology could adapt to
              different operational environments and threat scenarios.
            </p>

            <div className={styles.adaptationGrid}>
              {/* Civilian Applications */}
              <div className={styles.adaptationCard}>
                <div className={styles.adaptationCardHeader}>
                  <div className={styles.adaptationCardIcon}>🏢</div>
                  <h4 className={styles.adaptationCardTitle}>
                    Civilian Applications
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Airport Security
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Perimeter protection, runway monitoring
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Critical Infrastructure
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Power plants, water facilities, communication towers
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Event Security
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Stadiums, concerts, public gatherings
                    </div>
                  </div>
                </div>
              </div>

              {/* Commercial Security */}
              <div className={styles.adaptationCard}>
                <div className={styles.adaptationCardHeader}>
                  <div className={styles.adaptationCardIcon}>🏭</div>
                  <h4 className={styles.adaptationCardTitle}>
                    Commercial Security
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Corporate Campus
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Headquarters, R&D facilities
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Data Center Security
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Server farms, cloud infrastructure
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Port Security
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Shipping terminals, cargo facilities
                    </div>
                  </div>
                </div>
              </div>

              {/* Research & Development */}
              <div className={styles.adaptationCard}>
                <div className={styles.adaptationCardHeader}>
                  <div className={styles.adaptationCardIcon}>🔬</div>
                  <h4 className={styles.adaptationCardTitle}>
                    Research & Development
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      University Partnerships
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Academic research collaboration
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Government Labs
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      DARPA, NSF, national laboratories
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      International Cooperation
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      NATO, allied defense research
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Licensing */}
              <div className={styles.adaptationCard}>
                <div className={styles.adaptationCardHeader}>
                  <div className={styles.adaptationCardIcon}>⚡</div>
                  <h4 className={styles.adaptationCardTitle}>
                    Technology Licensing
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Sensor Fusion
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Core detection algorithms
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Edge Processing
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Autonomous decision-making
                    </div>
                  </div>
                  <div className={styles.adaptationItem}>
                    <div className={styles.adaptationItemTitle}>
                      Blockchain Integration
                    </div>
                    <div className={styles.adaptationItemDescription}>
                      Evidence management systems
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.adaptationWarning}>
              <p className={styles.adaptationWarningText}>
                💡 These are potential applications under exploration. Actual
                deployment would require regulatory approval, market validation,
                and technology adaptation for specific use cases.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>
              Interested in the Technology?
            </h3>
            <p className={styles.ctaSubtitle}>
              Learn more about Phoenix Rooivalk&apos;s innovative approach to
              autonomous counter-drone defense and explore partnership
              opportunities.
            </p>
            <div className={styles.ctaButtons}>
              <Button href="/contact" size="lg" variant="primary">
                Join Development Program
              </Button>
              <Button href="/technical" variant="secondary" size="lg">
                View Technical Concept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
