import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyBookings } from '../api/bookingApi';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMyBookings();
        setBookings(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="my-bookings-page__header">
          <div>
            <h1 className="my-bookings-page__title">My Bookings</h1>
            <p className="text-secondary">Your confirmed event tickets</p>
          </div>
          <Link to="/" className="btn btn-primary">
            + Find Events
          </Link>
        </div>

        {loading && (
          <div className="my-bookings-page__state">
            <div className="spinner spinner-lg" />
            <p>Loading your bookings...</p>
          </div>
        )}

        {error && !loading && (
          <div className="my-bookings-page__state my-bookings-page__state--error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="my-bookings-page__state">
            <span className="my-bookings-page__state-icon">🎫</span>
            <h3>No bookings yet</h3>
            <p className="text-secondary">Browse events and grab your first ticket!</p>
            <Link to="/" className="btn btn-primary mt-4">Explore Events</Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="my-bookings-page__list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item card fade-in">
                <div className="booking-item__header">
                  <div>
                    <div className="booking-item__event-name">
                      {booking.eventId?.name || 'Event'}
                    </div>
                    <div className="booking-item__venue text-secondary">
                      📍 {booking.eventId?.venue?.name}, {booking.eventId?.venue?.city}
                    </div>
                  </div>
                  <span className="badge badge-success">Confirmed</span>
                </div>

                <div className="booking-item__details">
                  <div className="booking-item__detail">
                    <span className="booking-item__detail-label">Date & Time</span>
                    <span className="booking-item__detail-value">
                      {booking.eventId?.date
                        ? `${formatDate(booking.eventId.date)}, ${formatTime(booking.eventId.date)}`
                        : '—'}
                    </span>
                  </div>
                  <div className="booking-item__detail">
                    <span className="booking-item__detail-label">Seats</span>
                    <div className="booking-item__seats">
                      {booking.seatNumbers?.map((s) => (
                        <span key={s} className="seat-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="booking-item__detail">
                    <span className="booking-item__detail-label">Total Paid</span>
                    <span className="booking-item__detail-value text-success">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                  <div className="booking-item__detail">
                    <span className="booking-item__detail-label">Booking Ref</span>
                    <span className="booking-item__ref">{booking.bookingReference}</span>
                  </div>
                </div>

                <div className="booking-item__footer">
                  <span className="booking-item__date-booked text-muted">
                    Booked on {formatDate(booking.createdAt)}
                  </span>
                  <Link
                    to={`/events/${booking.eventId?._id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    View Event →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
