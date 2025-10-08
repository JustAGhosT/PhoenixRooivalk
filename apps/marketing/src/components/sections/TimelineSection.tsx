import * as React from "react";
import { RevealSection } from "../RevealSection";

export const TimelineSection: React.FC = () => {
  const timelineItems = [
    {
      phase: "Phase 1",
      title: "Concept Development",
      duration: "Q1-Q3 2025",
      status: "Completed",
      description: "Core architecture design and planning",
      milestones: [
        "System architecture finalized ✓",
        "Technical specifications completed ✓",
        "Initial prototype development ✓",
        "Interactive demo launched ✓",
      ],
    },
    {
      phase: "Phase 2",
      title: "SBIR Application",
      duration: "Q3-Q4 2025",
      status: "Active",
      description: "Air Force SBIR Phase I application preparation",
      milestones: [
        "SBIR proposal submission (In Progress)",
        "Technical validation planning",
        "Partnership development",
        "DoD stakeholder engagement",
      ],
    },
    {
      phase: "Phase 3",
      title: "DoD Compliance",
      duration: "Q4 2025 - Q1 2026",
      status: "Planned",
      description: "CMMC 2.0 Level 2 certification pathway",
      milestones: [
        "CMMC 2.0 Level 2 certification",
        "Security protocols implementation",
        "Audit preparation",
        "ITAR compliance verification",
      ],
    },
    {
      phase: "Phase 4",
      title: "Production Readiness",
      duration: "Q2-Q3 2026",
      status: "Future",
      description: "Manufacturing and deployment preparation",
      milestones: [
        "Production line setup",
        "Quality assurance protocols",
        "Deployment planning",
        "Field testing and validation",
      ],
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-20 bg-gradient-to-br from-[rgb(var(--bg-primary))] to-[rgb(var(--darker))] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <RevealSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--text-primary))] to-[rgb(var(--primary))] mb-6">
              Development Timeline
            </h2>
            <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
              A structured roadmap for bringing Phoenix Rooivalk from concept to
              production, with clear milestones and compliance targets.
            </p>
          </RevealSection>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[rgb(var(--primary))] to-[rgb(var(--accent))]"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {timelineItems.map((item, index) => (
                <RevealSection key={index}>
                  <div
                    className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-[rgb(var(--primary))] rounded-full border-4 border-[rgb(var(--bg-primary))] z-10"></div>

                    {/* Content */}
                    <div
                      className={`ml-16 md:ml-0 ${index % 2 === 0 ? "md:mr-8 md:text-right" : "md:ml-8 md:text-left"} w-full md:w-5/12`}
                    >
                      <div className="bg-[rgba(var(--bg-surface),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-xl p-6 hover:border-[rgba(var(--primary),0.4)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)] px-3 py-1 rounded-full">
                            {item.phase}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              item.status === "Active"
                                ? "bg-[rgba(var(--action-success),0.2)] text-[rgb(var(--action-success))]"
                                : item.status === "Planned"
                                  ? "bg-[rgba(var(--action-warning),0.2)] text-[rgb(var(--action-warning))]"
                                  : "bg-[rgba(var(--text-muted),0.2)] text-[rgb(var(--text-muted))]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-2">
                          {item.title}
                        </h3>

                        <p className="text-sm text-[rgb(var(--primary))] font-medium mb-3">
                          {item.duration}
                        </p>

                        <p className="text-[rgb(var(--text-muted))] mb-4">
                          {item.description}
                        </p>

                        <ul className="space-y-2">
                          {item.milestones.map((milestone, milestoneIndex) => (
                            <li
                              key={milestoneIndex}
                              className="flex items-start text-sm text-[rgb(var(--text-muted))]"
                            >
                              <span className="text-[rgb(var(--primary))] mr-2">
                                •
                              </span>
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <RevealSection className="text-center mt-16">
            <div className="bg-[rgba(var(--bg-surface),0.8)] backdrop-blur-sm border border-[rgba(var(--primary),0.2)] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-4">
                Interested in Our Development Process?
              </h3>
              <p className="text-[rgb(var(--text-muted))] mb-6 max-w-2xl mx-auto">
                Learn more about our structured approach to bringing advanced
                counter-drone technology from concept to production.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="btn btn--primary">
                  Join Development Program
                </a>
                <a href="/technical" className="btn btn--secondary">
                  View Technical Details
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};
