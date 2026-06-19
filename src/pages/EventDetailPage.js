import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchEventById, fetchUnavailableSeats } from '../api/eventsApi'; // Added new fetch import
import { createReservation, confirmBooking, cancelReservation ,fetchActiveReservation} from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import ReservationTimer from '../components/booking/ReservationTimer';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { formatDate, formatTime, formatCurrency, categoryLabels, getErrorMessage } from '../utils/helpers';
import './EventDetailPage.css';

// Booking flow states
const FLOW = {
  SELECTING: 'selecting',
  RESERVING: 'reserving',
  RESERVED: 'reserved',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [unavailableSeats, setUnavailableSeats] = useState({ booked: [], reserved: [] }); // Local state populated by your endpoint
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]); 
  const [flow, setFlow] = useState(FLOW.SELECTING);
  const [reservation, setReservation] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);


  // const loadEventData = useCallback(async () => {
  //   try {
  //     setError(null);
      
  //     const [eventRes, seatsRes] = await Promise.all([
  //       fetchEventById(id),
  //       fetchUnavailableSeats(id)
  //     ]);

  //     // Safely extract the data regardless of Axios interceptors
  //     const actualEventData = eventRes?.data?.data || eventRes?.data || eventRes;
  //     const actualSeatsData = seatsRes?.data?.data || seatsRes?.data || seatsRes;

  //     setEvent(actualEventData);
  //     setUnavailableSeats(actualSeatsData || { booked: [], reserved: [] });
  //   } catch (err) {
  //     setError(getErrorMessage(err));
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [id]);


  const loadEventData = useCallback(async () => {
    try {
      setError(null);
      
      // 1. Fetch Event and Grid Data
      const [eventRes, seatsRes] = await Promise.all([
        fetchEventById(id),
        fetchUnavailableSeats(id)
      ]);

      const actualEventData = eventRes?.data?.data || eventRes?.data || eventRes;
      const actualSeatsData = seatsRes?.data?.data || seatsRes?.data || seatsRes;

      setEvent(actualEventData);
      setUnavailableSeats(actualSeatsData || { booked: [], reserved: [] });

      // 2. NEW: If logged in, check if we ALREADY have a reservation running!
      if (isAuthenticated) {
        try {
          const activeRes = await fetchActiveReservation(id);
          const myReservation = activeRes?.data?.data?.reservation || activeRes?.data?.reservation;
          
          if (myReservation) {
            setReservation(myReservation);
            setSelectedSeats(myReservation.seatNumbers); 
            setFlow(FLOW.RESERVED); 
          }
        } catch (err) {
          console.log("No active reservation found, continuing normally.");
        }
      }

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    loadEventData();
  }, [loadEventData]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((id) => id !== seatId);
      if (prev.length >= 10) {
        toast.error('You can select up to 10 seats at a time.');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to reserve seats.');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Select at least one seat to continue.');
      return;
    }

    setFlow(FLOW.RESERVING);
    try {
      const res = await createReservation({
        eventId: id,
        requestedSeats: selectedSeats, 
      });

      const returnedReservation = res?.data?.data?.reservation || res?.data?.reservation || res?.reservation;

      if (!returnedReservation) {
        throw new Error("Reservation succeeded but frontend couldn't parse payload.");
      }

      setReservation(returnedReservation);
      setFlow(FLOW.RESERVED);
      toast.success('Seats reserved! Please confirm.');
      loadEventData();
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      loadEventData();
      setSelectedSeats([]);
      setFlow(FLOW.SELECTING);
    }
  };


  const handleConfirmBooking = async () => {
    setFlow(FLOW.CONFIRMING);
    try {

      const targetResId = reservation?.id || reservation?._id || reservation?.reservation?.id || reservation?.reservation?._id;

      if (!targetResId) {
        toast.error("Error: Could not find Reservation ID in memory.");
        setFlow(FLOW.RESERVED); 
        return;
      }

      console.log("🚀 Sending Confirmation for Reservation ID:", targetResId);

      const res = await confirmBooking({ reservationId: targetResId });
      const actualBooking = res?.data?.data || res?.data;
      
      setConfirmedBooking(actualBooking);
      setFlow(FLOW.CONFIRMED);
      // setConfirmedBooking(res.data);
      // setFlow(FLOW.CONFIRMED);
      toast.success('Booking confirmed! 🎉');
      loadEventData();

    } catch (err) {
      console.error("🚨 Booking Confirm Error:", err.response?.data || err);

      // 3. Unmask the exact Validation Error so the toast tells you the truth!
      let msg = getErrorMessage(err);
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        const firstError = err.response.data.errors[0];
        msg = `${firstError.field}: ${firstError.message}`;
      }

      toast.error(msg);
      
      // Reset the UI so the user isn't permanently stuck
      setFlow(FLOW.SELECTING);
      setReservation(null);
      setSelectedSeats([]);
      loadEventData();
    }
  };
  const handleReservationExpired = useCallback(() => {
    toast.error('Your reservation expired. Please select seats again.');
    setFlow(FLOW.SELECTING);
    setReservation(null);
    setSelectedSeats([]);
    loadEventData();
  }, [loadEventData]);

const handleCancelReservation = async () => {
    try {
      // Safely grab the ID whether Axios returned it as 'id' or '_id'
      const targetId = reservation?.id || reservation?._id;

      if (!targetId) {
        console.error("No reservation ID found in state:", reservation);
        toast.error("Cannot cancel: Reservation ID is missing.");
        return;
      }

      // 1. Tell the database to cancel it
      await cancelReservation({ reservationId: targetId });
      
      // 2. ONLY if the database succeeds, show success and reset the UI
      toast.success('Reservation cancelled. Seats released.');
      setFlow(FLOW.SELECTING);
      setReservation(null);
      setSelectedSeats([]);
      loadEventData(); 

    } catch (err) {
      // 3. If the backend fails, log it and tell the user!
      console.error("Failed to cancel on backend:", err);
      toast.error('Failed to cancel on the server. Please check console.');
      // Notice there is NO 'finally' block here anymore. 
    }
  };

  const totalPrice = selectedSeats.length * (event?.pricePerSeat || 0);


  if (loading) {
    return (
      <div className="event-detail-page__loading">
        <div className="spinner spinner-lg" />
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-page__error">
        <span>⚠️</span>
        <p>{error}</p>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={loadEventData}>Retry</button>
          <Link to="/" className="btn btn-ghost">Back to Events</Link>
        </div>
      </div>
    );
  }

  if (!event) return null;

  if (flow === FLOW.CONFIRMED) {
    return (
      <div className="container">
        <BookingConfirmation booking={confirmedBooking} event={event} />
      </div>
    );
  }

  const isReserved = flow === FLOW.RESERVED || flow === FLOW.CONFIRMING;
  const hasLayout = event.layout && event.layout.rows && event.layout.rows.length > 0;

  return (
    <div className="event-detail-page">
      <div className="container">
        <Link to="/" className="event-detail-page__back">← All Events</Link>

        <div className="event-detail-page__layout">
          {/* Left: seat grid */}
          <div className="event-detail-page__grid-section card">
            <div className="event-detail-page__grid-header">
              <h2>Select Your Seats</h2>
              <span className="badge badge-muted">{unavailableSeats.availableCount ?? event.seatStats?.available ?? 0} available</span>
            </div>
            
            {!hasLayout ? (
              <div className="event-detail-page__no-layout">
                <p>⚠️ No seating layout configured for this event.</p>
                <small>Check your database to ensure 'layout.rows' and 'layout.seatsPerRow' exist.</small>
              </div>
            ) : (
              <div 
                className="seat-grid-wrapper" 
                style={{ pointerEvents: isReserved ? 'none' : 'auto', opacity: isReserved ? 0.6 : 1 }}
              >
                <div className="stage-indicator"><span>STAGE</span></div>
                
                {/* Fixed scroll viewport to prevent layout distortion */}
                <div className="seat-grid-scroll-container">
                  {event.layout.rows.map((row) => (
                    <div key={row} className="seat-row">
                      <span className="seat-row__label">{row}</span>
                      <div className="seat-row__seats">
                        {Array.from({ length: event.layout.seatsPerRow }).map((_, i) => {
                          const seatId = `${row}${i + 1}`;
                          
                          const isBooked = unavailableSeats.booked?.includes(seatId);
                          const isReservedSeat = unavailableSeats.reserved?.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);

                          return (
                            <button
                              key={seatId}
                              className={`seat ${isBooked ? 'seat--booked' : ''} ${isReservedSeat ? 'seat--reserved' : ''} ${isSelected ? 'seat--selected' : ''}`}
                              disabled={isBooked || isReservedSeat}
                              onClick={() => toggleSeat(seatId)}
                              title={seatId}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grid Legend */}
                <div className="seat-legend">
                  <div className="legend-item"><span className="seat seat--available"></span> Available</div>
                  <div className="legend-item"><span className="seat seat--selected"></span> Selected</div>
                  <div className="legend-item"><span className="seat seat--reserved"></span> Reserved</div>
                  <div className="legend-item"><span className="seat seat--booked"></span> Booked</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: summary panel */}
          <aside className="event-detail-page__sidebar">
            <div className="card event-detail-page__info-card">
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} />
              )}
              <div className="event-detail-page__category-chip">
                {categoryLabels?.[event.category] || categoryLabels?.other || 'Other'}
              </div>
              <h1 className="event-detail-page__event-name">{event.name}</h1>
              {event.description && (
                <p className="event-detail-page__description">{event.description}</p>
              )}
              <div className="event-detail-page__meta">
                <div className="event-detail-page__meta-item">
                  <span>📅</span>
                  <div>
                    <div>{formatDate(event.date)}</div>
                    <div className="text-muted">{formatTime(event.date)}</div>
                  </div>
                </div>
                <div className="event-detail-page__meta-item">
                  <span>📍</span>
                  <div>
                    <div>{event.venue?.name}</div>
                    <div className="text-muted">{event.venue?.city}</div>
                  </div>
                </div>
                <div className="event-detail-page__meta-item">
                  <span>💺</span>
                  <div>
                    <div>{formatCurrency(event.pricePerSeat)} per seat</div>
                    <div className="text-muted">{unavailableSeats.availableCount ?? event.seatStats?.available ?? 0} left</div>
                  </div>
                </div>
              </div>
            </div>

            {isReserved && reservation && (
              <ReservationTimer
                expiresAt={reservation.expiresAt}
                onExpire={handleReservationExpired}
              />
            )}

            <div className="card event-detail-page__summary">
              <h3 className="event-detail-page__summary-title">Order Summary</h3>

              {selectedSeats.length === 0 && !isReserved && (
                <p className="event-detail-page__summary-empty">
                  No seats selected yet. Click available seats on the map.
                </p>
              )}

              {(selectedSeats.length > 0 || isReserved) && (
                <>
                  <div className="event-detail-page__summary-seats">
                    {(isReserved ? reservation?.seatNumbers?.map((n) => ({ seatNumber: n })) : selectedSeats).map(
                      (seat, i) => (
                        <span key={i} className="seat-chip">
                          {seat.seatNumber || seat}
                        </span>
                      )
                    )}
                  </div>

                  <div className="event-detail-page__summary-line">
                    <span>
                      {isReserved ? reservation?.seatNumbers?.length : selectedSeats.length} ×{' '}
                      {formatCurrency(event.pricePerSeat)}
                    </span>
                    <span>{formatCurrency(isReserved ? reservation?.totalAmount : totalPrice)}</span>
                  </div>

                  <div className="event-detail-page__summary-total">
                    <span>Total</span>
                    <strong>
                      {formatCurrency(isReserved ? reservation?.totalAmount : totalPrice)}
                    </strong>
                  </div>
                </>
              )}

              <div className="event-detail-page__actions">
                {flow === FLOW.SELECTING && (
                  <button
                    className="btn btn-primary btn-lg btn-full"
                    onClick={handleReserve}
                    disabled={selectedSeats.length === 0}
                  >
                    Reserve {selectedSeats.length > 0 ? `${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}` : 'Seats'}
                  </button>
                )}

                {flow === FLOW.RESERVING && (
                  <button className="btn btn-primary btn-lg btn-full" disabled>
                    <div className="spinner" /> Reserving...
                  </button>
                )}

                {flow === FLOW.RESERVED && (
                  <>
                    <button className="btn btn-success btn-lg btn-full" onClick={handleConfirmBooking}>
                      ✓ Confirm Booking
                    </button>
                    <button className="btn btn-danger btn-sm btn-full" onClick={handleCancelReservation}>
                      Cancel Reservation
                    </button>
                  </>
                )}

                {flow === FLOW.CONFIRMING && (
                  <button className="btn btn-success btn-lg btn-full" disabled>
                    <div className="spinner" /> Confirming...
                  </button>
                )}
              </div>

              {!isAuthenticated && (
                <p className="event-detail-page__auth-note">
                  <Link to="/login" className="text-accent">Sign in</Link> to reserve seats.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;