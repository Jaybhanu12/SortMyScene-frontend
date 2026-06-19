import React, { useState, useEffect, useMemo } from 'react';
import { fetchEvents } from '../api/eventsApi';
import EventCard from '../components/events/EventCard';
import './EventListPage.css';

const CATEGORIES = ['all', 'concert', 'sports', 'theater', 'conference', 'other'];

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchEvents();
        setEvents(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchCat = activeCategory === 'all' || e.category === activeCategory;
      const matchSearch =
        search.trim() === '' ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.venue?.city?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [events, activeCategory, search]);

  return (
    <div className="event-list-page">
      {/* Hero */}
      <section className="event-list-page__hero">
        <div className="container">
          <h1 className="event-list-page__headline">
            Find Your Next<br />
            <span className="text-accent">Unforgettable</span> Experience
          </h1>
          <p className="event-list-page__sub">
            Concerts, sports, theatre — book seats in seconds.
          </p>

          {/* Search */}
          <div className="event-list-page__search-wrap">
            <span className="event-list-page__search-icon">🔍</span>
            <input
              type="text"
              className="event-list-page__search"
              placeholder="Search events or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="event-list-page__search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Category filter */}
        <div className="event-list-page__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="event-list-page__count">
            {filtered.length === 0
              ? 'No events found'
              : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}

        {/* States */}
        {loading && (
          <div className="event-list-page__state">
            <div className="spinner spinner-lg" />
            <p>Loading events...</p>
          </div>
        )}

        {error && !loading && (
          <div className="event-list-page__state event-list-page__state--error">
            <span className="event-list-page__state-icon">⚠️</span>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="event-list-page__state">
            <span className="event-list-page__state-icon">🎭</span>
            <p>No events match your search.</p>
            <button
              className="btn btn-ghost"
              onClick={() => { setSearch(''); setActiveCategory('all'); }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="event-list-page__grid">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
