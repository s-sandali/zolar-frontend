import { useGetWeatherBySolarUnitQuery } from "@/lib/redux/query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Sun, Wind, Thermometer, Gauge, AlertCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const WEATHER_IMAGES = {
  sunny: "/assets/images/sunny.jpg",
  rainy: "/assets/images/rainy.jpg",
  cloudy: "/assets/images/cloudy.jpg",
  night: "/assets/images/night.jpg",
};

const getWeatherGradient = (condition, score, isDay) => {
  // Nighttime - use dark gradient
  if (!isDay) {
    return "bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900";
  }

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

const getWeatherBackground = (condition, score, isDay) => {
  // If it's nighttime, always show night background
  if (!isDay) {
    return WEATHER_IMAGES.night;
  }

  const normalizedCondition = condition?.toLowerCase() || "";

  if (score >= 80 || normalizedCondition.includes("sun") || normalizedCondition.includes("clear")) {
    return WEATHER_IMAGES.sunny;
  }

  if (
    normalizedCondition.includes("rain") ||
    normalizedCondition.includes("storm") ||
    normalizedCondition.includes("drizzle")
  ) {
    return WEATHER_IMAGES.rainy;
  }

  return WEATHER_IMAGES.cloudy;
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
  const isDay = current.isDay !== false; // Default to true if undefined for backwards compatibility
  const gradientClass = getWeatherGradient(current.condition, solarImpact.score, isDay);
  const weatherBackground = getWeatherBackground(current.condition, solarImpact.score, isDay);
  const ratingColorClass = getRatingColor(solarImpact.rating);
  const scoreColorClass = getScoreColor(solarImpact.score);

  return (
    <Card className={`h-full relative overflow-hidden ${gradientClass}`}>
      {/* Weather Background */}
      <div className="absolute inset-0 pointer-events-none">
        {weatherBackground && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${weatherBackground})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-white/60" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`flex items-center gap-2 ${!isDay ? "text-slate-100" : ""}`}>
                <Sun className="w-5 h-5" />
                Weather & Solar Impact
              </CardTitle>
              <CardDescription className={`mt-1 ${!isDay ? "text-slate-300" : ""}`}>
                {location.city || "Current Location"} • Updated {formatDistanceToNow(new Date(weather.timestamp), { addSuffix: true })}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className={`h-8 w-8 p-0 ${!isDay ? "text-slate-300 hover:text-slate-100 hover:bg-slate-700" : ""}`}
              title="Refresh weather data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Solar Impact Score */}
          <div className={`border rounded-lg p-4 ${!isDay ? "text-white bg-slate-800/60 border-slate-600" : ratingColorClass}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Solar Impact Score</span>
              {!isDay ? (
                <span className="text-sm font-medium text-slate-300">N/A</span>
              ) : (
                <span className={`text-2xl font-bold ${scoreColorClass}`}>
                  {solarImpact.score}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-semibold">{!isDay ? "Nighttime" : solarImpact.rating}</span>
            </div>
            <p className="text-xs mt-2">
              {!isDay
                ? "No solar power generation during nighttime. Power generation will resume at sunrise."
                : solarImpact.insight
              }
            </p>
          </div>

          {/* Current Weather Conditions */}
          <div className="space-y-3">
            <h4 className={`text-sm font-semibold ${!isDay ? "text-slate-300" : "text-muted-foreground"}`}>Current Conditions</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Cloud className={`w-4 h-4 ${!isDay ? "text-slate-400" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs ${!isDay ? "text-slate-400" : "text-muted-foreground"}`}>Cloud Cover</p>
                  <p className={`font-medium ${!isDay ? "text-slate-200" : ""}`}>{current.cloudCover}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Thermometer className={`w-4 h-4 ${!isDay ? "text-slate-400" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs ${!isDay ? "text-slate-400" : "text-muted-foreground"}`}>Temperature</p>
                  <p className={`font-medium ${!isDay ? "text-slate-200" : ""}`}>{current.temperature}°C</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CloudRain className={`w-4 h-4 ${!isDay ? "text-slate-400" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs ${!isDay ? "text-slate-400" : "text-muted-foreground"}`}>Precipitation</p>
                  <p className={`font-medium ${!isDay ? "text-slate-200" : ""}`}>{current.precipitation} mm</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Wind className={`w-4 h-4 ${!isDay ? "text-slate-400" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-xs ${!isDay ? "text-slate-400" : "text-muted-foreground"}`}>Wind Speed</p>
                  <p className={`font-medium ${!isDay ? "text-slate-200" : ""}`}>{current.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-sm p-3 rounded-md ${!isDay ? "bg-slate-800/60 border border-slate-600" : "bg-muted"}`}>
              <Sun className={`w-4 h-4 ${!isDay ? "text-slate-400" : "text-muted-foreground"}`} />
              <div>
                <p className={`text-xs ${!isDay ? "text-slate-400" : "text-muted-foreground"}`}>Solar Irradiance</p>
                <p className={`font-medium ${!isDay ? "text-slate-200" : ""}`}>{current.solarIrradiance} W/m²</p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
