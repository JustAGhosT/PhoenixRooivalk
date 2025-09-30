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

  const responseTimeComparison = {
    traditional: 3000,
    phoenix: 120,
    current: 1500,
  };

  const scenarios = [
    {
      name: "Airport Perimeter",
      threats: 12,
      criticality: "High",
      currentResponse: 2500,
      phoenixResponse: 120,
      impact: "Prevents runway closure, saves $2M per incident",
    },
    {
      name: "Military Base",
      threats: 8,
      criticality: "Critical",
      currentResponse: 5000,
      phoenixResponse: 120,
      impact: "Protects classified operations, prevents intelligence breach",
    },
    {
      name: "Critical Infrastructure",
      threats: 6,
      criticality: "High",
      currentResponse: 4000,
      phoenixResponse: 120,
      impact: "Prevents service disruption, saves $5M per incident",
    },
    {
      name: "Public Event",
      threats: 15,
      criticality: "Medium",
      currentResponse: 2000,
      phoenixResponse: 120,
      impact: "Ensures crowd safety, prevents evacuation costs",
    },
  ];

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
              Interactive Tools & Calculators
            </h2>
            <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
              Explore the impact of Phoenix Rooivalk's 120ms response time on
              your specific threat scenarios and budget.
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="mb-20">
            <div className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-6 text-center">
                ROI Calculator
              </h3>

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
                      min="500"
                      max="10000"
                      step="100"
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
                      <span>500ms</span>
                      <span className="text-[rgb(var(--accent))] font-bold">
                        {roiInputs.averageResponseTime.toLocaleString()}ms
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
                      <div className="flex justify-between border-t border-[rgba(var(--tactical-gray),0.2)] pt-3">
                        <span className="text-[rgb(var(--gray))]">ROI:</span>
                        <span className="text-[rgb(var(--gray))] font-bold text-xl">
                          {roi.traditional.roi.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  href="#contact"
                  size="lg"
                  className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--primary))] shadow-xl"
                >
                  Get Detailed ROI Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Response Time Comparison */}
          <div className="mb-20">
            <div className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
                Response Time Comparison
              </h3>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--status-critical))] mb-2">
                    {responseTimeComparison.traditional}ms
                  </div>
                  <div className="text-[rgb(var(--phoenix-white))] font-semibold mb-2">
                    Traditional Systems
                  </div>
                  <div className="w-full bg-[rgb(var(--tactical-gray))] rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--status-critical))] to-[rgb(var(--status-warning))] h-4 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <div className="text-[rgb(var(--gray))] text-sm">
                    3-10 second response time
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--status-warning))] mb-2">
                    {responseTimeComparison.current}ms
                  </div>
                  <div className="text-[rgb(var(--phoenix-white))] font-semibold mb-2">
                    Current Best Practice
                  </div>
                  <div className="w-full bg-[rgb(var(--tactical-gray))] rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--status-warning))] to-[rgb(var(--accent))] h-4 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                  <div className="text-[rgb(var(--gray))] text-sm">
                    1-2 second response time
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-[rgb(var(--status-active))] mb-2">
                    {responseTimeComparison.phoenix}ms
                  </div>
                  <div className="text-[rgb(var(--phoenix-white))] font-semibold mb-2">
                    Phoenix Rooivalk
                  </div>
                  <div className="w-full bg-[rgb(var(--tactical-gray))] rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-[rgb(var(--status-active))] to-[rgb(var(--accent))] h-4 rounded-full"
                      style={{ width: "4%" }}
                    ></div>
                  </div>
                  <div className="text-[rgb(var(--gray))] text-sm">
                    120ms autonomous response
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[rgba(var(--tactical-black),0.6)] rounded-xl border border-[rgba(var(--primary),0.2)]">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[rgb(var(--accent))] mb-2">
                    {(
                      responseTimeComparison.traditional /
                      responseTimeComparison.phoenix
                    ).toFixed(0)}
                    x Faster
                  </div>
                  <div className="text-[rgb(var(--phoenix-white))] font-semibold mb-2">
                    Phoenix Rooivalk vs Traditional Systems
                  </div>
                  <div className="text-[rgb(var(--gray))] text-sm">
                    In contested environments, this speed difference means the
                    difference between mission success and failure.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Threat Scenarios */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
              Real-World Impact Scenarios
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-xl p-6 hover:border-[rgba(var(--primary),0.4)] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-[rgb(var(--phoenix-white))]">
                      {scenario.name}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        scenario.criticality === "Critical"
                          ? "bg-[rgba(var(--status-critical),0.2)] text-[rgb(var(--status-critical))] border border-[rgba(var(--status-critical),0.3)]"
                          : scenario.criticality === "High"
                            ? "bg-[rgba(var(--status-warning),0.2)] text-[rgb(var(--status-warning))] border border-[rgba(var(--status-warning),0.3)]"
                            : "bg-[rgba(var(--status-active),0.2)] text-[rgb(var(--status-active))] border border-[rgba(var(--status-active),0.3)]"
                      }`}
                    >
                      {scenario.criticality}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Monthly Threats:
                      </span>
                      <span className="text-[rgb(var(--phoenix-white))] font-bold">
                        {scenario.threats}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Current Response:
                      </span>
                      <span className="text-[rgb(var(--status-warning))] font-bold">
                        {scenario.currentResponse}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--gray))]">
                        Phoenix Response:
                      </span>
                      <span className="text-[rgb(var(--status-active))] font-bold">
                        {scenario.phoenixResponse}ms
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[rgba(var(--tactical-black),0.6)] rounded-lg border border-[rgba(var(--primary),0.1)]">
                    <div className="text-[rgb(var(--gray))] text-sm font-semibold mb-1">
                      Impact:
                    </div>
                    <div className="text-[rgb(var(--phoenix-white))] text-sm">
                      {scenario.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
