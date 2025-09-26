"use client";
import React from 'react';
import Link from 'next/link';

export default function FinancialPage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Phoenix Rooivalk</Link>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li><Link href="/" className="hover:text-[var(--primary)]">Home</Link></li>
            <li><Link href="/technical" className="hover:text-[var(--primary)]">Technical</Link></li>
            <li><Link href="/financial" className="text-[var(--primary)]">Financial</Link></li>
            <li><Link href="/compliance" className="hover:text-[var(--primary)]">Compliance</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">Financial Projections</h1>
            <p className="text-[var(--gray)] mt-4 max-w-3xl mx-auto">Break-even by Year 3, $9.4M revenue by Year 5 with 34.9% profit margins</p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Key Financial Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ['$47,000', 'Unit Price', 'Per system pricing'],
              ['Year 3', 'Break-Even Point', '50 units sold'],
              ['$9.4M', 'Year 5 Revenue', 'Projected annual revenue'],
              ['34.9%', 'Year 5 Profit Margin', 'Operational efficiency']
            ].map(([value, label, description]) => (
              <div key={label} className="text-center rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
                <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] mb-2">{value}</div>
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-[var(--gray)] text-sm">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Projections Table */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Revenue and Profit Projections</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)]">
                  <th className="p-4 text-left font-bold">Year</th>
                  <th className="p-4 text-left font-bold">Units Sold</th>
                  <th className="p-4 text-left font-bold">Revenue (USD)</th>
                  <th className="p-4 text-left font-bold">Costs (USD)</th>
                  <th className="p-4 text-left font-bold">Profit (USD)</th>
                  <th className="p-4 text-left font-bold">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="bg-[rgba(15,23,42,0.8)]">
                {[
                  ['0', '0', '0', '830,000', '-830,000', '-100.0%'],
                  ['1', '15', '705,000', '858,000', '-152,000', '-21.6%'],
                  ['2', '35', '1,645,000', '1,465,000', '180,000', '10.9%'],
                  ['3 (Break-Even)', '50', '2,350,000', '2,210,000', '138,000', '5.9%'],
                  ['4', '100', '4,700,000', '3,210,000', '1,490,000', '31.8%'],
                  ['5', '150', '7,050,000', '4,590,000', '2,460,000', '34.9%']
                ].map((row, index) => (
                  <tr key={index} className={`hover:bg-[rgba(0,255,136,0.05)] ${row[0].includes('Break-Even') ? 'bg-[rgba(0,255,136,0.1)]' : ''}`}>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)] font-semibold">{row[0]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[1]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[2]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[3]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[4]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Funding Allocation */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Initial Investment Allocation</h2>
          <div className="text-center mb-8">
            <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">$830,000</div>
            <p className="text-[var(--gray)] mt-2">Total initial investment required</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: 'Research & Development',
                amount: '$555,000',
                percentage: '67%',
                justification: 'Essential for prototyping, testing, and certifications. Core technology development and regulatory approvals.'
              },
              {
                category: 'Marketing & Sales',
                amount: '$166,000',
                percentage: '20%',
                justification: 'Build market awareness and secure early adopters through trade shows, demonstrations, and partnerships.'
              },
              {
                category: 'Operational Setup',
                amount: '$111,000',
                percentage: '13%',
                justification: 'Infrastructure and administrative costs for manufacturing setup and initial operations.'
              }
            ].map((item) => (
              <div key={item.category} className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-[var(--primary)] mb-1">{item.amount}</div>
                  <div className="text-lg font-semibold mb-1">{item.category}</div>
                  <div className="text-[var(--secondary)] font-bold">{item.percentage}</div>
                </div>
                <p className="text-[var(--gray)] text-sm">{item.justification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Assumptions */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Key Assumptions & Risk Mitigation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Market Assumptions</h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li><strong>Target Market:</strong> Government and civilian sectors in Southern Africa</li>
                <li><strong>Growth Trajectory:</strong> Early adopters in Year 1, market confidence by Year 3</li>
                <li><strong>Competitive Advantage:</strong> 20-30% cost advantage over competitors</li>
                <li><strong>Market Penetration:</strong> Focus on government agencies and critical infrastructure</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Risk Mitigation</h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li><strong>Market Adoption:</strong> Partner with government agencies for early validation</li>
                <li><strong>Economic Volatility:</strong> Localize production to reduce import dependencies</li>
                <li><strong>Technology Risk:</strong> Rigorous testing and quality control during R&D</li>
                <li><strong>Regulatory Risk:</strong> Early engagement with regulatory bodies for approvals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>© 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified</p>
          <div className="mt-4">
            <Link href="/" className="text-[var(--primary)] hover:underline mr-6">Home</Link>
            <Link href="/technical" className="text-[var(--primary)] hover:underline mr-6">Technical</Link>
            <Link href="/compliance" className="text-[var(--primary)] hover:underline">Compliance</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
