import React from 'react';
import { Button } from '../ui/button';
import { downloadWhitepaper } from '@/utils/downloadWhitepaper';
import { RevealSection } from '@/components/RevealSection';

export const ContactSection: React.FC = () => {
  return (
    <section
      className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]"
      id="contact"
    >
      <RevealSection className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Deploy?</h2>
        <p className="text-[var(--gray)] mb-6 max-w-2xl mx-auto">
          Schedule a technical demonstration or request detailed specifications for your defense requirements.
        </p>
        <div className="mt-6 flex gap-4 animate-fadeInUp [animation-delay:600ms]">
          <Button href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Technical%20Demo" size="lg">
            Schedule Technical Demo
          </Button>
          <Button onClick={downloadWhitepaper} variant="outline" size="lg">
            Download Whitepaper
          </Button>
        </div>
      </RevealSection>
    </section>
  );
};
