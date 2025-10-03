import * as React from "react";

interface TechnicalHighlightProps {
  title: string;
  children: React.ReactNode;
  type?: "success" | "warning" | "info" | "danger";
  icon?: string;
}

export default function TechnicalHighlight({
  title,
  children,
  type = "info",
  icon = "💡",
}: TechnicalHighlightProps): React.ReactElement {
  const typeStyles = {
    success: "border-green-500 bg-green-50 dark:bg-green-900/20",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    info: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    danger: "border-red-500 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 my-4 ${typeStyles[type]}`}>
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{icon}</span>
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}
