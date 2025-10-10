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
          <div className="mt-24">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white mb-4">
                Experience the System
              </h3>
              <p className="text-xl text-[rgb(var(--gray))] mb-6 max-w-2xl mx-auto leading-relaxed">
                Try our interactive defense simulator to see Phoenix Rooivalk
                technology in action. Experience real-time threat detection,
                autonomous response, and tactical coordination.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[rgba(var(--bg-primary),0.8)] to-[rgba(var(--bg-secondary),0.8)] rounded-xl border border-[rgba(var(--primary),0.3)] p-4">
                <WasmThreatSimulator isTeaser={true} />
              </div>

              <div className="text-center mt-8">
                <Button href="/interactive-demo" variant="primary" size="lg">
                  🚀 Try Full Interactive Demo (Rust/WASM)
                </Button>
              </div>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="mt-24">
            <div className="bg-[rgba(15,23,42,0.9)] backdrop-blur-sm border border-[rgba(var(--primary),0.3)] rounded-2xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-10 text-center">
                Performance Comparison
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--action-danger))] mb-2">
                    3-10s
                  </div>
                  <div className="text-[rgb(var(--gray))] font-semibold mb-2">
                    Traditional Systems
                  </div>
                  <div className="w-full bg-[rgba(var(--action-danger),0.2)] rounded-full h-4 border border-[rgba(var(--action-danger),0.3)]">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--action-danger))] to-[rgb(var(--action-warning))] h-4 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-[rgb(var(--gray))] mt-2">
                    Network dependent
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--primary))] mb-2">
                    1-3s
                  </div>
                  <div className="text-[rgb(var(--gray))] font-semibold mb-2">
                    Current Best
                  </div>
                  <div className="w-full bg-[rgba(var(--primary),0.2)] rounded-full h-4 border border-[rgba(var(--primary),0.3)]">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] h-4 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-[rgb(var(--gray))] mt-2">
                    With network dependency
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--action-success))] mb-2">
                    120ms
                  </div>
                  <div className="text-[rgb(var(--gray))] font-semibold mb-2">
                    Phoenix Rooivalk
                  </div>
                  <div className="w-full bg-[rgba(var(--action-success),0.2)] rounded-full h-4 border border-[rgba(var(--action-success),0.3)]">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--action-success))] to-[rgb(var(--accent))] h-4 rounded-full"
                      style={{ width: "4%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-[rgb(var(--gray))] mt-2">
                    Autonomous edge processing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concept Adaptation Calculator */}
          <div className="mt-24">
            <h3 className="text-4xl font-bold text-white mb-8 text-center">
              Concept Adaptation Explorer
            </h3>
            <p className="text-xl text-[rgb(var(--gray))] mb-12 max-w-3xl mx-auto text-center leading-relaxed">
              Explore how Phoenix Rooivalk&apos;s core technology could adapt to
              different operational environments and threat scenarios.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Civilian Applications */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🏢</div>
                  <h4 className="text-lg font-bold text-[rgb(var(--action-primary))] mb-2">
                    Civilian Applications
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Airport Security
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Perimeter protection, runway monitoring
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Critical Infrastructure
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Power plants, water facilities, communication towers
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Event Security
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Stadiums, concerts, public gatherings
                    </div>
                  </div>
                </div>
              </div>

              {/* Commercial Security */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🏭</div>
                  <h4 className="text-lg font-bold text-[rgb(var(--action-primary))] mb-2">
                    Commercial Security
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Corporate Campus
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Headquarters, R&D facilities
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Data Center Security
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Server farms, cloud infrastructure
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Port Security
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Shipping terminals, cargo facilities
                    </div>
                  </div>
                </div>
              </div>

              {/* Research & Development */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🔬</div>
                  <h4 className="text-lg font-bold text-[rgb(var(--action-primary))] mb-2">
                    Research & Development
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      University Partnerships
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Academic research collaboration
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Government Labs
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      DARPA, NSF, national laboratories
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      International Cooperation
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      NATO, allied defense research
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Licensing */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="text-lg font-bold text-[rgb(var(--action-primary))] mb-2">
                    Technology Licensing
                  </h4>
                </div>
                <div className={styles.resultRows}>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Sensor Fusion
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Core detection algorithms
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Edge Processing
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Autonomous decision-making
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[rgb(var(--text-primary))] mb-1">
                      Blockchain Integration
                    </div>
                    <div className="text-[rgb(var(--text-muted))]">
                      Evidence management systems
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[var(--action-warning)]/10 border border-[var(--action-warning)]/20 rounded-lg">
              <p className="text-sm text-[var(--action-warning)] text-center font-semibold">
                💡 These are potential applications under exploration. Actual
                deployment would require regulatory approval, market validation,
                and technology adaptation for specific use cases.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <h3 className="text-4xl font-bold text-white mb-6">
              Interested in the Technology?
            </h3>
            <p className="text-xl text-[rgb(var(--gray))] mb-10 max-w-2xl mx-auto leading-relaxed">
              Learn more about Phoenix Rooivalk&apos;s innovative approach to
              autonomous counter-drone defense and explore partnership
              opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
