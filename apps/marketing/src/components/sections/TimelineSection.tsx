import * as React from "react";
import { RevealSection } from "../RevealSection";
import styles from "./TimelineSection.module.css";

export const TimelineSection: React.FC = () => {
  const timelineItems = [
    {
      phase: "Phase 1",
      title: "Concept Development",
      duration: "Q1-Q3 2025",
      status: "Completed" as const,
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
      status: "Active" as const,
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
      status: "Planned" as const,
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
      status: "Future" as const,
      description: "Manufacturing and deployment preparation",
      milestones: [
        "Production line setup",
        "Quality assurance protocols",
        "Deployment planning",
        "Field testing and validation",
      ],
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return styles.statusCompleted;
      case "Active":
        return styles.statusActive;
      case "Planned":
        return styles.statusPlanned;
      case "Future":
        return styles.statusFuture;
      default:
        return styles.statusFuture;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.backgroundPattern}>
        <div className={styles.backgroundGrid}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <RevealSection className={styles.header}>
            <h2 className={styles.title}>Development Timeline</h2>
            <p className={styles.description}>
              A structured roadmap for bringing Phoenix Rooivalk from concept to
              production, with clear milestones and compliance targets.
            </p>
          </RevealSection>

          <div className={styles.timeline}>
            {timelineItems.map((item, index) => (
              <RevealSection key={index}>
                <div className={styles.timelineItem}>
                  <div className={styles.phaseLabel}>{item.phase}</div>
                  <h3 className={styles.phaseTitle}>{item.title}</h3>
                  <p className={styles.phaseDuration}>{item.duration}</p>
                  <span
                    className={`${styles.phaseStatus} ${getStatusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                  <p className={styles.phaseDescription}>{item.description}</p>
                  <ul className={styles.milestones}>
                    {item.milestones.map((milestone, milestoneIndex) => (
                      <li key={milestoneIndex} className={styles.milestone}>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
