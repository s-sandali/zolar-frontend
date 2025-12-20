import { useGetWeatherBySolarUnitQuery } from "@/lib/redux/query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Sun, Wind, Thermometer, Gauge, AlertCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getWeatherGradient = (condition, score) => {
  // Return gradient based on weather condition and score
  if (score >= 80) {
    // Excellent - Sunny yellow/orange gradient
    return "bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100";
  } else if (score >= 60) {
    // Good - Light blue gradient
    return "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50";
  } else if (score >= 40) {
    // Moderate - Gray/blue gradient
    return "bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50";
  } else if (score >= 20) {
    // Poor - Darker gray gradient
    return "bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200";
  } else {
    // Very Poor - Dark gradient
    return "bg-gradient-to-br from-slate-200 via-gray-200 to-slate-300";
  }
};

const getWeatherIcon = (condition, score) => {
  const iconClass = "w-24 h-24 opacity-10 absolute";

  if (score >= 80) {
    return <Sun className={`${iconClass} text-yellow-400 top-4 right-4 animate-pulse`} />;
  } else if (condition === "Rainy" || condition === "Heavy Rain") {
    return <CloudRain className={`${iconClass} text-blue-400 top-4 right-4`} />;
  } else {
    return <Cloud className={`${iconClass} text-gray-400 top-4 right-4`} />;
  }
};

const getRatingColor = (rating) => {
  switch (rating) {
    case "Excellent":
      return "text-green-600 bg-green-50 border-green-200";
    case "Good":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "Moderate":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "Poor":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "Very Poor":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  if (score >= 20) return "text-orange-600";
  return "text-red-600";
};

export function WeatherWidget({ solarUnitId }) {
  // Poll for weather updates every 10 minutes (600000 ms)
  const { data: weather, isLoading, isError, error, refetch } = useGetWeatherBySolarUnitQuery(solarUnitId, {
    pollingInterval: 600000, // 10 minutes
    refetchOnMountOrArgChange: true, // Refetch when component mounts
  });

  console.log("WeatherWidget - solarUnitId:", solarUnitId);
  console.log("WeatherWidget - isLoading:", isLoading);
  console.log("WeatherWidget - isError:", isError);
  console.log("WeatherWidget - error:", error);
  console.log("WeatherWidget - weather:", weather);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weather & Solar Impact</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weather & Solar Impact</CardTitle>
          <CardDescription>Unable to load weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error?.data?.message || "Failed to fetch weather data"}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, solarImpact, location } = weather;
  const gradientClass = getWeatherGradient(current.condition, solarImpact.score);
  const weatherIcon = getWeatherIcon(current.condition, solarImpact.score);
  const ratingColorClass = getRatingColor(solarImpact.rating);
  const scoreColorClass = getScoreColor(solarImpact.score);

  return (
    <Card className={`h-full relative overflow-hidden ${gradientClass}`}>
      {/* Animated Weather Icon Background */}
      <div className="absolute inset-0 pointer-events-none">
        {weatherIcon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Weather & Solar Impact
              </CardTitle>
              <CardDescription className="mt-1">
                {location.city || "Current Location"} • Updated {formatDistanceToNow(new Date(weather.timestamp), { addSuffix: true })}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="h-8 w-8 p-0"
              title="Refresh weather data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Solar Impact Score */}
          <div className={`border rounded-lg p-4 ${ratingColorClass}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Solar Impact Score</span>
              <span className={`text-2xl font-bold ${scoreColorClass}`}>
                {solarImpact.score}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-semibold">{solarImpact.rating}</span>
            </div>
            <p className="text-xs mt-2">{solarImpact.insight}</p>
          </div>

          {/* Current Weather Conditions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Current Conditions</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Cloud Cover</p>
                  <p className="font-medium">{current.cloudCover}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-medium">{current.temperature}°C</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CloudRain className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Precipitation</p>
                  <p className="font-medium">{current.precipitation} mm</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                  <p className="font-medium">{current.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-md">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Solar Irradiance</p>
                <p className="font-medium">{current.solarIrradiance} W/m²</p>
              </div>
            </div>
          </div>

          {/* Impact Breakdown */}
          {solarImpact.breakdown && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Impact Breakdown</h4>
              <div className="space-y-1 text-xs">
                {solarImpact.breakdown.cloudImpact !== 0 && (
                  <div className="flex justify-between">
                    <span>Cloud Impact:</span>
                    <span className={solarImpact.breakdown.cloudImpact < 0 ? "text-red-600" : "text-green-600"}>
                      {solarImpact.breakdown.cloudImpact > 0 ? "+" : ""}{solarImpact.breakdown.cloudImpact}
                    </span>
                  </div>
                )}
                {solarImpact.breakdown.rainImpact !== 0 && (
                  <div className="flex justify-between">
                    <span>Rain Impact:</span>
                    <span className={solarImpact.breakdown.rainImpact < 0 ? "text-red-600" : "text-green-600"}>
                      {solarImpact.breakdown.rainImpact > 0 ? "+" : ""}{solarImpact.breakdown.rainImpact}
                    </span>
                  </div>
                )}
                {solarImpact.breakdown.irradianceBoost !== 0 && (
                  <div className="flex justify-between">
                    <span>Irradiance Boost:</span>
                    <span className={solarImpact.breakdown.irradianceBoost < 0 ? "text-red-600" : "text-green-600"}>
                      {solarImpact.breakdown.irradianceBoost > 0 ? "+" : ""}{solarImpact.breakdown.irradianceBoost}
                    </span>
                  </div>
                )}
                {solarImpact.breakdown.tempImpact !== 0 && (
                  <div className="flex justify-between">
                    <span>Temperature Impact:</span>
                    <span className={solarImpact.breakdown.tempImpact < 0 ? "text-red-600" : "text-green-600"}>
                      {solarImpact.breakdown.tempImpact > 0 ? "+" : ""}{solarImpact.breakdown.tempImpact}
                    </span>
                  </div>
                )}
                {solarImpact.breakdown.windBoost !== 0 && (
                  <div className="flex justify-between">
                    <span>Wind Cooling Boost:</span>
                    <span className={solarImpact.breakdown.windBoost < 0 ? "text-red-600" : "text-green-600"}>
                      {solarImpact.breakdown.windBoost > 0 ? "+" : ""}{solarImpact.breakdown.windBoost}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
