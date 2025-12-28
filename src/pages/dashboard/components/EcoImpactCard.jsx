import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";
import { Leaf, SunMedium, Trees } from "lucide-react";

const ENERGY_WINDOW_DAYS = 30;
const CO2_PER_KWH_KG = 0.85; // kg of CO2 avoided per kWh vs fossil grid average
const TREE_ABSORPTION_KG_PER_YEAR = 21.77; // USDA estimate per mature tree per year

const formatNumber = (value, options = {}) => {
  const { digits = 0, compact = false } = options;
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    notation: compact ? "compact" : "standard",
  }).format(value);
};

export const EcoImpactCard = ({ solarUnitId }) => {
  const shouldSkip = !solarUnitId;

  const { data, isFetching, isError } = useGetEnergyGenerationRecordsBySolarUnitQuery(
    { id: solarUnitId, groupBy: "date", limit: ENERGY_WINDOW_DAYS },
    { skip: shouldSkip }
  );

  const stats = useMemo(() => {
    if (!data?.length) {
      return {
        totalEnergyKwh: 0,
        avgDailyKwh: 0,
        co2SavedKg: 0,
        treesEquivalent: 0,
      };
    }

    const totalEnergyKwh = data.reduce((sum, bucket) => sum + (Number(bucket.totalEnergy) || 0), 0);
    const avgDailyKwh = totalEnergyKwh / ENERGY_WINDOW_DAYS;
    const co2SavedKg = totalEnergyKwh * CO2_PER_KWH_KG;
    const treesEquivalent = co2SavedKg / TREE_ABSORPTION_KG_PER_YEAR;

    return { totalEnergyKwh, avgDailyKwh, co2SavedKg, treesEquivalent };
  }, [data]);

  const metricBlocks = [
    {
      label: "CO2 Saved",
      value: `${formatNumber(stats.co2SavedKg, { digits: stats.co2SavedKg >= 1000 ? 0 : 1 })} kg`,
      hint: "vs fossil grid",
      icon: Leaf,
      accent: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Tree Offset",
      value: formatNumber(stats.treesEquivalent, { digits: stats.treesEquivalent >= 10 ? 0 : 1 }),
      hint: "annual absorption",
      icon: Trees,
      accent: "text-green-700 bg-green-100",
    },
  ];

  const showPlaceholder = (isFetching || isError) && !data?.length;

  return (
    <Card className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50 to-white shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-emerald-900">Eco Impact</CardTitle>
              <CardDescription className="text-xs text-emerald-700">
                Based on last {ENERGY_WINDOW_DAYS} days of production
              </CardDescription>
            </div>
            <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-800">
              {stats.avgDailyKwh ? `${formatNumber(stats.avgDailyKwh, { digits: 1 })} kWh avg/day` : "Awaiting data"}
            </span>
          </div>
          <p className="text-xs text-emerald-600/90">
            Translates your recent generation into real-world environmental wins.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-emerald-900">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-500">Energy captured</p>
            <p className="text-3xl font-semibold">{formatNumber(stats.totalEnergyKwh, { digits: 0 })} kWh</p>
            <p className="text-xs text-emerald-600">Window: {ENERGY_WINDOW_DAYS} days</p>
          </div>
          <div className="rounded-2xl bg-emerald-100/80 p-3 text-emerald-700">
            <SunMedium className="h-7 w-7" />
          </div>
        </div>

        {showPlaceholder ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {metricBlocks.map(({ label, value, hint, icon: Icon, accent }) => (
              <div key={label} className="rounded-2xl border border-slate-100 bg-white/85 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${accent}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{hint}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
