import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, toDate } from "date-fns";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const DataChart = ({ solarUnitId }) => {
  const [selectedRange, setSelectedRange] = useState("7");

  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: parseInt(selectedRange),
    });

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  if (isLoading) return null;

  if (!data || isError) {
    return null;
  }

  const lastSelectedRangeDaysEnergyProduction = data
    .slice(0, parseInt(selectedRange))
    .map((el) => {
      return {
        date: format(toDate(el._id.date), "MMM d"),
        energy: el.totalEnergy,
      };
    });

  const chartConfig = {
    energy: {
      label: "Energy (kWh)",
      color: "oklch(54.6% 0.245 262.881)",
    },
  };

  const title = "Energy Production Chart";

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">Actual generation grouped by day</p>
        </div>
        <Select value={selectedRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-[150px] border-slate-200 bg-white/70">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={lastSelectedRangeDaysEnergyProduction}
            margin={{
              left: 40,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tick={false}
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickCount={10}
              label={{ value: "kWh", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="energy"
              type="natural"
              fill="var(--color-energy)"
              fillOpacity={0.4}
              stroke="var(--color-energy)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default DataChart;
