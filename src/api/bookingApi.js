import apiClient from './apiClient';

export const createReservation = async ({ eventId, requestedSeats }) => {
  const res = await apiClient.post('/reserve', { 
    eventId, 
    requestedSeats 
  });
  return res.data;
};

export const confirmBooking = async (data) => {
  return await apiClient.post('/bookings', data); 
};

export const fetchMyBookings = async () => {
  const res = await apiClient.get('/bookings/my');
  return res.data;
};


export const cancelReservation = async (data) => {
  return await apiClient.post('/reserve/cancel', data); 
};

export const fetchActiveReservation = async (eventId) => {
  return await apiClient.get(`/reserve/active/${eventId}`);
};