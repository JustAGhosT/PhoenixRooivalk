import * as React from "react";

interface SlideProps {
  title: string;
  children: React.ReactNode;
  slideNumber?: number;
  totalSlides?: number;
}

export default function PitchDeck({
  title,
  children,
  slideNumber,
  totalSlides,
}: SlideProps): React.ReactElement {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 my-8 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {slideNumber && totalSlides && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {slideNumber} / {totalSlides}
          </div>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}

interface PitchDeckSlideProps {
  title: string;
  children: React.ReactNode;
  slideNumber?: number;
  totalSlides?: number;
}

export function PitchDeckSlide({
  title,
  children,
  slideNumber,
  totalSlides,
}: PitchDeckSlideProps): React.ReactElement {
  return (
    <PitchDeck
      title={title}
      slideNumber={slideNumber}
      totalSlides={totalSlides}
    >
      {children}
    </PitchDeck>
  );
}
