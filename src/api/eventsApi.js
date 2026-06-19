import apiClient from './apiClient';

export const fetchEvents = async () => {
  const res = await apiClient.get('/events');
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await apiClient.get(`/events/${id}`);
  return res.data;
};
export const fetchUnavailableSeats = async (id) => {
  const res = await apiClient.get(`/events/${id}/unavailable-seats`);
  return res.data;
};