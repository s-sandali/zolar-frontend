import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useGetPeakDistributionQuery } from "@/lib/redux/query";

const RANGE_OPTIONS = ["7", "14", "30"];

const formatWhToKwh = (wh) => {
  if (typeof wh !== "number") return 0;
  return +(wh / 1000).toFixed(1);
};

const formatLabelDate = (isoDate) => {
  try {
    return format(new Date(isoDate), "MMM d");
  } catch (error) {
    return isoDate;
  }
};

export const PeakDistributionCard = ({ solarUnitId }) => {
  const [selectedRange, setSelectedRange] = useState("14");
  const shouldSkip = !solarUnitId;

  const { data, isFetching, isError } = useGetPeakDistributionQuery(
    { solarUnitId, days: Number(selectedRange) },
    { skip: shouldSkip }
  );

  const chartData = useMemo(() => {
    if (!data?.daily?.length) return [];
    return data.daily.map((day) => {
      const rawShare = typeof day.peakShare === "number" ? day.peakShare : 0;
      const peakShare = Math.min(Math.max(rawShare, 0), 100);
      let dateFullLabel = day.date;

      try {
        dateFullLabel = format(new Date(day.date), "MMM d, yyyy");
      } catch (error) {
        dateFullLabel = day.date;
      }

      return {
        date: formatLabelDate(day.date),
        dateFull: dateFullLabel,
        peak: formatWhToKwh(day.peakWh),
        offPeak: formatWhToKwh(day.offPeakWh),
        peakShare,
        offPeakShare: Math.max(0, 100 - peakShare),
      };
    });
  }, [data]);

  const totals = {
    peak: formatWhToKwh(data?.totals?.peakWh ?? 0),
    offPeak: formatWhToKwh(data?.totals?.offPeakWh ?? 0),
    share: data?.totals?.peakShare ?? 0,
  };

  const chartConfig = {
    peakShare: {
      label: "Peak share",
      color: "oklch(0.74 0.12 150)",
    },
    offPeakShare: {
      label: "Off-peak share",
      color: "oklch(0.83 0.16 80)",
    },
  };

  const tooltipFormatter = (value, _, item) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
    const energyKey = item.dataKey === "peakShare" ? "peak" : "offPeak";
    const energyValue = item.payload?.[energyKey] ?? 0;

    return (
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-muted-foreground">
          {chartConfig[item.dataKey]?.label || item.name}
        </span>
        <span className="text-right font-mono text-sm font-semibold">
          {numericValue.toFixed(1)}%
          <span className="block text-[10px] font-normal text-muted-foreground">
            {typeof energyValue === "number" ? energyValue.toFixed(1) : energyValue} kWh
          </span>
        </span>
      </div>
    );
  };

  const tooltipLabelFormatter = (_, payload) => {
    const [first] = payload || [];
    return first?.payload?.dateFull || first?.payload?.date || "";
  };

  const renderEmptyState = !isFetching && (!chartData.length || isError);

  return (
    <Card className="h-full rounded-3xl border border-slate-200/80 bg-card/95 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Peak Mix</CardTitle>
          <CardDescription className="text-xs">Peak vs off-peak energy blend</CardDescription>
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Peak energy</p>
            <p className="text-2xl font-semibold">{totals.peak} kWh</p>
            <Badge variant="outline" className="mt-2 border-transparent bg-emerald-500/15 text-emerald-700">
              {totals.share}% share
            </Badge>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Off-peak energy</p>
            <p className="text-2xl font-semibold">{totals.offPeak} kWh</p>
            <Badge variant="outline" className="mt-2 border-amber-500/40 bg-amber-500/10 text-amber-700">
              {100 - totals.share}% share
            </Badge>
          </div>
        </div>

        {renderEmptyState ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/70 text-center text-sm text-muted-foreground">
            <p>No recent energy segments to display.</p>
            <p className="text-xs">Try expanding the date range.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-square min-h-[260px]">
            <RadialBarChart
              data={chartData}
              innerRadius="36%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              barCategoryGap="12%"
            >
              <PolarGrid radialLines={false} className="stroke-border/40" />
              <PolarRadiusAxis tick={false} axisLine={false} angleAxisId={0} domain={[0, 100]} />
              <PolarAngleAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 11 }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
              <RadialBar
                dataKey="offPeakShare"
                stackId="shares"
                cornerRadius={8}
                fill="var(--color-offPeakShare)"
                background
              />
              <RadialBar
                dataKey="peakShare"
                stackId="shares"
                cornerRadius={8}
                fill="var(--color-peakShare)"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
