import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "amber";
  trend?: string;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex-between mb-4">
        <div className={`flex-center h-12 w-12 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <ArrowUpRight className="h-4 w-4" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}