import Layout from "@theme/Layout";
import React from "react";

export default function Whitepaper(): React.ReactElement {
  return (
    <Layout title="Whitepaper" description="Phoenix Rooivalk Whitepaper">
      <main className="whitepaperMain">
        <section className="whitepaperSection">
          <header className="whitepaperHeader">
            <h1>Phoenix Rooivalk Whitepaper</h1>
          </header>
          <p className="whitepaperMeta">
            Version 1.0 · © 2025 Phoenix Rooivalk · Public summary
            (non-restricted)
          </p>

          <p>
            Phoenix Rooivalk combines multi-sensor drone detection, layered
            effectors, and blockchain-backed evidence anchoring to deliver
            secure, auditable counter‑UAS operations. The system architecture
            focuses on modularity, cost efficiency, and resilience across mobile
            and fixed deployments.
          </p>

          <h2>Highlights</h2>
          <ul>
            <li>Multi-sensor fusion: RF, radar, optical, acoustic, infrared</li>
            <li>
              Layered defense: RF jamming, spoofing, and non-destructive capture
            </li>
            <li>
              Blockchain anchoring: append-only evidence logs across multiple
              chains
            </li>
            <li>
              Edge-first design: sub-second reactions in disconnected
              environments
            </li>
          </ul>

          <div className="whitepaperCta">
            <a
              className="button button--primary button--lg"
              href="/docs/overview"
            >
              Read System Overview
            </a>
            {/* If you later add a PDF under /static, point this to /whitepaper.pdf */}
            <a className="button button--secondary button--lg" href="/contact">
              Request Full PDF
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
