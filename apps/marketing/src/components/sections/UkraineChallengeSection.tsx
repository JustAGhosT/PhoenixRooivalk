import React from "react";
import { Button } from "../ui/button";
import { RevealSection } from "@/components/RevealSection";

export const UkraineChallengeSection: React.FC = () => {
  return (
    <section
      className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(255,0,0,0.05),rgba(255,136,0,0.05))]"
      id="ukraine-challenge"
    >
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            URGENT: 18-Month Deadline
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The 2027 Autonomous Warfare Race
          </h2>
          <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg">
            Ukraine faces an existential challenge: outpace Russia in autonomous
            warfare by 2027 or lose their technological advantage. Current AI
            drones fail 30-40% of the time, confusing trees for tanks and
            struggling against electronic warfare.
          </p>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Current Problems
            </h3>
            <div className="space-y-4">
              <ProblemCard
                icon="❌"
                title="False Positives"
                description='"Puddles get mistaken for tanks, trees confuse targeting"'
              />
              <ProblemCard
                icon="📡"
                title="EW Vulnerability"
                description='"Hit rates declining as electronic warfare evolves faster"'
              />
              <ProblemCard
                icon="🐝"
                title="Swarm Coordination"
                description="Russia's drones coordinate in groups of six, Ukraine's hunt alone"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Phoenix Rooivalk Solutions
            </h3>
            <div className="space-y-4">
              <SolutionCard
                icon="✅"
                title="Multi-Sensor Fusion"
                description="RF + acoustic + optical sensors eliminate environmental confusion"
              />
              <SolutionCard
                icon="🔗"
                title="Blockchain Coordination"
                description="Tamper-proof swarm coordination resistant to EW attacks"
              />
              <SolutionCard
                icon="⚡"
                title="Ready Today"
                description="Deployable now, 18 months ahead of the 2027 deadline"
              />
            </div>
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-8">
          <div
            className="bg-[rgba(0,255,136,0.1)] border rounded-xl p-6 max-w-4xl mx-auto"
            style={{ borderColor: "rgba(0, 255, 136, 0.3)" }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">The Stakes</h3>
            <p className="text-[var(--gray)] text-lg mb-6">
              "Ukraine's entire war strategy hinges on this race. They've
              survived three years by being smarter, not stronger. If they lose
              the AI warfare competition, they lose their main advantage over
              Russia's superior numbers."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#contact" size="lg">
                Schedule Urgent Demo
              </Button>
              <Button
                href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Ukraine%20Defense%20Inquiry"
                variant="outline"
                size="lg"
              >
                Defense Partnership Inquiry
              </Button>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

const ProblemCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
    <span className="text-red-400 text-2xl">{icon}</span>
    <div>
      <div className="font-bold text-red-400">{title}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </div>
  </div>
);

const SolutionCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div
    className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border rounded-lg"
    style={{ borderColor: "rgba(0, 255, 136, 0.3)" }}
  >
    <span className="text-[var(--primary)] text-2xl">{icon}</span>
    <div>
      <div className="font-bold text-[var(--primary)]">{title}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </div>
  </div>
);
