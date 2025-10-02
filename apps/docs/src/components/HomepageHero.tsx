import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import * as React from "react";

export default function HomepageHero(): React.ReactElement {
  const logoUrl = useBaseUrl("/img/logo.svg");

  return (
    <header className="hero hero--primary">
      <div className="container">
        <div className="hero__content">
          <div className="hero__brand">
            <img
              src={logoUrl}
              alt="Phoenix Rooivalk"
              className="hero__logo"
              width="80"
              height="80"
            />
            <h1 className="hero__title">Phoenix Rooivalk</h1>
            <p className="hero__subtitle">
              Level-0 Autonomous Counter-UAS Defense Platform
            </p>
          </div>
          <div className="hero__description">
            <p className="hero__text">
              Revolutionary counter-drone defense system combining cutting-edge
              AI with military-grade blockchain infrastructure for unmatched
              performance and accountability.
            </p>
          </div>
          <div className="hero__features">
            <div className="hero__feature">
              <span className="hero__feature-icon">⚡</span>
              <span className="hero__feature-text">Edge Autonomy</span>
            </div>
            <div className="hero__feature">
              <span className="hero__feature-icon">🔗</span>
              <span className="hero__feature-text">Blockchain Security</span>
            </div>
            <div className="hero__feature">
              <span className="hero__feature-icon">🤖</span>
              <span className="hero__feature-text">AI-Powered Detection</span>
            </div>
            <div className="hero__feature">
              <span className="hero__feature-icon">🔧</span>
              <span className="hero__feature-text">Modular Design</span>
            </div>
          </div>
          <div className="hero__actions">
            <Link
              className="button button--primary button--lg"
              to="/docs/executive/Executive_Summary"
            >
              Get Started
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/technical/Technical_Architecture"
            >
              Technical Specs
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
