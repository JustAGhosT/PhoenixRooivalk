"use client";
import * as React from "react";
import { RevealSection } from "../RevealSection";

interface MethodCardProps {
  icon: string;
  title: string;
  description: string;
  effectiveness: string;
  responseTime: string;
  range: string;
  pros: string[];
  cons: string[];
  useCase: string;
}

const MethodCard: React.FC<MethodCardProps> = ({
  icon,
  title,
  description,
  effectiveness,
  responseTime,
  range,
  pros,
  cons,
  useCase,
}) => (
  <div className="card card--elevated">
    <div className="text-center mb-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-muted)]">{description}</p>
    </div>

    {/* Key Metrics */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center p-3 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
        <div className="text-sm text-[var(--text-muted)] mb-1">
          Effectiveness
        </div>
        <div className="text-lg font-bold text-[var(--action-success)]">
          {effectiveness}
        </div>
      </div>
      <div className="text-center p-3 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
        <div className="text-sm text-[var(--text-muted)] mb-1">
          Response Time
        </div>
        <div className="text-lg font-bold text-[var(--action-primary)]">
          {responseTime}
        </div>
      </div>
      <div className="text-center p-3 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
        <div className="text-sm text-[var(--text-muted)] mb-1">Range</div>
        <div className="text-lg font-bold text-[var(--accent)]">{range}</div>
      </div>
    </div>

    {/* Pros and Cons */}
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <h4 className="text-sm font-semibold text-[var(--action-success)] mb-2">
          ✓ Advantages
        </h4>
        <ul className="text-sm text-[var(--text-muted)] space-y-1">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[var(--action-success)] mr-2">•</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[var(--action-warning)] mb-2">
          ⚠ Limitations
        </h4>
        <ul className="text-sm text-[var(--text-muted)] space-y-1">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[var(--action-warning)] mr-2">•</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Use Case */}
    <div className="p-4 bg-[rgba(var(--bg-secondary),0.6)] rounded-lg border border-[rgba(var(--primary),0.2)]">
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
        Best Use Case
      </h4>
      <p className="text-sm text-[var(--text-muted)]">{useCase}</p>
    </div>
  </div>
);

export const CounterDroneMethodsSection: React.FC = () => {
  const methods = [
    {
      icon: "📡",
      title: "RF Jamming",
      description:
        "Disrupts drone communication and control signals using radio frequency interference.",
      effectiveness: "85%",
      responseTime: "50-200ms",
      range: "1-5km",
      pros: [
        "Immediate effect on communication",
        "Works against most commercial drones",
        "Non-destructive approach",
        "Can affect multiple targets",
      ],
      cons: [
        "May affect friendly communications",
        "Limited against autonomous drones",
        "Requires significant power",
        "Legal restrictions in some areas",
      ],
      useCase:
        "Ideal for disrupting communication-dependent drones in controlled environments where collateral interference is acceptable.",
    },
    {
      icon: "🎯",
      title: "GPS Spoofing",
      description:
        "Provides false GPS signals to mislead drone navigation and positioning systems.",
      effectiveness: "70%",
      responseTime: "100-500ms",
      range: "500m-2km",
      pros: [
        "Redirects drones to safe areas",
        "Non-destructive method",
        "Can be targeted and precise",
        "Works against GPS-dependent systems",
      ],
      cons: [
        "Limited against non-GPS navigation",
        "May affect nearby GPS devices",
        "Requires sophisticated equipment",
        "Legal and regulatory concerns",
      ],
      useCase:
        "Best for redirecting GPS-dependent drones away from sensitive areas without causing damage.",
    },
    {
      icon: "⚡",
      title: "Electronic Warfare",
      description:
        "Advanced electromagnetic attacks targeting drone electronics and control systems.",
      effectiveness: "95%",
      responseTime: "20-100ms",
      range: "2-10km",
      pros: [
        "Highest effectiveness rate",
        "Can disable multiple systems",
        "Works against hardened targets",
        "Precise targeting capabilities",
      ],
      cons: [
        "High power requirements",
        "May cause collateral damage",
        "Complex deployment",
        "Expensive equipment",
      ],
      useCase:
        "Critical infrastructure protection where maximum effectiveness is required and collateral effects are acceptable.",
    },
    {
      icon: "🔍",
      title: "Kinetic Intercept",
      description:
        "Physical destruction using projectiles, nets, or other kinetic means.",
      effectiveness: "90%",
      responseTime: "200-1000ms",
      range: "100m-2km",
      pros: [
        "Immediate neutralization",
        "Works against all drone types",
        "Visual confirmation of success",
        "No electronic interference",
      ],
      cons: [
        "Destructive method",
        "Debris and safety concerns",
        "Limited ammunition",
        "May cause collateral damage",
      ],
      useCase:
        "High-threat scenarios where immediate neutralization is required and collateral damage is acceptable.",
    },
    {
      icon: "🌐",
      title: "Cyber Takeover",
      description:
        "Hacking into drone systems to gain control or disable them remotely.",
      effectiveness: "60%",
      responseTime: "1-5s",
      range: "Unlimited",
      pros: [
        "Non-destructive approach",
        "Can gain intelligence",
        "Reversible action",
        "No physical debris",
      ],
      cons: [
        "Requires specific vulnerabilities",
        "Time-intensive process",
        "May not work on all drones",
        "Requires specialized skills",
      ],
      useCase:
        "Intelligence gathering missions where gaining control of the drone provides valuable information.",
    },
    {
      icon: "🛡️",
      title: "Directed Energy",
      description:
        "High-energy laser or microwave systems to disable drone electronics.",
      effectiveness: "80%",
      responseTime: "100-300ms",
      range: "500m-3km",
      pros: [
        "Precise targeting",
        "No ammunition required",
        "Can be scaled for power",
        "Silent operation",
      ],
      cons: [
        "High power consumption",
        "Weather dependent",
        "Line-of-sight required",
        "Expensive technology",
      ],
      useCase:
        "Perimeter defense where precision targeting is needed and power resources are available.",
    },
  ];

  return (
    <RevealSection>
      <section className="py-20 bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="relative z-10 px-6 md:px-[5%] lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--text-primary))] to-[rgb(var(--primary))] mb-6">
                Counter-Drone Defense Methods
              </h2>
              <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
                Phoenix Rooivalk integrates multiple defense strategies to
                provide comprehensive protection against various drone threats.
              </p>
            </div>

            {/* Methods Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {methods.map((method, index) => (
                <MethodCard key={index} {...method} />
              ))}
            </div>

            {/* Integration Note */}
            <div className="mt-16 text-center">
              <div className="bg-[rgba(var(--bg-surface),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-4">
                  Integrated Defense Strategy
                </h3>
                <p className="text-[var(--text-muted)] mb-6 max-w-3xl mx-auto">
                  Phoenix Rooivalk combines multiple counter-drone methods in a
                  layered defense approach. The system automatically selects the
                  most appropriate method based on threat type, environmental
                  conditions, and operational requirements.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(var(--action-success))] mb-2">
                      95%
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Combined Effectiveness
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(var(--action-primary))] mb-2">
                      &lt;200ms
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Average Response Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(var(--accent))] mb-2">
                      6
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Defense Methods
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
};
