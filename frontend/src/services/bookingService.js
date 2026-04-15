import api from "./api";

export const fetchBookings = async () => {
  const { data } = await api.get("/bookings");
  return data;
};

export const checkAvailability = async (params) => {
  const { data } = await api.get("/bookings/availability/check", { params });
  return data;
};

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const fetchRevenueAnalytics = async () => {
  const { data } = await api.get("/bookings/analytics/revenue");
  return data;
};

export const updateBookingStatus = async (id, payload) => {
  const { data } = await api.patch(`/bookings/${id}/status`, payload);
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.patch(`/bookings/${id}/cancel`);
  return data;
};
