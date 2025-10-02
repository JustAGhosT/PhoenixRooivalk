import * as React from "react";

interface SpecItem {
  category: string;
  specifications: Array<{
    name: string;
    value: string;
    description?: string;
  }>;
}

interface TechnicalSpecsProps {
  title: string;
  specs: SpecItem[];
}

export default function TechnicalSpecs({
  title,
  specs,
}: TechnicalSpecsProps): React.ReactElement {
  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {specs.map((spec, index) => (
        <div key={index} className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
            {spec.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.specifications.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
