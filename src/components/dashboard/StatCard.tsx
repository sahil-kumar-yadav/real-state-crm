import { FiArrowUpRight as ArrowUpRight } from "react-icons/fi";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "amber";
  trend?: string;
}

const colorConfig = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    icon: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    shadow: "shadow-blue-200/50",
    trend: "text-blue-600"
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    icon: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    shadow: "shadow-green-200/50",
    trend: "text-green-600"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    icon: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    shadow: "shadow-purple-200/50",
    trend: "text-purple-600"
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100",
    icon: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
    shadow: "shadow-amber-200/50",
    trend: "text-amber-600"
  },
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: StatCardProps) {
  const config = colorConfig[color];
  
  return (
    <div className={`${config.bg} rounded-xl border border-white/50 shadow-lg ${config.shadow} p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex-between mb-4">
        <div className={`flex-center h-14 w-14 rounded-lg ${config.icon} shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${config.trend}`}>
            <ArrowUpRight className="h-5 w-5" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-current to-transparent opacity-30"></div>
    </div>
  );
}