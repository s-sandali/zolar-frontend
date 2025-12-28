import {
  useGetSolarUnitForUserQuery,
  useGetWeatherAdjustedPerformanceQuery,
  useGetAnomalyDistributionQuery,
} from "@/lib/redux/query";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";

const ANOMALY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const AnalyticsPage = () => {
  const { user } = useUser();
  const [days, setDays] = useState(14);

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

  const { data: analytics, isLoading: isLoadingAnalytics, isError: isErrorAnalytics, error: errorAnalytics } = useGetWeatherAdjustedPerformanceQuery(
    { solarUnitId: solarUnit?._id, days },
    { skip: !solarUnit?._id }
  );

  const { data: anomalyData, isLoading: isLoadingAnomalies } = useGetAnomalyDistributionQuery(
    { solarUnitId: solarUnit?._id, days: 30 },
    { skip: !solarUnit?._id }
  );

  if (isLoadingSolarUnit) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading solar unit...</p>
      </div>
    );
  }

  if (isErrorSolarUnit) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {errorSolarUnit.message}</p>
      </div>
    );
  }

  // Chart configurations for shadcn
  const performanceChartConfig = {
    actualEnergy: {
      label: "Actual Energy",
      color: "#3b82f6",
    },
    expectedEnergy: {
      label: "Expected Energy",
      color: "#10b981",
    },
  };

  const performanceRatioChartConfig = {
    performanceRatio: {
      label: "Performance %",
      color: "#8b5cf6",
    },
  };

  const weatherChartConfig = {
    weatherScore: {
      label: "Weather Score",
      color: "#f59e0b",
    },
  };

  return (
    <main className="mt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{user?.firstName}'s Analytics</h1>
          <p className="text-gray-600 mt-2">
            Weather-adjusted performance insights for your solar unit
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map((period) => (
            <button
              key={period}
              onClick={() => setDays(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                days === period
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {period} Days
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingAnalytics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : isErrorAnalytics ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-red-500 font-medium">Error loading analytics</p>
            <p className="text-sm text-gray-500 mt-2">{errorAnalytics?.data?.message || errorAnalytics?.message || 'Unknown error'}</p>
          </CardContent>
        </Card>
      ) : analytics && analytics.dailyData && analytics.dailyData.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium text-gray-500">
                  Avg Performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{analytics.summary.avgPerformanceRatio}%</p>
                  {analytics.summary.avgPerformanceRatio >= 90 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <CardDescription className="text-xs font-medium text-gray-500">
                    Total Energy
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{analytics.summary.totalActualEnergy.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">kWh produced</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <CardDescription className="text-xs font-medium text-gray-500">
                    Best Day
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{analytics.summary.bestDay.ratio}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.summary.bestDay.date ? new Date(analytics.summary.bestDay.date).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3 w-3 text-orange-500" />
                  <CardDescription className="text-xs font-medium text-gray-500">
                    Worst Day
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{analytics.summary.worstDay.ratio}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.summary.worstDay.date ? new Date(analytics.summary.worstDay.date).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid - 2 columns, compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Weather-Adjusted Performance Bar Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weather-Adjusted Performance</CardTitle>
                <CardDescription className="text-xs">
                  Actual vs Expected energy generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={performanceChartConfig} className="h-[250px] w-full">
                  <BarChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="actualEnergy" fill="var(--color-actualEnergy)" radius={4} />
                    <Bar dataKey="expectedEnergy" fill="var(--color-expectedEnergy)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Chart 2: Performance Ratio Trend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance Ratio Trend</CardTitle>
                <CardDescription className="text-xs">
                  Daily performance percentage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={performanceRatioChartConfig} className="h-[250px] w-full">
                  <LineChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="performanceRatio"
                      stroke="var(--color-performanceRatio)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Chart 3: Weather Score Impact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weather Score Impact</CardTitle>
                <CardDescription className="text-xs">
                  Daily weather conditions affecting performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={weatherChartConfig} className="h-[250px] w-full">
                  <BarChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="weatherScore" fill="var(--color-weatherScore)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Chart 4: Anomaly Distribution Pie Chart */}
            {anomalyData && anomalyData.totalAnomalies > 0 ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Anomaly Distribution</CardTitle>
                  <CardDescription className="text-xs">
                    Breakdown by anomaly type (last 30 days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
                  <ChartContainer
                    config={Object.fromEntries(
                      anomalyData.byType.map((item, i) => [
                        item.type,
                        {
                          label: item.type.replace(/_/g, " "),
                          color: ANOMALY_COLORS[i % ANOMALY_COLORS.length],
                        },
                      ])
                    )}
                    className="h-[260px] w-full lg:flex-1 lg:max-w-none"
                  >
                    <PieChart>
                      <Pie
                        data={anomalyData.byType}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={50}
                        outerRadius={110}
                        paddingAngle={2}
                        label={(entry) => `${Math.round(entry.percentage ?? 0)}%`}
                        labelLine={false}
                      >
                        {anomalyData.byType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ANOMALY_COLORS[index % ANOMALY_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>

                  <div className="flex-1 space-y-3 min-w-0 max-h-[260px] overflow-y-auto overflow-x-hidden pr-1">
                    {anomalyData.byType.map((item, index) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-3 gap-2"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: ANOMALY_COLORS[index % ANOMALY_COLORS.length] }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium capitalize truncate">
                              {item.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{item.count} events</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold flex-shrink-0">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Anomaly Distribution</CardTitle>
                  <CardDescription className="text-xs">
                    Breakdown by anomaly type (last 30 days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                  <p className="text-sm text-gray-500">No anomalies detected</p>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  analytics.summary.avgPerformanceRatio >= 90
                    ? 'bg-green-100'
                    : analytics.summary.avgPerformanceRatio >= 70
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}>
                  <Zap className={`h-4 w-4 ${
                    analytics.summary.avgPerformanceRatio >= 90
                      ? 'text-green-600'
                      : analytics.summary.avgPerformanceRatio >= 70
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Overall Performance</h3>
                  <p className="text-xs text-gray-600">
                    {analytics.summary.avgPerformanceRatio >= 90
                      ? "Excellent! Your solar unit is performing above expectations even when accounting for weather conditions."
                      : analytics.summary.avgPerformanceRatio >= 70
                      ? "Good performance. Your system is meeting most weather-adjusted expectations."
                      : "Performance is below expectations. Consider checking for panel obstructions or scheduling maintenance."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">No data available</p>
            <p className="text-sm text-gray-500 mt-2">
              There is no energy generation data for the selected period.
              Please ensure your solar unit is connected and generating data.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default AnalyticsPage;
