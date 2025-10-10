import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";
import styles from "./SocialProofSection.module.css";

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
    <section className={styles.section}>
      {/* Background pattern */}
      <div className={styles.backgroundPattern} />

      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* Section Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>
              Innovation in Counter-Drone Defense
            </h2>
            <p className={styles.subtitle}>
              Phoenix Rooivalk represents the next generation of autonomous
              counter-drone defense technology, designed to address critical
              gaps in current market solutions.
            </p>
          </div>

          {/* What We're Hearing */}
          <div className={styles.testimonialSection}>
            <h3 className={styles.sectionTitle}>
              What We&apos;re Hearing (Discovery Notes, Not Endorsements)
            </h3>
            <p className={styles.sectionSubtitle}>
              Paraphrased insights from exploratory interviews with defense
              stakeholders.
            </p>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={styles.testimonialCard}>
                  <div className={styles.testimonialHeader}>
                    <div className={styles.avatar}>{testimonial.avatar}</div>
                    <div className={styles.testimonialContent}>
                      <p className={styles.quote}>
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div>
                        <div className={styles.authorName}>
                          {testimonial.author}
                        </div>
                        <div className={styles.authorTitle}>
                          {testimonial.title}
                        </div>
                        <div className={styles.authorOrg}>
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
          <div className={styles.partnershipsSection}>
            <h3 className={styles.sectionTitle}>Strategic Partnerships</h3>
            <div className={styles.partnershipsGrid}>
              {partnerships.map((partner, index) => (
                <div key={index} className={styles.partnerCard}>
                  <div className={styles.partnerLogo}>{partner.logo}</div>
                  <div className={styles.partnerName}>{partner.name}</div>
                  <div className={styles.partnerType}>{partner.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Status & Certifications */}
          <div className={styles.developmentSection}>
            <h3 className={styles.sectionTitle}>
              Development Status & Compliance
            </h3>

            {/* Development Status */}
            <div className={styles.testimonialSection}>
              <h4 className={styles.developmentSubtitle}>
                Development Roadmap (Targets, Post-Funding)
              </h4>
              <div className={styles.developmentGrid}>
                {developmentStatus.map((status, index) => (
                  <RevealSection key={index}>
                    <div className={styles.statusCard}>
                      <div className={styles.statusIcon}>{status.icon}</div>
                      <h5 className={styles.statusTitle}>{status.title}</h5>
                      <p className={styles.statusDescription}>
                        {status.description}
                      </p>
                      <div
                        className={`${styles.statusBadge} ${
                          status.status === "Active"
                            ? styles.statusActive
                            : styles.statusPlanned
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
            <div className={styles.complianceSection}>
              <h4 className={styles.developmentSubtitle}>
                Assurance Roadmap (Targets, Post-Funding)
              </h4>
              <div className={styles.complianceGrid}>
                {certifications.map((cert, index) => (
                  <div key={index} className={styles.certCard}>
                    <div className={styles.certIcon}>{cert.icon}</div>
                    <div className={styles.certName}>{cert.name}</div>
                    <div
                      className={`${styles.certStatus} ${
                        cert.status === "Certified"
                          ? styles.certStatusCertified
                          : cert.status === "In Progress"
                            ? styles.certStatusInProgress
                            : styles.certStatusPlanned
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
          <div className={styles.mediaSection}>
            <h3 className={styles.sectionTitle}>Industry Recognition</h3>
            <div className={styles.mediaGrid}>
              {mediaCoverage.map((article, index) => (
                <div key={index} className={styles.articleCard}>
                  <div className={styles.articleOutlet}>{article.outlet}</div>
                  <div className={styles.articleHeadline}>
                    {article.headline}
                  </div>
                  <div className={styles.articleDate}>{article.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>
              Ready to Experience 120ms Response Time?
            </h3>
            <p className={styles.ctaSubtitle}>
              Join leading defense organizations in piloting the next generation
              of autonomous counter-drone defense.
            </p>
            <div className={styles.ctaButtons}>
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
