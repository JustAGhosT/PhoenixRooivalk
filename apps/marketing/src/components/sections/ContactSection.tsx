"use client";

import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React from "react";
import { Button } from "../ui/button";
import styles from "./ContactSection.module.css";

export const ContactSection: React.FC = () => {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Ready to Deploy SAE Level 4 Autonomous Defense?
          </h2>
          <p className={styles.subtitle}>
            Join the next generation of counter-drone defense. Request
            capability demonstration or download technical whitepaper.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              Request Capability Demonstration
            </h3>
            <p className={styles.cardDescription}>
              See Phoenix Rooivalk&apos;s SAE Level 4 autonomous architecture in
              action. Demonstrate &lt;2ms response time, RF-silent drone
              detection, and swarm defense capabilities.
            </p>
            <div className={styles.buttonGroup}>
              <Button
                href="mailto:demo@phoenixrooivalk.com"
                size="lg"
                className="w-full"
                trackingEvent="Demo Requested"
                trackingProps={{ location: "contact-section", type: "email" }}
                aria-label="Email us to schedule a technical demonstration"
              >
                Schedule Technical Demo
              </Button>
              <Button
                href="mailto:partnerships@phoenixrooivalk.com"
                variant="ghost"
                size="lg"
                className="w-full"
                trackingEvent="Partnership Inquiry"
                trackingProps={{ location: "contact-section", type: "email" }}
                aria-label="Email us for partnership inquiries"
              >
                Partnership Inquiries
              </Button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Technical Resources</h3>
            <p className={styles.cardDescription}>
              Download comprehensive technical documentation and market
              analysis. Learn about SAE Level 4 architecture, market
              opportunity, and competitive positioning.
            </p>
            <div className={styles.buttonGroup}>
              <Button
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  downloadWhitepaper();
                }}
                size="lg"
                className="w-full"
                type="button"
                trackingEvent="Whitepaper Downloaded"
                trackingProps={{ location: "contact-section", type: "button" }}
                aria-label="Download technical whitepaper PDF"
              >
                Download Technical Whitepaper
              </Button>
              <Button
                href="/technical"
                variant="ghost"
                size="lg"
                className="w-full"
                trackingEvent="Technical Specs Viewed"
                trackingProps={{ location: "contact-section", source: "cta" }}
                aria-label="View detailed technical specifications"
              >
                View Technical Specifications
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.sbirSection}>
          <div className={styles.sbirCard}>
            <h3 className={styles.sbirTitle}>
              SBIR & Government Opportunities
            </h3>
            <p className={styles.sbirDescription}>
              Phoenix Rooivalk is actively pursuing Air Force SBIR Phase I
              ($350K) and seeking partnerships with defense contractors for
              market entry. Contact us for SBIR collaboration or government
              contracting opportunities.
            </p>
            <Button href="mailto:government@phoenixrooivalk.com" size="lg">
              Government Contracting Inquiries
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
