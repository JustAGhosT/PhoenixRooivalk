"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

export const InteractiveElementsSection: React.FC = () => {
  const [roiInputs, setRoiInputs] = useState({
    threatFrequency: 5, // threats per month
    averageResponseTime: 3000, // milliseconds
    deploymentCost: 250000, // USD
    personnelCost: 150000, // USD per year
  });

  const [sensitivity, setSensitivity] = useState<'conservative' | 'median' | 'aggressive'>('conservative');

  const calculateROI = () => {
    const {
      threatFrequency,
      averageResponseTime,
      deploymentCost,
      personnelCost,
    } = roiInputs;

    // Calculate annual threat events
    const annualThreats = threatFrequency * 12;

    // Calculate success rates based on response time
    const phoenixSuccessRate = averageResponseTime <= 120 ? 0.95 : 0.85;
    const traditionalSuccessRate = averageResponseTime <= 3000 ? 0.65 : 0.45;

    // Calculate prevented incidents
    const phoenixPrevented = annualThreats * phoenixSuccessRate;
    const traditionalPrevented = annualThreats * traditionalSuccessRate;

    // Estimate cost per incident (varies by severity)
    const avgIncidentCost = 500000; // USD

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
    <section className="py-20 bg-gradient-to-br from-[rgb(var(--tactical-obsidian))] to-[rgb(var(--tactical-black))] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 px-6 md:px-[5%] lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--phoenix-white))] to-[rgb(var(--primary))] mb-6">
              Projected ROI Analysis
            </h2>
            <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
              Explore the potential return on investment for Phoenix Rooivalk's
              target 120ms response time based on current market analysis and
              projected performance.
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
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
                <div>
                  <label
                    htmlFor="roi-threat-frequency"
                    className="block text-[rgb(var(--phoenix-white))] font-semibold mb-2"
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
                    className="w-full h-2 bg-[rgb(var(--tactical-gray))] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span>1</span>
                    <span className="text-[rgb(var(--accent))] font-bold">
                      {roiInputs.threatFrequency} threats/month
                    </span>
                    <span>20</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="roi-response-time"
                    className="block text-[rgb(var(--phoenix-white))] font-semibold mb-2"
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
                    className="w-full h-2 bg-[rgb(var(--tactical-gray))] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span>1s</span>
                    <span className="text-[rgb(var(--accent))] font-bold">
                      {roiInputs.averageResponseTime}ms
                    </span>
                    <span>10s</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="roi-deployment-cost"
                    className="block text-[rgb(var(--phoenix-white))] font-semibold mb-2"
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
                    className="w-full h-2 bg-[rgb(var(--tactical-gray))] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-[rgb(var(--gray))] text-sm mt-1">
                    <span>$100K</span>
                    <span className="text-[rgb(var(--accent))] font-bold">
                      ${roiInputs.deploymentCost.toLocaleString()}
                    </span>
                    <span>$1M</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-[rgba(var(--tactical-black),0.6)] rounded-xl p-6 border border-[rgba(var(--primary),0.3)]">
                  <h4 className="text-lg font-bold text-[rgb(var(--primary))] mb-4">
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
                        ${roi.phoenix.savings.toLocaleString()}
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

                <div className="bg-[rgba(var(--tactical-black),0.6)] rounded-xl p-6 border border-[rgba(var(--tactical-gray),0.3)]">
                  <h4 className="text-lg font-bold text-[rgb(var(--gray))] mb-4">
                    Traditional Systems
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Success Rate:
                      </span>
                      <span className="text-[rgb(var(--status-warning))] font-bold">
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
                      <span className="text-[rgb(var(--status-warning))] font-bold">
                        ${roi.traditional.savings.toLocaleString()}
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

          {/* Key Performance Metrics */}
          <div className="mt-20">
            <div className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-6 text-center">
                Performance Comparison
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--status-critical))] mb-2">
                    3-10s
                  </div>
                  <div className="text-[rgb(var(--gray))] font-semibold mb-2">
                    Traditional Systems
                  </div>
                  <div className="w-full bg-[rgba(var(--status-critical),0.2)] rounded-full h-4 border border-[rgba(var(--status-critical),0.3)]">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--status-critical))] to-[rgb(var(--status-warning))] h-4 rounded-full"
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
                  <div className="text-4xl font-bold text-[rgb(var(--status-active))] mb-2">
                    120ms
                  </div>
                  <div className="text-[rgb(var(--gray))] font-semibold mb-2">
                    Phoenix Rooivalk
                  </div>
                  <div className="w-full bg-[rgba(var(--status-active),0.2)] rounded-full h-4 border border-[rgba(var(--status-active),0.3)]">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--status-active))] to-[rgb(var(--accent))] h-4 rounded-full"
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

          {/* CTA */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold text-[rgb(var(--phoenix-white))] mb-4">
              Interested in the Technology?
            </h3>
            <p className="text-[rgb(var(--gray))] mb-6 max-w-2xl mx-auto">
              Learn more about Phoenix Rooivalk's innovative approach to
              autonomous counter-drone defense and explore partnership
              opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="#contact"
                size="lg"
                className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--primary))] shadow-xl"
              >
                Join Development Program
              </Button>
              <Button
                href="/technical"
                variant="outline"
                size="lg"
                className="border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.1)]"
              >
                View Technical Concept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
