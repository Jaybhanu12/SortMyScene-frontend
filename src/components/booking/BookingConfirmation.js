import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';
import './BookingConfirmation.css';

const BookingConfirmation = ({ booking, event }) => {
  return (
    <div className="booking-confirmation slide-up">
      <div className="booking-confirmation__header">
        <div className="booking-confirmation__check">✓</div>
        <h2>Booking Confirmed!</h2>
        <p>You're all set. See you at the event!</p>
      </div>

      <div className="booking-confirmation__ticket">
        <div className="booking-confirmation__ticket-top">
          <div className="booking-confirmation__event-name">{event?.name}</div>
          <div className="booking-confirmation__ref">
            <span>Booking Ref</span>
            <strong>{booking.bookingReference}</strong>
          </div>
        </div>

        <div className="booking-confirmation__divider">
          <div className="booking-confirmation__hole booking-confirmation__hole--left" />
          <div className="booking-confirmation__perforation" />
          <div className="booking-confirmation__hole booking-confirmation__hole--right" />
        </div>

        <div className="booking-confirmation__ticket-bottom">
          <div className="booking-confirmation__detail">
            <span>Date & Time</span>
            <strong>{event ? `${formatDate(event.date)}, ${formatTime(event.date)}` : '—'}</strong>
          </div>
          <div className="booking-confirmation__detail">
            <span>Venue</span>
            <strong>{event?.venue?.name}, {event?.venue?.city}</strong>
          </div>
          <div className="booking-confirmation__detail">
            <span>Seats</span>
            <strong>{booking.seatNumbers?.join(', ')}</strong>
          </div>
          <div className="booking-confirmation__detail">
            <span>Total Paid</span>
            <strong className="booking-confirmation__total">{formatCurrency(booking.totalAmount)}</strong>
          </div>
        </div>
      </div>

      <div className="booking-confirmation__actions">
        <Link to="/my-bookings" className="btn btn-secondary btn-lg">
          View My Bookings
        </Link>
        <Link to="/" className="btn btn-primary btn-lg">
          Browse More Events
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
