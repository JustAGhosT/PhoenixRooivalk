import React from 'react';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout title="PhoenixRooivalk" description="Public-safe documentation">
      <main className="homeMain">
        <section className="homeSection">
          <h1>PhoenixRooivalk</h1>
          <p>
            Public-safe documentation for the PhoenixRooivalk modular
            counter‑UAS system. Restricted partner materials are not published
            here.
          </p>
          <div className="homeCta">
            <a
              className="button button--primary button--lg"
              href="https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Partner Access Request
            </a>
          </div>
          <p>
            For a high-level system overview, see the{' '}
            <a href="/overview">Overview</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
