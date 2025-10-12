import type { AdaptationItem } from "../components/AdaptationCard";

export interface AdaptationCardData {
  icon: string;
  title: string;
  items: AdaptationItem[];
}

export const adaptationCardsData: AdaptationCardData[] = [
  {
    icon: "🏢",
    title: "Civilian Applications",
    items: [
      {
        title: "Airport Security",
        description: "Perimeter protection, runway monitoring",
      },
      {
        title: "Critical Infrastructure",
        description: "Power plants, water facilities, communication towers",
      },
      {
        title: "Event Security",
        description: "Stadiums, concerts, public gatherings",
      },
    ],
  },
  {
    icon: "🏭",
    title: "Commercial Security",
    items: [
      {
        title: "Corporate Campus",
        description: "Headquarters, R&D facilities",
      },
      {
        title: "Data Center Security",
        description: "Server farms, cloud infrastructure",
      },
      {
        title: "Port Security",
        description: "Shipping terminals, cargo facilities",
      },
    ],
  },
  {
    icon: "🔬",
    title: "Research & Development",
    items: [
      {
        title: "University Partnerships",
        description: "Academic research collaboration",
      },
      {
        title: "Government Labs",
        description: "DARPA, NSF, national laboratories",
      },
      {
        title: "International Cooperation",
        description: "NATO, allied defense research",
      },
    ],
  },
  {
    icon: "⚡",
    title: "Technology Licensing",
    items: [
      {
        title: "Sensor Fusion",
        description: "Core detection algorithms",
      },
      {
        title: "Edge Processing",
        description: "Autonomous decision-making",
      },
      {
        title: "Blockchain Integration",
        description: "Evidence management systems",
      },
    ],
  },
];
