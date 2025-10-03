import Link from "@docusaurus/Link";
import * as React from "react";

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const FeatureList: FeatureItem[] = [
  {
    title: "Executive Overview",
    description:
      "High-level system overview, market opportunity, and key value propositions for executives and investors.",
    icon: "📊",
    link: "/docs/executive/Executive_Summary",
  },
  {
    title: "Technical Architecture",
    description:
      "Detailed system design, hardware specifications, and technology stack for technical evaluators.",
    icon: "🔧",
    link: "/docs/technical/Technical_Architecture",
  },
  {
    title: "Market Analysis",
    description:
      "Global market opportunities, competitive positioning, and financial projections for business development.",
    icon: "💼",
    link: "/docs/business/Market_Analysis",
  },
  {
    title: "Operations Guide",
    description:
      "Manufacturing strategy, deployment procedures, and operational resilience for implementation teams.",
    icon: "🚀",
    link: "/docs/operations/Manufacturing_Strategy",
  },
];

function Feature({ title, description, icon, link }: FeatureItem) {
  return (
    <div className="col col--6 margin-bottom--lg">
      <div className="card">
        <div className="card__header">
          <div className="feature__icon">{icon}</div>
          <h3 className="feature__title">{title}</h3>
        </div>
        <div className="card__body">
          <p className="feature__description">{description}</p>
          <div className="feature__action">
            <Link className="button button--primary button--outline" to={link}>
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className="features">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="features__header">
              <h2 className="features__title">Comprehensive Documentation</h2>
              <p className="features__subtitle">
                Everything you need to understand, evaluate, and implement
                Phoenix Rooivalk
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
