import * as React from "react";

interface WhitepaperSectionProps {
  title: string;
  children: React.ReactNode;
  sectionNumber?: number;
  totalSections?: number;
}

export default function WhitepaperSection({
  title,
  children,
  sectionNumber,
  totalSections,
}: WhitepaperSectionProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 my-8 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {sectionNumber && totalSections && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Section {sectionNumber} of {totalSections}
          </div>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}

interface WhitepaperAbstractProps {
  children: React.ReactNode;
}

export function WhitepaperAbstract({ children }: WhitepaperAbstractProps): React.ReactElement {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 my-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">Abstract</h3>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}

interface WhitepaperCitationProps {
  authors: string;
  title: string;
  journal?: string;
  year: number;
  url?: string;
}

export function WhitepaperCitation({
  authors,
  title,
  journal,
  year,
  url,
}: WhitepaperCitationProps): React.ReactElement {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded p-4 my-4 border-l-4 border-gray-400">
      <div className="text-sm">
        <div className="font-medium">{authors}</div>
        <div className="italic">"{title}"</div>
        {journal && <div>{journal}</div>}
        <div>{year}</div>
        {url && (
          <div className="mt-2">
            <a href={url} className="text-blue-600 dark:text-blue-400 hover:underline">
              {url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
