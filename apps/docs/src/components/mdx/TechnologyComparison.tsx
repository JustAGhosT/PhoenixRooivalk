import * as React from "react";

interface ComparisonRow {
  feature: string;
  phoenix: string | boolean;
  competitor1: string | boolean;
  competitor2: string | boolean;
  competitor3: string | boolean;
}

interface TechnologyComparisonProps {
  title: string;
  competitors: string[];
  rows: ComparisonRow[];
}

export default function TechnologyComparison({
  title,
  competitors,
  rows,
}: TechnologyComparisonProps): React.ReactElement {
  const renderValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <span className="text-green-600 dark:text-green-400">✓</span>
      ) : (
        <span className="text-red-600 dark:text-red-400">✗</span>
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  return (
    <div className="overflow-x-auto my-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Feature
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-blue-600 dark:text-blue-400">
              Phoenix Rooivalk
            </th>
            {competitors.map((competitor, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {competitor}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                {row.feature}
              </td>
              <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
                {renderValue(row.phoenix)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {renderValue(row.competitor1)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {renderValue(row.competitor2)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {renderValue(row.competitor3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
