interface QuickAction {
  icon: string;
  label: string;
  action: () => void;
}

interface QuickActionsWidgetProps {
  actions: QuickAction[];
}

export function QuickActionsWidget({ actions }: QuickActionsWidgetProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-[var(--darker)] border border-[var(--primary)] rounded-lg p-3 shadow-2xl max-w-xs">
        <div className="text-[var(--primary)] font-bold mb-2 text-sm">
          Quick Actions
        </div>
        <div className="space-y-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              type="button"
              className="w-full text-left text-xs text-white hover:text-[var(--primary)] hover:-translate-y-0.5 transform transition py-1 flex items-center gap-2"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
