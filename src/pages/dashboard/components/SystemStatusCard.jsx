import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bolt, Gauge, Receipt, Zap } from "lucide-react";
import {
  useGetAnomalyStatsQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
  useGetPendingInvoiceCountQuery,
} from "@/lib/redux/query";

const formatStatusLabel = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const formatInstallationDate = (dateLike) => {
  if (!dateLike) return "Pending";
  try {
    return format(new Date(dateLike), "MMM d, yyyy");
  } catch (error) {
    return "Pending";
  }
};

const formatCapacity = (capacity) => {
  if (!capacity && capacity !== 0) return "—";
  const kilowatts = capacity / 1000;
  return `${kilowatts % 1 === 0 ? kilowatts : kilowatts.toFixed(1)} kW`;
};

const formatEnergy = (totalWh) => {
  if (typeof totalWh !== "number") return "—";
  const kwh = totalWh / 1000;
  return `${kwh.toFixed(kwh >= 10 ? 0 : 1)} kWh`;
};

export function SystemStatusCard({ solarUnit, solarUnitId }) {
  const shouldSkip = !solarUnitId;

  const { data: dailyEnergy, isFetching: isFetchingEnergy } =
    useGetEnergyGenerationRecordsBySolarUnitQuery(
      { id: solarUnitId, groupBy: "date", limit: 1 },
      { skip: shouldSkip }
    );

  const { data: anomalyStats, isFetching: isFetchingAnomalyStats } =
    useGetAnomalyStatsQuery(undefined, { skip: shouldSkip });

  const { data: pendingInvoiceData, isFetching: isFetchingInvoices } =
    useGetPendingInvoiceCountQuery(undefined, { skip: shouldSkip });

  const todaysEnergyWh = dailyEnergy?.[0]?.totalEnergy;
  const openAnomalies = anomalyStats?.byStatus?.OPEN || 0;
  const pendingInvoices = pendingInvoiceData?.count ?? 0;

  const status = formatStatusLabel(solarUnit?.status);
  const statusTone = solarUnit?.status === "ACTIVE" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900";

  const statusCopy = solarUnit?.status === "ACTIVE"
    ? "All systems running"
    : "Awaiting maintenance";

  return (
    <Card className="h-full rounded-3xl border border-slate-200/80 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bolt className="w-4 h-4 text-amber-500" />
          System Snapshot
        </CardTitle>
        <CardDescription className="text-xs">
          {solarUnit?.serialNumber || "Serial pending"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
            <p className="text-2xl font-semibold text-slate-900">{status}</p>
            <p className="text-xs text-slate-500">{statusCopy}</p>
          </div>
          <Badge className={`text-xs ${statusTone}`} variant="secondary">
            {solarUnit?.status || "UNKNOWN"}
          </Badge>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Capacity</dt>
            <dd className="text-lg font-semibold text-slate-900">{formatCapacity(solarUnit?.capacity)}</dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Installed</dt>
            <dd className="text-lg font-semibold text-slate-900">{formatInstallationDate(solarUnit?.installationDate)}</dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Today's generation</p>
            <Gauge className="w-4 h-4 text-slate-300" />
          </div>
          <p className="mt-2 text-4xl font-semibold">
            {formatEnergy(todaysEnergyWh)}
          </p>
          <p className="text-xs text-slate-300">
            {isFetchingEnergy ? "Updating..." : "Midnight to now"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-100 bg-white/90 p-3 space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-500 uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Alerts
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {isFetchingAnomalyStats ? "…" : openAnomalies}
            </p>
            <p className="text-xs text-slate-500">Open anomalies</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white/90 p-3 space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-500 uppercase">
              <Receipt className="w-3.5 h-3.5 text-blue-500" /> Billing
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {isFetchingInvoices ? "…" : pendingInvoices}
            </p>
            <p className="text-xs text-slate-500">Pending invoices</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
          <Zap className="w-4 h-4 text-amber-500" />
          <p className="leading-snug">
            Keep your profile details accurate to unlock precise weather and billing insights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
