import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import * as React from "react";

export default function Footer(): React.ReactElement {
  const logoUrl = useBaseUrl("/img/logo.svg");

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className="footer__brand">
              <img
                src={logoUrl}
                alt="Phoenix Rooivalk"
                className="phoenix-logo"
                width="32"
                height="32"
              />
              <h3 className="footer__title">Phoenix Rooivalk</h3>
              <p className="footer__description">
                Revolutionary Level-0 Autonomous Counter-UAS Defense Platform
              </p>
            </div>
          </div>
          <div className="col col--2">
            <div className="footer__links">
              <h4 className="footer__title">Documentation</h4>
              <ul className="footer__items">
                <li className="footer__item">
                  <Link
                    to="/docs/executive/Executive_Summary"
                    className="footer__link-item"
                  >
                    Executive Summary
                  </Link>
                </li>
                <li className="footer__item">
                  <Link
                    to="/docs/technical/Technical_Architecture"
                    className="footer__link-item"
                  >
                    Technical Architecture
                  </Link>
                </li>
                <li className="footer__item">
                  <Link
                    to="/docs/business/Market_Analysis"
                    className="footer__link-item"
                  >
                    Market Analysis
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col col--2">
            <div className="footer__links">
              <h4 className="footer__title">Resources</h4>
              <ul className="footer__items">
                <li className="footer__item">
                  <Link
                    to="https://github.com/JustAGhosT/PhoenixRooivalk"
                    className="footer__link-item"
                  >
                    GitHub Repository
                  </Link>
                </li>
                <li className="footer__item">
                  <Link
                    to="https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md"
                    className="footer__link-item"
                  >
                    Request Access
                  </Link>
                </li>
                <li className="footer__item">
                  <Link to="/docs" className="footer__link-item">
                    Getting Started
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col col--4">
            <div className="footer__legal">
              <h4 className="footer__title">Legal</h4>
              <p className="footer__legal-text">
                This documentation contains confidential technical
                specifications. Distribution is restricted to authorized
                personnel only.
              </p>
              <p className="footer__copyright">
                © 2025 Phoenix Rooivalk. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__bottom-text">
              Built with ❤️ for global defense security
            </p>
            <div className="footer__bottom-links">
              <Link
                to="/docs/operations/Manufacturing_Strategy"
                className="footer__link-item"
              >
                Manufacturing
              </Link>
              <Link
                to="/docs/technical/System_Architecture"
                className="footer__link-item"
              >
                Architecture
              </Link>
              <Link
                to="/docs/business/Business_Model"
                className="footer__link-item"
              >
                Business Model
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
