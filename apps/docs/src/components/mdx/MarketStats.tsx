import * as React from "react";

interface StatItem {
  label: string;
  value: string;
  description?: string;
}

interface MarketStatsProps {
  title: string;
  stats: StatItem[];
  source?: string;
}

export default function MarketStats({
  title,
  stats,
  source,
}: MarketStatsProps): React.ReactElement {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 my-6">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
      {source && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Source: {source}
        </div>
      )}
    </div>
  );
}
