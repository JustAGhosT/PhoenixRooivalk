import * as React from "react";
import { RevealSection } from "../RevealSection";

export const TechnicalIntegrationsSection: React.FC = () => {
  const coreIntegrations = [
    {
      name: "Solana Blockchain",
      description: "Immutable evidence trails and legal compliance",
      icon: "⛓️",
      features: [
        "400ms transaction confirmation",
        "Tamper-proof evidence storage",
        "Legal compliance records",
        "Audit trail transparency",
      ],
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-900/20 to-violet-900/20",
      borderColor: "border-purple-500/30",
      status: "Live",
      tier: "Core",
    },
    {
      name: "Morpheus AI",
      description: "Enhanced threat analysis when network available",
      icon: "🤖",
      features: [
        "97% classification accuracy",
        "10-30s enhanced analysis",
        "Distributed model inference",
        "Optional cloud enhancement",
      ],
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-500/30",
      status: "Beta",
      tier: "Enhanced",
    },
    {
      name: "Hivemapper Network",
      description: "Anti-spoofing protection and location validation",
      icon: "🗺️",
      features: [
        "Cross-node verification",
        "Economic incentives",
        "Anti-spoofing protection",
        "Network resilience",
      ],
      color: "from-teal-500 to-cyan-600",
      bgColor: "from-teal-900/20 to-cyan-900/20",
      borderColor: "border-teal-500/30",
      status: "Planned",
      tier: "Enhanced",
    },
    {
      name: "Pinax Analytics",
      description: "Historical pattern analysis and compliance reporting",
      icon: "📊",
      features: [
        "99.9% uptime SLA",
        "Complex historical queries",
        "Pattern recognition",
        "Regulatory compliance",
      ],
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-900/20 to-red-900/20",
      borderColor: "border-orange-500/30",
      status: "Planned",
      tier: "Strategic",
    },
  ];

  return (
    <section
      className="px-6 md:px-[5%] lg:px-[5%] py-16 bg-gradient-to-br from-gray-900 to-black"
      id="integrations"
    >
      <div className="max-w-[1400px] mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Core Technical Integrations
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Phoenix Rooivalk operates autonomously at the edge, with optional
              blockchain and AI enhancements when network connectivity is
              available. Core functionality never depends on external services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {coreIntegrations.map((integration, _index) => (
              <div
                key={integration.name}
                className={`p-6 rounded-xl bg-gradient-to-br ${integration.bgColor} border ${integration.borderColor} hover:scale-105 transition-all duration-300 relative`}
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === "Live"
                        ? "bg-green-500/20 text-green-400"
                        : integration.status === "Beta"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {integration.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integration.tier === "Core"
                        ? "bg-blue-500/20 text-blue-400"
                        : integration.tier === "Enhanced"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {integration.tier}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl`}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${integration.color}`}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Architecture Diagram */}
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Three-Tier Defense Architecture
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-xl mx-auto mb-2">
                  ⚡
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Edge Processing
                </h4>
                <p className="text-xs text-gray-400">&lt;50ms response</p>
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full mt-1">
                  Core
                </span>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-xl mx-auto mb-2">
                  🤖
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Morpheus AI
                </h4>
                <p className="text-xs text-gray-400">10-30s analysis</p>
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full mt-1">
                  Enhanced
                </span>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-xl mx-auto mb-2">
                  ⛓️
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Solana Blockchain
                </h4>
                <p className="text-xs text-gray-400">400ms confirmation</p>
                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full mt-1">
                  Core
                </span>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-xl mx-auto mb-2">
                  📊
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Pinax Analytics
                </h4>
                <p className="text-xs text-gray-400">99.9% uptime</p>
                <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full mt-1">
                  Strategic
                </span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="text-sm text-gray-400 mb-4">
                Core functionality operates autonomously, with optional
                enhancements when network connectivity is available
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                <div className="bg-gray-800/50 rounded p-3">
                  <div className="font-semibold text-white mb-1">
                    Core Defense
                  </div>
                  <div>Edge processing, sensor fusion, autonomous response</div>
                </div>
                <div className="bg-gray-800/50 rounded p-3">
                  <div className="font-semibold text-white mb-1">
                    Enhanced Intelligence
                  </div>
                  <div>AI analysis, blockchain evidence, anti-spoofing</div>
                </div>
                <div className="bg-gray-800/50 rounded p-3">
                  <div className="font-semibold text-white mb-1">
                    Strategic Analytics
                  </div>
                  <div>Historical patterns, compliance reporting, insights</div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Core Performance
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Sub-second response times</li>
                <li>• 100% autonomous operation</li>
                <li>• Zero network dependency</li>
                <li>• Military-grade reliability</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                Enhanced Intelligence
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 97% accuracy with AI enhancement</li>
                <li>• Immutable evidence trails</li>
                <li>• Historical pattern analysis</li>
                <li>• Optional network features</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Strategic Value
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Future-proof architecture</li>
                <li>• Scalable intelligence layer</li>
                <li>• Compliance-ready design</li>
                <li>• Investment protection</li>
              </ul>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
