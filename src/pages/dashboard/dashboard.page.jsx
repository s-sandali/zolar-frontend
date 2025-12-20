import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataChart from "./components/DataChart";
import { LocationEditor } from "./components/LocationEditor";
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

  console.log(solarUnit);

  const hasLocation = solarUnit?.location?.latitude && solarUnit?.location?.longitude;

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
            <p className="text-sm text-amber-700 mb-4">
              To enable weather insights and optimize your solar energy tracking, please set your solar panel's location.
            </p>
            <LocationEditor solarUnit={solarUnit} />
          </div>
        )}

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chart (takes 2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <DataChart solarUnitId={solarUnit._id} />
          </div>

          {/* Right column - Location editor (takes 1/3 width on large screens) */}
          {hasLocation && (
            <div className="lg:col-span-1">
              <LocationEditor solarUnit={solarUnit} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
