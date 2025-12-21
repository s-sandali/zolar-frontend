import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8000/api";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, prepareHeaders: async (headers) => {
    const clerk = window.Clerk;
    if (clerk) {
      const token = await clerk.session.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  } }),
  tagTypes: ["SolarUnit", "Weather", "Anomalies", "Analytics"],
  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({id, groupBy, limit}) => `/energy-generation-records/solar-unit/${id}?groupBy=${groupBy}&limit=${limit}`,
    }),
    getSolarUnitForUser: build.query({
      query: () => `/solar-units/me`,
      providesTags: ["SolarUnit"],
    }),
    getSolarUnits: build.query({
      query: () => `/solar-units`,
      providesTags: ["SolarUnit"],
    }),
    getSolarUnitById: build.query({
      query: (id) => `/solar-units/${id}`,
      providesTags: ["SolarUnit"],
    }),
    createSolarUnit: build.mutation({
      query: (data) => ({
        url: `/solar-units`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SolarUnit"],
    }),
    editSolarUnit: build.mutation({
      query: ({id, data}) => ({
        url: `/solar-units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SolarUnit", "Weather"],
    }),
    getAllUsers: build.query({
      query: () => `/users`,
    }),
    getWeatherBySolarUnit: build.query({
      query: (solarUnitId) => `/weather/current/${solarUnitId}`,
      providesTags: ["Weather"],
    }),
    // Anomaly endpoints
    getUserAnomalies: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.type) queryParams.append('type', params.type);
        if (params.severity) queryParams.append('severity', params.severity);
        if (params.status) queryParams.append('status', params.status);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);
        return `/anomalies/me${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ["Anomalies"],
    }),
    getAnomalyStats: build.query({
      query: () => `/anomalies/stats`,
      providesTags: ["Anomalies"],
    }),
    acknowledgeAnomaly: build.mutation({
      query: (id) => ({
        url: `/anomalies/${id}/acknowledge`,
        method: "PATCH",
      }),
      invalidatesTags: ["Anomalies"],
    }),
    resolveAnomaly: build.mutation({
      query: ({ id, resolutionNotes }) => ({
        url: `/anomalies/${id}/resolve`,
        method: "PATCH",
        body: { resolutionNotes },
      }),
      invalidatesTags: ["Anomalies"],
    }),
    // Analytics endpoints
    getWeatherAdjustedPerformance: build.query({
      query: ({ solarUnitId, days = 7 }) => `/analytics/weather-performance/${solarUnitId}?days=${days}`,
      providesTags: ["Analytics"],
    }),
    getAnomalyDistribution: build.query({
      query: ({ solarUnitId, days = 30 }) => `/analytics/anomaly-distribution/${solarUnitId}?days=${days}`,
      providesTags: ["Analytics"],
    }),
    getSystemHealth: build.query({
      query: ({ solarUnitId, days = 7 }) => `/analytics/system-health/${solarUnitId}?days=${days}`,
      providesTags: ["Analytics"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllUsersQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
  useGetSolarUnitForUserQuery,
  useGetSolarUnitsQuery,
  useGetSolarUnitByIdQuery,
  useCreateSolarUnitMutation,
  useEditSolarUnitMutation,
  useGetWeatherBySolarUnitQuery,
  useGetUserAnomaliesQuery,
  useGetAnomalyStatsQuery,
  useAcknowledgeAnomalyMutation,
  useResolveAnomalyMutation,
  useGetWeatherAdjustedPerformanceQuery,
  useGetAnomalyDistributionQuery,
  useGetSystemHealthQuery,
} = api;