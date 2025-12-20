import { useGetSolarUnitForUserQuery, useGetUserAnomaliesQuery, useGetAnomalyStatsQuery } from "@/lib/redux/query";
import DataCard from "../dashboard/components/DataCard";
import AnomalyCard from "./components/AnomalyCard";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const AnomaliesPage = () => {
  const { user } = useUser();
  const [statusFilter, setStatusFilter] = useState('OPEN'); // OPEN, ACKNOWLEDGED, RESOLVED, ALL

  const { data: solarUnit, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitForUserQuery();

  const { data: anomaliesData, isLoading: isLoadingAnomalies, isError: isErrorAnomalies, error: errorAnomalies } = useGetUserAnomaliesQuery({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    limit: 50
  });

  const { data: stats, isLoading: isLoadingStats } = useGetAnomalyStatsQuery();

  if (isLoadingSolarUnit) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Loading solar unit...</p>
    </div>;
  }

  if (isErrorSolarUnit) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-red-500">Error: {errorSolarUnit.message}</p>
    </div>;
  }

  return (
    <main className="mt-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">{user?.firstName}'s Anomalies</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage anomalies detected in your solar unit
        </p>
      </div>

      {/* Statistics Cards */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium text-gray-500">Total Anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCount || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <CardDescription className="text-xs font-medium text-gray-500">Critical</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.bySeverity?.CRITICAL || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <CardDescription className="text-xs font-medium text-gray-500">Open</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{stats.byStatus?.OPEN || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <CardDescription className="text-xs font-medium text-gray-500">Resolved</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.byStatus?.RESOLVED || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {['ALL', 'OPEN', 'ACKNOWLEDGED', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 font-medium transition-colors ${
              statusFilter === status
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {statusFilter === 'ALL' ? 'All' : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Anomalies
        </h2>

        {isLoadingAnomalies ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isErrorAnomalies ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-500">Error loading anomalies: {errorAnomalies.message}</p>
            </CardContent>
          </Card>
        ) : anomaliesData?.anomalies?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">No {statusFilter.toLowerCase()} anomalies found</p>
              <p className="text-sm text-gray-500 mt-2">
                {statusFilter === 'OPEN'
                  ? "Great! Your solar unit is performing normally."
                  : `You have no ${statusFilter.toLowerCase()} anomalies.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {anomaliesData.anomalies.map((anomaly) => (
              <AnomalyCard key={anomaly._id} anomaly={anomaly} />
            ))}
          </div>
        )}

        {anomaliesData?.hasMore && (
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-sm text-gray-500">
                Showing {anomaliesData.anomalies.length} of {anomaliesData.total} anomalies
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Original Data Card for Reference */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Energy Production Analysis</h2>
        <DataCard solarUnitId={solarUnit._id} />
      </div>
    </main>
  );
};

export default AnomaliesPage;
