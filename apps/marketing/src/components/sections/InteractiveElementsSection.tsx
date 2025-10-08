"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { WasmThreatSimulator } from "../WasmThreatSimulator";
import { Button } from "../ui/button";

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
    <section className="px-6 md:px-[5%] lg:px-8 py-20 bg-gradient-to-br from-[rgb(var(--bg-primary))] to-[rgb(var(--darker))] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Projected ROI Analysis
            </h2>
            <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto leading-relaxed">
              Explore the potential return on investment for Phoenix
              Rooivalk&apos;s target 120ms response time based on current market
              analysis and projected performance.
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="bg-[rgba(15,23,42,0.9)] backdrop-blur-sm border border-[rgba(var(--primary),0.3)] rounded-2xl p-10 shadow-2xl">
            {/* Hypothetical Disclaimer */}
            <div className="mb-6 p-4 bg-[rgba(var(--status-warning),0.1)] border border-[rgba(var(--status-warning),0.3)] rounded-lg">
              <p className="text-sm text-[rgb(var(--status-warning))] text-center font-semibold">
                ⚠️ HYPOTHETICAL ANALYSIS: All inputs/outputs are assumptions for
                illustrative purposes only. No real-world performance data
                available.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Controls */}
              <div className="space-y-6">
                {/* Sensitivity Toggle */}
                <div>
                  <fieldset>
                    <legend className="block text-[var(--text-primary)] font-semibold mb-3">
                      Analysis Sensitivity (Default: Conservative)
                    </legend>
                    <div className="flex gap-2">
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
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    Conservative uses lower success rates and incident costs for
                    realistic projections.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="roi-threat-frequency"
                    className="block text-[rgb(var(--text-primary))] font-semibold mb-2"
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
                    className="range w-full"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span className="flex-shrink-0">1</span>
                    <span className="text-[rgb(var(--accent))] font-bold flex-shrink-0 px-2">
                      {roiInputs.threatFrequency} threats/month
                    </span>
                    <span className="flex-shrink-0">20</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="roi-response-time"
                    className="block text-[rgb(var(--text-primary))] font-semibold mb-2"
                  >
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
                    className="range w-full"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span className="flex-shrink-0">1s</span>
                    <span className="text-[rgb(var(--accent))] font-bold flex-shrink-0 px-2">
                      {roiInputs.averageResponseTime}ms
                    </span>
                    <span className="flex-shrink-0">10s</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="roi-deployment-cost"
                    className="block text-[rgb(var(--text-primary))] font-semibold mb-2"
                  >
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
                    className="range w-full"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span className="flex-shrink-0">$100K</span>
                    <span className="text-[rgb(var(--accent))] font-bold flex-shrink-0 px-2">
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
              <div className="space-y-6">
                <div className="bg-[rgba(15,23,42,0.8)] rounded-xl p-8 border border-[rgba(var(--primary),0.4)] shadow-lg">
                  <h4 className="text-xl font-bold text-[rgb(var(--primary))] mb-6">
                    Phoenix Rooivalk Results
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Success Rate:
                      </span>
                      <span className="text-[rgb(var(--status-active))] font-bold">
                        {(roi.phoenix.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Threats Prevented/Year:
                      </span>
                      <span className="text-[rgb(var(--phoenix-white))] font-bold">
                        {roi.phoenix.prevented.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Annual Savings:
                      </span>
                      <span className="text-[rgb(var(--status-active))] font-bold">
                        {isClient
                          ? `$${Math.round(roi.phoenix.savings).toLocaleString()}`
                          : `$${Math.round(roi.phoenix.savings).toString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(var(--primary),0.2)] pt-3">
                      <span className="text-[rgb(var(--gray))]">ROI:</span>
                      <span className="text-[rgb(var(--accent))] font-bold text-xl">
                        {roi.phoenix.roi.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[rgba(15,23,42,0.8)] rounded-xl p-8 border border-[rgba(var(--border),0.3)] shadow-lg">
                  <h4 className="text-xl font-bold text-[rgb(var(--gray))] mb-6">
                    Traditional Systems
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Success Rate:
                      </span>
                      <span className="text-[rgb(var(--action-warning))] font-bold">
                        {(roi.traditional.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Threats Prevented/Year:
                      </span>
                      <span className="text-[rgb(var(--phoenix-white))] font-bold">
                        {roi.traditional.prevented.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Annual Savings:
                      </span>
                      <span className="text-[rgb(var(--action-warning))] font-bold">
                        {isClient
                          ? `$${Math.round(roi.traditional.savings).toLocaleString()}`
                          : `$${Math.round(roi.traditional.savings).toString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(var(--primary),0.2)] pt-3">
                      <span className="text-[rgb(var(--gray))]">ROI:</span>
                      <span className="text-[rgb(var(--gray))] font-bold text-xl">
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
                  <h4 className="text-lg font-bold text-[var(--action-primary)] mb-2">
                    Civilian Applications
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Airport Security
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Perimeter protection, runway monitoring
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Critical Infrastructure
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Power plants, water facilities, communication towers
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Event Security
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Stadiums, concerts, public gatherings
                    </div>
                  </div>
                </div>
              </div>

              {/* Commercial Security */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🏭</div>
                  <h4 className="text-lg font-bold text-[var(--action-primary)] mb-2">
                    Commercial Security
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Corporate Campus
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Headquarters, R&D facilities
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Data Center Security
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Server farms, cloud infrastructure
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Port Security
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Shipping terminals, cargo facilities
                    </div>
                  </div>
                </div>
              </div>

              {/* Research & Development */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🔬</div>
                  <h4 className="text-lg font-bold text-[var(--action-primary)] mb-2">
                    Research & Development
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      University Partnerships
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Academic research collaboration
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Government Labs
                    </div>
                    <div className="text-[var(--text-muted)]">
                      DARPA, NSF, national laboratories
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      International Cooperation
                    </div>
                    <div className="text-[var(--text-muted)]">
                      NATO, allied defense research
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Licensing */}
              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="text-lg font-bold text-[var(--action-primary)] mb-2">
                    Technology Licensing
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Sensor Fusion
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Core detection algorithms
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Edge Processing
                    </div>
                    <div className="text-[var(--text-muted)]">
                      Autonomous decision-making
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                      Blockchain Integration
                    </div>
                    <div className="text-[var(--text-muted)]">
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
