import React, { useMemo } from 'react';
import './SeatGrid.css';

const SeatGrid = ({ seats, selectedSeatIds, onToggleSeat, disabled }) => {
  // Group seats by row
  const rowMap = useMemo(() => {
    const map = {};
    seats.forEach((seat) => {
      if (!map[seat.row]) map[seat.row] = [];
      map[seat.row].push(seat);
    });
    // Sort each row by column number
    Object.keys(map).forEach((row) => {
      map[row].sort((a, b) => a.column - b.column);
    });
    return map;
  }, [seats]);

  const rows = Object.keys(rowMap).sort();

  const getSeatClass = (seat) => {
    if (seat.status === 'booked') return 'seat seat--booked';
    if (seat.status === 'reserved') return 'seat seat--reserved';
    if (selectedSeatIds.includes(seat._id)) return 'seat seat--selected';
    return 'seat seat--available';
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available' || disabled) return;
    onToggleSeat(seat);
  };

  const isSelected = (seat) => selectedSeatIds.includes(seat._id);

  return (
    <div className="seat-grid-wrapper">
      {/* Stage indicator */}
      <div className="stage-indicator">
        <span>STAGE</span>
      </div>

      <div className="seat-grid">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="seat-row__label">{row}</span>
            <div className="seat-row__seats">
              {rowMap[row].map((seat) => (
                <button
                  key={seat._id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  title={
                    seat.status !== 'available'
                      ? `${seat.seatNumber} — ${seat.status}`
                      : isSelected(seat)
                      ? `${seat.seatNumber} — selected`
                      : seat.seatNumber
                  }
                  disabled={seat.status !== 'available' || disabled}
                  aria-label={`Seat ${seat.seatNumber} ${seat.status}`}
                  aria-pressed={isSelected(seat)}
                />
              ))}
            </div>
            <span className="seat-row__label">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="seat-legend__item">
          <span className="seat seat--available seat--demo" />
          <span>Available</span>
        </div>
        <div className="seat-legend__item">
          <span className="seat seat--selected seat--demo" />
          <span>Selected</span>
        </div>
        <div className="seat-legend__item">
          <span className="seat seat--reserved seat--demo" />
          <span>Reserved</span>
        </div>
        <div className="seat-legend__item">
          <span className="seat seat--booked seat--demo" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
