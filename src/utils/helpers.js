export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

export const categoryColors = {
  concert: '#7C3AED',
  sports: '#059669',
  theater: '#DC2626',
  conference: '#2563EB',
  other: '#6B7280',
};

export const categoryLabels = {
  concert: '🎵 Concert',
  sports: '🏏 Sports',
  theater: '🎭 Theater',
  conference: '💼 Conference',
  other: '🎟️ Event',
};
