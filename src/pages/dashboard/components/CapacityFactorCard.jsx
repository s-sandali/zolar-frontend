import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCapacityFactorQuery } from "@/lib/redux/query";

const RANGE_OPTIONS = ["7", "14", "30"];

const round = (value, digits = 1) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const CapacityFactorCard = ({ solarUnitId }) => {
  const [selectedRange, setSelectedRange] = useState("14");
  const shouldSkip = !solarUnitId;

  const { data, isFetching, isError } = useGetCapacityFactorQuery(
    { solarUnitId, days: Number(selectedRange) },
    { skip: shouldSkip }
  );

  const chartData = useMemo(() => {
    if (!data?.buckets?.length) return [];
    return data.buckets.map((bucket) => ({
      hour: bucket.label,
      factor: round(bucket.factor),
      actual: bucket.actualKwh,
      theoretical: bucket.theoreticalKwh,
    }));
  }, [data]);

  const summary = {
    average: round(data?.averageFactor ?? 0),
    utilization: round(data?.utilization ?? 0, 0),
    bestHour: data?.bestHour || null,
    lowestHour: data?.lowestHour || null,
  };

  const chartConfig = {
    factor: {
      label: "Capacity factor",
      color: "hsl(var(--chart-1))",
    },
  };

  const renderEmptyState = !isFetching && (!chartData.length || isError);

  return (
    <Card className="h-full rounded-3xl border border-slate-200/80 bg-card/95 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Capacity Factor</CardTitle>
          <CardDescription className="text-xs">
            Actual output vs theoretical maximum by hour (UTC)
          </CardDescription>
        </div>
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="mt-3 w-32 rounded-2xl border border-border/60 bg-card/80">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                Last {option} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Average Factor</p>
            <p className="text-2xl font-semibold">{summary.average}%</p>
            <Badge variant="outline" className="mt-2 border-transparent bg-blue-500/15 text-blue-700">
              Utilization {summary.utilization}%
            </Badge>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Best Hour</p>
            <p className="text-2xl font-semibold">
              {summary.bestHour ? `${summary.bestHour.factor}%` : "—"}
            </p>
            <Badge variant="outline" className="mt-2 border-transparent bg-emerald-500/15 text-emerald-700">
              {summary.bestHour?.label || "No data"}
            </Badge>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Lowest Hour</p>
            <p className="text-2xl font-semibold text-amber-600">
              {summary.lowestHour ? `${summary.lowestHour.factor}%` : "—"}
            </p>
            <Badge variant="outline" className="mt-2 border-transparent bg-amber-500/10 text-amber-700">
              {summary.lowestHour?.label || "Stable"}
            </Badge>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Range</p>
            <p className="text-2xl font-semibold">Last {data?.rangeDays ?? selectedRange}d</p>
            <Badge variant="outline" className="mt-2 border-transparent bg-slate-500/10 text-slate-700">
              {chartData.length} hrs sampled
            </Badge>
          </div>
        </div>

        {renderEmptyState ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/70 text-center text-sm text-muted-foreground">
            <p>No recent production data.</p>
            <p className="text-xs">Try syncing energy records or expanding the range.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _, item) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">{chartConfig[item.dataKey]?.label}</span>
                        <span className="text-right font-mono text-sm font-semibold">
                          {round(value ?? 0)}%
                          <span className="block text-[10px] font-normal text-muted-foreground">
                            {round(item.payload.actual ?? 0, 2)} / {round(item.payload.theoretical ?? 0, 2)} kWh
                          </span>
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="factor" radius={[4, 4, 0, 0]} fill="var(--color-factor)" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
