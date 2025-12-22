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

const getWeatherTheme = (_score, isDay) => {
  const baseText = isDay ? "text-slate-900" : "text-slate-50";
  const mutedText = isDay ? "text-slate-600" : "text-slate-300";
  const panel = isDay
    ? "bg-white/85 backdrop-blur-xl border border-white/70 shadow-lg"
    : "bg-slate-950/65 backdrop-blur-xl border border-white/10 shadow-2xl";

  const chip = isDay ? "bg-slate-900/5 text-slate-900" : "bg-white/15 text-white";

  return {
    baseText,
    mutedText,
    panel,
    chip,
    overlay: isDay ? "bg-white/60" : "bg-slate-950/75",
  };
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
  const theme = getWeatherTheme(solarImpact.score, isDay);
  const ratingBadgeClass = !isDay ? "border border-white/40 text-white" : `border ${ratingColorClass}`;

  return (
    <Card className={`h-full min-h-[420px] relative overflow-hidden border-0 shadow-xl ${gradientClass}`}>
      {/* Weather Background */}
      <div className="absolute inset-0 pointer-events-none">
        {weatherBackground && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${weatherBackground})` }}
            aria-hidden="true"
          />
        )}
        <div className={`absolute inset-0 ${theme.overlay}`} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className={`flex items-center gap-2 text-base tracking-tight ${theme.baseText}`}>
                <Sun className="w-5 h-5" />
                Weather & Solar Impact
              </CardTitle>
              <CardDescription className={`mt-1 ${theme.mutedText}`}>
                {location.city || "Current Location"} • Updated {formatDistanceToNow(new Date(weather.timestamp), { addSuffix: true })}
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => refetch()}
              className={`h-9 w-9 rounded-full border border-white/30 bg-white/20 text-white hover:bg-white/40 ${!isDay ? "backdrop-blur" : "text-slate-700 border-slate-200"}`}
              title="Refresh weather data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-0">
          <section className={`rounded-2xl p-5 transition-all ${theme.panel}`}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className={`text-xs uppercase tracking-[0.3em] ${theme.mutedText}`}>
                  Now in {location.city || "current location"}
                </p>
                <p className={`text-5xl font-semibold leading-tight ${theme.baseText}`}>
                  {current.temperature}°C
                </p>
                <p className={`flex items-center gap-2 text-base ${theme.mutedText}`}>
                  <Cloud className="w-4 h-4" />
                  {current.condition}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className={`text-xs uppercase tracking-[0.3em] ${theme.mutedText}`}>Solar score</p>
                <p className={`text-5xl font-black leading-none ${scoreColorClass}`}>
                  {isDay ? solarImpact.score : "—"}
                </p>
                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${ratingBadgeClass}`}>
                  {!isDay ? "Nighttime" : solarImpact.rating}
                </span>
              </div>
            </div>
            <p className={`mt-4 text-sm leading-relaxed ${theme.mutedText}`}>
              {!isDay
                ? "Panels are resting overnight. We'll resume tracking production at sunrise."
                : solarImpact.insight || "Stable sunlight expected through the next interval."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.chip}`}>
                <Sun className="w-3 h-3" />
                {isDay ? "Active daylight window" : "Night mode"}
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.chip}`}>
                <Wind className="w-3 h-3" />
                {current.windSpeed} km/h winds
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${theme.chip}`}>
                <CloudRain className="w-3 h-3" />
                {current.precipitation} mm rain
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={`${theme.panel} rounded-2xl p-5 space-y-3`}>
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5" />
                <div>
                  <p className={`text-sm font-semibold ${theme.baseText}`}>Production outlook</p>
                  <p className={`text-xs ${theme.mutedText}`}>
                    {!isDay ? "Night pause" : solarImpact.rating}
                  </p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
                {!isDay
                  ? "Generation is paused after sunset. Stored energy powers the home until daylight returns."
                  : solarImpact.insight || "Expect steady generation for the next cycle."}
              </p>
            </div>
            <div className={`${theme.panel} rounded-2xl p-5 space-y-3`}>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p className={`text-sm font-semibold ${theme.baseText}`}>Suggested actions</p>
              </div>
              <ul className="space-y-2 text-sm">
                {(!isDay
                  ? [
                      "Keep batteries in reserve mode overnight.",
                      "Schedule heavy appliances for the morning window.",
                    ]
                  : [
                      solarImpact.score >= 70
                        ? "Perfect window to top up batteries or run EV charging."
                        : "Generation is modest prioritize essential loads.",
                      current.windSpeed > 25
                        ? "Gusty winds detected ensure rooftop gear stays secure."
                        : "Calm winds keep panel efficiency steady.",
                    ]
                ).map((tip) => (
                  <li key={tip} className={theme.mutedText}>
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[{
              label: "Air temp",
              value: `${current.temperature}°C`,
              icon: Thermometer,
            },
            {
              label: "Solar irradiance",
              value: `${current.solarIrradiance} W/m²`,
              icon: Sun,
            },
            {
              label: "Cloud cover",
              value: `${current.cloudCover}%`,
              icon: Cloud,
            },
            {
              label: "Wind speed",
              value: `${current.windSpeed} km/h`,
              icon: Wind,
            }].map(({ label, value, icon: Icon }) => (
              <div key={label} className={`${theme.panel} rounded-2xl p-3 flex items-center gap-3`}>
                <Icon className="w-5 h-5" />
                <div>
                  <p className={`text-xs uppercase tracking-wide ${theme.mutedText}`}>{label}</p>
                  <p className={`text-lg font-semibold ${theme.baseText}`}>{value}</p>
                </div>
              </div>
            ))}
          </section>
        </CardContent>
      </div>
    </Card>
  );
}
