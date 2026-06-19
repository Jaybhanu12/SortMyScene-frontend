import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
// Removed useAuth import since Logout is handled entirely by the Sidebar now

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await apiClient.get('/events');
            setEvents(response.data.data || response.data || []);
        } catch (error) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

        try {
            await apiClient.delete(`/admin/events/${eventId}`);
            toast.success('Event deleted successfully');
            setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete event');
        }
    };

    if (loading) return <div className="spinner" style={{ margin: 'auto', display: 'block' }}></div>;

    return (
        <div>
            <div className="dashboard-header-row">
                <h1 className="dashboard-title">Events Overview</h1>
                <Link to="/admin/events/new" className="btn btn-primary" style={{ backgroundColor: '#6366f1', border: 'none', borderRadius: '8px', padding: '10px 20px', color: 'white', textDecoration: 'none', fontWeight: '600' }}>
                    + Create New Event
                </Link>
            </div>

            <div className="admin-card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎭</div>
                                        No events found. Click "Create New Event" to get started.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event._id}>
                                        <td style={{ fontWeight: '600', color: '#0f172a' }}>{event.name}</td>
                                        <td>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td>
                                            <div>{event.venue?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{event.venue?.city}</div>
                                        </td>
                                        <td>
                                            <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                                                {event.totalSeats} seats
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            {/* NEW EDIT BUTTON */}
                                            <Link
                                                to={`/admin/events/edit/${event._id}`}
                                                className="action-btn"
                                                style={{ color: '#3b82f6', textDecoration: 'none' }}
                                            >
                                                Edit
                                            </Link>

                                            <button onClick={() => handleDelete(event._id)} className="action-btn">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;