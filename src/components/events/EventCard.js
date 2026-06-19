import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime, formatCurrency, categoryColors, categoryLabels } from '../../utils/helpers';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { _id, name, date, venue, pricePerSeat, category, seatStats } = event;

  const availabilityPct = seatStats?.total
    ? Math.round((seatStats.available / seatStats.total) * 100)
    : 0;

  const availabilityLabel =
    seatStats?.available === 0
      ? { text: 'Sold Out', cls: 'sold-out' }
      : seatStats?.available <= 10
        ? { text: 'Almost Full', cls: 'almost-full' }
        : { text: `${seatStats?.available} seats left`, cls: 'available' };

  return (
    <article
      className="event-card fade-in"
      onClick={() => navigate(`/events/${_id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/events/${_id}`)}
    >
      <div
        className="event-card__header"
        style={{ '--cat-color': categoryColors[category] || categoryColors.other }}
      >
        {/* Add this image tag */}
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
        )}
        <div className="event-card__category-bar" />
        <div className="event-card__meta-top">
          <span className="badge badge-accent">{categoryLabels[category] || categoryLabels.other}</span>
          <span className={`availability-dot ${availabilityLabel.cls}`}>{availabilityLabel.text}</span>
        </div>
        <h3 className="event-card__title">{name}</h3>
      </div>

      <div className="event-card__body">
        <div className="event-card__info">
          <span className="event-card__info-icon">📅</span>
          <span>{formatDate(date)} · {formatTime(date)}</span>
        </div>
        <div className="event-card__info">
          <span className="event-card__info-icon">📍</span>
          <span>{venue.name}, {venue.city}</span>
        </div>

        {seatStats && (
          <div className="event-card__availability">
            <div className="event-card__progress-bar">
              <div
                className="event-card__progress-fill"
                style={{ width: `${availabilityPct}%` }}
              />
            </div>
            <span className="event-card__seats-text">
              {seatStats.available}/{seatStats.total} available
            </span>
          </div>
        )}
      </div>

      <div className="event-card__footer">
        <div className="event-card__price">
          <span className="event-card__price-label">From</span>
          <span className="event-card__price-value">{formatCurrency(pricePerSeat)}</span>
        </div>
        <span className="btn btn-primary btn-sm">Book Now →</span>
      </div>
    </article>
  );
};

export default EventCard;
