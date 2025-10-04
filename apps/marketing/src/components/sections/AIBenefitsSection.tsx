import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";

export const AIBenefitsSection: React.FC = () => {
  return (
    <section
      className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,255,136,0.05),rgba(0,136,255,0.05))]"
      id="ai-benefits"
    >
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <div className="inline-block bg-[var(--primary)] text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
            AI + BLOCKCHAIN REVOLUTION
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Revolutionary AI + Blockchain Performance
          </h2>
          <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg">
            PhoenixRooivalk combines cutting-edge AI with military-grade
            blockchain technology to deliver unprecedented performance: 99.7%
            accuracy with 99.3% data integrity protection.
          </p>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              AI + Blockchain Performance
            </h3>
            <div className="space-y-4">
              <MetricCard
                title="AI Detection Accuracy"
                value="99.7%"
                comparison="vs 60-70% industry standard"
              />
              <MetricCard
                title="Data Integrity"
                value="99.3%"
                comparison="vs 85% traditional systems"
              />
              <MetricCard
                title="Response Time"
                value="< 200ms"
                comparison="vs 1-3 seconds industry standard"
              />
              <MetricCard
                title="Authentication Latency"
                value="< 2ms"
                comparison="vs 50-100ms traditional"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              AI + Blockchain Capabilities
            </h3>
            <div className="space-y-4">
              <FeatureCard
                icon="🧠"
                title="Multi-Modal AI Intelligence"
                description="Processes RF, visual, acoustic, and radar data with blockchain-verified results for comprehensive threat analysis"
              />
              <FeatureCard
                icon="🔗"
                title="Blockchain Security"
                description="99.3% data integrity protection with tamper-proof audit trails and cryptographic identity management"
              />
              <FeatureCard
                icon="🔄"
                title="Federated Learning + Blockchain"
                description="Distributed AI model training with blockchain consensus while maintaining data privacy and model provenance"
              />
              <FeatureCard
                icon="🎯"
                title="Explainable AI + Audit Trails"
                description="Transparent AI decision-making with immutable blockchain audit trails for military accountability and regulatory compliance"
              />
              <FeatureCard
                icon="⚡"
                title="Autonomous Swarm Coordination"
                description="AI-powered swarm intelligence with blockchain consensus for coordinated multi-drone operations in contested environments"
              />
            </div>
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-8">
          <div className="bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              18-Month AI + Blockchain Advantage
            </h3>
            <p className="text-[var(--gray)] text-lg mb-6">
              While competitors race to meet the 2027 autonomous warfare
              deadline, PhoenixRooivalk&apos;s integrated AI-blockchain system
              is ready for immediate deployment, providing a decisive
              technological advantage in the critical race for autonomous
              warfare dominance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#contact" size="lg">
                Request AI + Blockchain Demo
              </Button>
              <Button
                href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20AI%20%2B%20Blockchain%20Capabilities%20Inquiry"
                variant="ghost"
                size="lg"
              >
                Technical Brief
              </Button>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  comparison: string;
}> = ({ title, value, comparison }) => (
  <div className="flex items-center justify-between p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
    <div>
      <div className="font-bold text-[var(--primary)]">{title}</div>
      <div className="text-sm text-gray-300">{comparison}</div>
    </div>
    <div className="text-2xl font-bold text-[var(--primary)]">{value}</div>
  </div>
);

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
    <span className="text-blue-400 text-2xl">{icon}</span>
    <div>
      <div className="font-bold text-blue-400">{title}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </div>
  </div>
);
