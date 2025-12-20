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
  tagTypes: ["SolarUnit", "Weather"],
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
  useGetWeatherBySolarUnitQuery
} = api;