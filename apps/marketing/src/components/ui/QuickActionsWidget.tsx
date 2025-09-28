import { downloadWhitepaper } from '../../utils/downloadWhitepaper';

const quickActions = [
  {
    icon: '📋',
    label: 'Technical Specs',
    action: () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Technical%20Specifications%20Request',
  },
  {
    icon: '💰',
    label: 'Pricing & ROI',
    action: () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Pricing%20and%20ROI%20Information',
  },
  {
    icon: '🎯',
    label: 'Live Demo',
    action: () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Live%20Demonstration%20Request',
  },
  {
    icon: '📄',
    label: 'Whitepaper',
    action: downloadWhitepaper,
  },
];

export function QuickActionsWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-[var(--darker)] border border-[var(--primary)] rounded-lg p-3 shadow-2xl max-w-xs">
        <div className="text-[var(--primary)] font-bold mb-2 text-sm">Quick Actions</div>
        <div className="space-y-1">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-full text-left text-xs text-white hover:text-[var(--primary)] transition py-1 flex items-center gap-2"
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
