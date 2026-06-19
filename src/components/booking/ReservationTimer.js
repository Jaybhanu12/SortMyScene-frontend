import React, { useEffect } from 'react';
import useCountdown from '../../hooks/useCountdown';
import './ReservationTimer.css';

const ReservationTimer = ({ expiresAt, onExpire }) => {
  const { seconds, isExpired, formatted } = useCountdown(expiresAt);

  useEffect(() => {
    if (isExpired && onExpire) onExpire();
  }, [isExpired, onExpire]);

  const urgency = seconds <= 60 ? 'critical' : seconds <= 180 ? 'warning' : 'normal';

  return (
    <div className={`reservation-timer reservation-timer--${urgency}`}>
      <div className="reservation-timer__icon">
        {isExpired ? '⏰' : urgency === 'critical' ? '⚡' : '🕐'}
      </div>
      <div className="reservation-timer__content">
        <span className="reservation-timer__label">
          {isExpired ? 'Reservation Expired' : 'Seats held for'}
        </span>
        <span className="reservation-timer__time">
          {isExpired ? '00:00' : formatted}
        </span>
      </div>
      {!isExpired && (
        <div className="reservation-timer__bar">
          <div
            className="reservation-timer__bar-fill"
            style={{ width: `${Math.min(100, (seconds / 600) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationTimer;
