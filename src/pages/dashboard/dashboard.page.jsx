import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataChart from "./components/DataChart";
import { LocationEditor } from "./components/LocationEditor";
import { WeatherWidget } from "./components/WeatherWidget";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { useUser } from "@clerk/clerk-react";
import { MapPin } from "lucide-react";

const DashboardPage = () => {
  const { user, isLoaded } = useUser();

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

  if (isLoadingSolarUnit) {
    return <div>Loading...</div>;
  }

  if (isErrorSolarUnit) {
    return <div>Error: {errorSolarUnit.message}</div>;
  }

  console.log("Solar Unit Data:", solarUnit);
  console.log("Location:", solarUnit?.location);

  const hasLocation = solarUnit?.location?.latitude && solarUnit?.location?.longitude;

  console.log("Has Location:", hasLocation);

  return (
    <main className="mt-4">
      <h1 className="text-4xl font-bold text-foreground">{user?.firstName}'s House</h1>
      <p className="text-gray-600 mt-2">
        Welcome back to your Solar Energy Production Dashboard
      </p>

      <div className="mt-8 space-y-6">
        {/* Show location editor prominently if location is not set */}
        {!hasLocation && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-amber-900" />
              <h2 className="text-lg font-semibold text-amber-900">
                Set Your Location
              </h2>
            </div>
            <p className="text-sm text-amber-700">
              Add your array's coordinates below to unlock precise weather predictions and solar insights.
            </p>
          </div>
        )}

        <div className={`grid gap-6 ${hasLocation ? "lg:grid-cols-3" : "grid-cols-1"}`}>
          {hasLocation && (
            <div className="lg:col-span-2">
              <WeatherWidget solarUnitId={solarUnit._id} />
            </div>
          )}
          <SystemStatusCard solarUnit={solarUnit} solarUnitId={solarUnit._id} />
        </div>

        <div className={`grid gap-6 ${hasLocation ? "lg:grid-cols-3" : "grid-cols-1"}`}>
          <div className={hasLocation ? "lg:col-span-2" : ""}>
            <DataChart solarUnitId={solarUnit._id} />
          </div>
          <LocationEditor solarUnit={solarUnit} />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
