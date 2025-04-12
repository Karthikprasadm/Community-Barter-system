
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Package, Users, BarChart3, Repeat } from "lucide-react";

interface StatisticProps {
  title: string;
  value: string | number;
  description: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ReactNode;
}

export const Statistic = ({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
}: StatisticProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div className="mt-2 flex items-center text-xs">
            {trend === "up" ? (
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
            ) : trend === "down" ? (
              <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
            ) : null}
            <span
              className={
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : ""
              }
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const StatisticsGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Statistic
        title="Total Items"
        value="156"
        description="Total available items for trade"
        trend="up"
        trendValue="12% from last month"
        icon={<Package className="h-4 w-4" />}
      />
      <Statistic
        title="Active Users"
        value="78"
        description="Users active in the last 7 days"
        trend="up"
        trendValue="9% from last week"
        icon={<Users className="h-4 w-4" />}
      />
      <Statistic
        title="Trades Completed"
        value="43"
        description="Successful trades this month"
        trend="up"
        trendValue="24% from last month"
        icon={<Repeat className="h-4 w-4" />}
      />
      <Statistic
        title="Avg. User Rating"
        value="4.7"
        description="Average user reputation score"
        trend="neutral"
        trendValue="No change"
        icon={<BarChart3 className="h-4 w-4" />}
      />
    </div>
  );
};
