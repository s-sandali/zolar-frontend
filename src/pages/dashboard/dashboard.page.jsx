import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataChart from "./components/DataChart";
import { LocationEditor } from "./components/LocationEditor";
import { WeatherWidget } from "./components/WeatherWidget";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { CapacityFactorCard } from "./components/CapacityFactorCard";
import { EcoImpactCard } from "./components/EcoImpactCard";
import { useUser } from "@clerk/clerk-react";
import { MapPin } from "lucide-react";

const DashboardPage = () => {
  const { user } = useUser();

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

  if (isLoadingSolarUnit) {
    return <div className="mt-10 text-center text-muted-foreground">Loading your dashboard…</div>;
  }

  if (isErrorSolarUnit) {
    return <div className="mt-10 text-center text-destructive">Error: {errorSolarUnit.message}</div>;
  }

  const hasLocation = Boolean(solarUnit?.location?.latitude && solarUnit?.location?.longitude);
  const capacityKw = solarUnit?.capacity ? (solarUnit.capacity / 1000).toFixed(1) : "—";
  const statusLabel = solarUnit?.status || "Unknown";

  return (
    <main className="mt-4 space-y-8 pb-12">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-slate-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{user?.firstName}'s Solar Hub</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Monitor production, weather, and system health from a single, calming command center.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Capacity</p>
              <p className="text-2xl font-semibold text-white">{capacityKw} kW</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Status</p>
              <p className="text-2xl font-semibold text-white">{statusLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {!hasLocation && (
        <section className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-900">
            <MapPin className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Set Your Array Location</h2>
          </div>
          <p className="mt-2 text-sm text-amber-900/80">
            We need your coordinates once to unlock hyperlocal forecasts. Scroll to the location card below to finish setup.
          </p>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeatherWidget solarUnitId={solarUnit._id} />
        </div>
        <SystemStatusCard solarUnit={solarUnit} solarUnitId={solarUnit._id} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataChart solarUnitId={solarUnit._id} />
        </div>
        <CapacityFactorCard solarUnitId={solarUnit._id} />
      </section>

      <section id="location-settings" className="grid gap-6 lg:grid-cols-2">
        <LocationEditor solarUnit={solarUnit} />
        <EcoImpactCard solarUnitId={solarUnit._id} />
      </section>
    </main>
  );
};
export default DashboardPage;
