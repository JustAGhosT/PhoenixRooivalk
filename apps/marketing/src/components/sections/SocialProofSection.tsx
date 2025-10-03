import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";

export const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Units need RF-silent detection paths in contested environments.",
      author: "Defense Stakeholder",
      title: "Operational Requirements",
      organization: "Exploratory Interview",
      avatar: "👨‍💼",
    },
    {
      quote:
        "Systems must fail gracefully offline; central coordination is a bonus, not a dependency.",
      author: "Technical Advisor",
      title: "System Architecture",
      organization: "Discovery Discussion",
      avatar: "👩‍🔬",
    },
  ];

  const partnerships = [
    { name: "Seeking Partnerships", logo: "🤝", type: "Development Partners" },
    { name: "SBIR Application", logo: "🚀", type: "Funding Pursuit" },
    { name: "Industry Collaboration", logo: "🔬", type: "Research Partners" },
  ];

  const certifications = [
    { name: "ITAR Compliance", status: "Planned", icon: "🔒" },
    { name: "ISO 27001", status: "Planned", icon: "📋" },
    { name: "CMMC 2.0 L2", status: "Planned", icon: "🛡️" },
    { name: "MIL-STD-810G", status: "Planned", icon: "🛡️" },
    { name: "Export Control", status: "Planned", icon: "🌍" },
    { name: "GDPR Compliance", status: "Planned", icon: "⚖️" },
  ];

  const developmentStatus = [
    {
      icon: "🔬",
      title: "Concept Phase",
      description: "Core architecture design and planning underway",
      status: "Planning",
    },
    {
      icon: "🚀",
      title: "SBIR Strategy",
      description: "Air Force SBIR Phase I application preparation",
      status: "Planned",
    },
    {
      icon: "🛡️",
      title: "DoD Compliance",
      description: "CMMC 2.0 Level 2 certification pathway planning",
      status: "Planned",
    },
    {
      icon: "🔒",
      title: "Security Standards",
      description: "Military-grade security protocols under design",
      status: "Planning",
    },
  ];

  const mediaCoverage = [
    {
      outlet: "Industry Outlook",
      headline: "Autonomous Counter-Drone Systems Show Promise",
      date: "Market Analysis",
    },
    {
      outlet: "Technology Trends",
      headline: "Edge Computing Potential in Air Defense",
      date: "Future Applications",
    },
    {
      outlet: "Defense Innovation",
      headline: "120ms Response Time Target Analysis",
      date: "Technical Feasibility",
    },
    {
      outlet: "Market Research",
      headline: "Counter-UAS Technology Development",
      date: "Industry Assessment",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[rgb(var(--tactical-black))] to-[rgb(var(--tactical-obsidian))] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 px-6 md:px-[5%] lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--phoenix-white))] to-[rgb(var(--primary))] mb-6">
              Innovation in Counter-Drone Defense
            </h2>
            <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
              Phoenix Rooivalk represents the next generation of autonomous
              counter-drone defense technology, designed to address critical
              gaps in current market solutions.
            </p>
          </div>

          {/* What We're Hearing */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
              What We&apos;re Hearing (Discovery Notes, Not Endorsements)
            </h3>
            <p className="text-sm text-[rgb(var(--gray))] text-center mb-6 max-w-2xl mx-auto">
              Paraphrased insights from exploratory interviews with defense
              stakeholders.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-xl p-6 hover:border-[rgba(var(--primary),0.4)] transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <p className="text-[rgb(var(--phoenix-white))] text-lg leading-relaxed mb-4">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div>
                        <div className="font-semibold text-[rgb(var(--primary))]">
                          {testimonial.author}
                        </div>
                        <div className="text-[rgb(var(--gray))] text-sm">
                          {testimonial.title}
                        </div>
                        <div className="text-[rgb(var(--accent))] text-sm font-medium">
                          {testimonial.organization}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partnerships */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
              Strategic Partnerships
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partnerships.map((partner, index) => (
                <div
                  key={index}
                  className="bg-[rgba(var(--tactical-charcoal),0.6)] backdrop-blur-sm border border-[rgba(var(--primary),0.1)] rounded-lg p-4 text-center hover:border-[rgba(var(--primary),0.3)] hover:bg-[rgba(var(--tactical-charcoal),0.8)] transition-all duration-300 group"
                >
                  <div className="text-3xl mb-2">{partner.logo}</div>
                  <div className="font-semibold text-[rgb(var(--phoenix-white))] text-sm mb-1">
                    {partner.name}
                  </div>
                  <div className="text-[rgb(var(--gray))] text-xs">
                    {partner.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Status & Certifications */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
              Development Status & Compliance
            </h3>

            {/* Development Status */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-[rgb(var(--accent))] mb-6 text-center">
                Development Roadmap (Targets, Post-Funding)
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {developmentStatus.map((status, index) => (
                  <RevealSection key={index}>
                    <div className="bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-xl p-6 text-center hover:border-[rgba(var(--primary),0.4)] transition-all duration-300">
                      <div className="text-3xl mb-3">{status.icon}</div>
                      <h5 className="text-lg font-bold text-[rgb(var(--primary))] mb-2">
                        {status.title}
                      </h5>
                      <p className="text-[rgb(var(--gray))] text-sm mb-3">
                        {status.description}
                      </p>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          status.status === "Active"
                            ? "bg-[rgba(var(--status-active),0.2)] text-[rgb(var(--status-active))] border border-[rgba(var(--status-active),0.3)]"
                            : "bg-[rgba(var(--status-warning),0.2)] text-[rgb(var(--status-warning))] border border-[rgba(var(--status-warning),0.3)]"
                        }`}
                      >
                        {status.status}
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </div>

            {/* Compliance Roadmap */}
            <div>
              <h4 className="text-xl font-semibold text-[rgb(var(--accent))] mb-6 text-center">
                Assurance Roadmap (Targets, Post-Funding)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-[rgba(var(--tactical-charcoal),0.6)] backdrop-blur-sm border border-[rgba(var(--primary),0.1)] rounded-lg p-4 text-center hover:border-[rgba(var(--primary),0.3)] transition-all duration-300"
                  >
                    <div className="text-2xl mb-2">{cert.icon}</div>
                    <div className="font-semibold text-[rgb(var(--phoenix-white))] text-sm mb-1">
                      {cert.name}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full inline-block ${
                        cert.status === "Certified"
                          ? "bg-[rgba(var(--status-active),0.2)] text-[rgb(var(--status-active))] border border-[rgba(var(--status-active),0.3)]"
                          : cert.status === "In Progress"
                            ? "bg-[rgba(var(--status-warning),0.2)] text-[rgb(var(--status-warning))] border border-[rgba(var(--status-warning),0.3)]"
                            : "bg-[rgba(var(--status-offline),0.2)] text-[rgb(var(--status-offline))] border border-[rgba(var(--status-offline),0.3)]"
                      }`}
                    >
                      {cert.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media Coverage */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[rgb(var(--primary))] mb-8 text-center">
              Industry Recognition
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaCoverage.map((article, index) => (
                <div
                  key={index}
                  className="bg-[rgba(var(--tactical-charcoal),0.6)] backdrop-blur-sm border border-[rgba(var(--primary),0.1)] rounded-lg p-4 hover:border-[rgba(var(--primary),0.3)] transition-all duration-300"
                >
                  <div className="font-semibold text-[rgb(var(--primary))] text-sm mb-2">
                    {article.outlet}
                  </div>
                  <div className="text-[rgb(var(--phoenix-white))] text-sm mb-2 leading-relaxed">
                    {article.headline}
                  </div>
                  <div className="text-[rgb(var(--gray))] text-xs">
                    {article.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-[rgba(var(--tactical-charcoal),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[rgb(var(--phoenix-white))] mb-4">
              Ready to Experience 120ms Response Time?
            </h3>
            <p className="text-[rgb(var(--gray))] mb-6 max-w-2xl mx-auto">
              Join leading defense organizations in piloting the next generation
              of autonomous counter-drone defense.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="#contact"
                size="lg"
                className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--primary))] shadow-xl"
              >
                Request Pilot Program
              </Button>
              <Button
                href="/compliance"
                variant="ghost"
                size="lg"
                className="border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.1)]"
              >
                View Certifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
