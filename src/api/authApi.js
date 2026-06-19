import apiClient from './apiClient';

export const registerUser = async (data) => {
  const res = await apiClient.post('/auth/register', data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await apiClient.post('/auth/login', data);
  return res.data;
};

export const fetchMe = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  return await apiClient.post('/auth/verify-otp', { email, otp });
};