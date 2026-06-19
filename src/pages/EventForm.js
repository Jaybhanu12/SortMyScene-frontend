import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [form, setForm] = useState({
    name: '', description: '', date: '', time: '',
    venueName: '', venueCity: '', venueAddress: '',
    pricePerSeat: '', category: 'concert',
    rowsConfig: '', seatsPerRow: '', imageUrl: ''
  });

  // If in Edit Mode, fetch the data and populate the form
  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          const res = await apiClient.get(`/events/${id}`);
          const data = res.data.data;
          
          // Format date for the HTML date input
          const eventDate = new Date(data.date);
          const dateString = eventDate.toISOString().split('T')[0];
          const timeString = eventDate.toTimeString().split(' ')[0].slice(0, 5);

          setForm({
            name: data.name,
            description: data.description || '',
            date: dateString,
            time: timeString,
            venueName: data.venue?.name || '',
            venueCity: data.venue?.city || '',
            venueAddress: data.venue?.address || '',
            pricePerSeat: data.pricePerSeat,
            category: data.category || 'other',
            rowsConfig: data.layout?.rows.join(', ') || '',
            seatsPerRow: data.layout?.seatsPerRow || '',
            imageUrl: data.imageUrl || ''
          });
          setImagePreview(data.imageUrl || '');
        } catch (err) {
          toast.error('Failed to fetch event data');
        }
      };
      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show instant local preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = form.imageUrl;

      // 1. If a new file was selected, upload it to Cloudinary first!
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadRes = await apiClient.post('/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url; // Save the Cloudinary link
      }

      // 2. Construct the standardized database payload
      const eventDateTime = new Date(`${form.date}T${form.time}`);
      const rowsArray = form.rowsConfig.split(',').map(row => row.trim()).filter(row => row !== '');

      const payload = {
        name: form.name,
        description: form.description,
        date: eventDateTime,
        pricePerSeat: Number(form.pricePerSeat),
        category: form.category,
        imageUrl: finalImageUrl,
        venue: {
          name: form.venueName,
          city: form.venueCity,
          address: form.venueAddress
        },
        layout: {
          rows: rowsArray,
          seatsPerRow: Number(form.seatsPerRow)
        }
      };

      // 3. Send to appropriate endpoint (Create vs Update)
      if (isEditMode) {
        await apiClient.put(`/admin/events/${id}`, payload);
        toast.success('Event updated successfully!');
      } else {
        await apiClient.post('/admin/events', payload);
        toast.success('Event created successfully!');
      }
      
      navigate('/admin');

    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="dashboard-header-row">
        <h1 className="dashboard-title">{isEditMode ? 'Edit Event' : 'Create Dynamic Event'}</h1>
        <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>&larr; Back</Link>
      </div>

      <div className="admin-card">
        <div className="admin-form-container">
          <form onSubmit={handleSubmit}>
            
            {/* Image Upload Section */}
            <div className="admin-section" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '150px', height: '150px', borderRadius: '12px', backgroundColor: '#e2e8f0', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '2rem' }}>🖼️</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="admin-section-title" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '10px' }}>Event Banner Image</h3>
                <p className="admin-help-text" style={{ marginBottom: '15px' }}>Upload a high-quality image (JPG, PNG). It will be optimized and stored securely.</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="admin-input" style={{ width: '100%' }} />
              </div>
            </div>

            {/* General Info */}
            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Event Name</label>
                <input required name="name" type="text" className="admin-input" value={form.name} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <select name="category" className="admin-input" value={form.category} onChange={handleChange}>
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="theater">Theater</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea name="description" className="admin-input" value={form.description} onChange={handleChange}></textarea>
            </div>

            <div className="admin-form-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Date</label>
                <input required name="date" type="date" className="admin-input" value={form.date} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Time</label>
                <input required name="time" type="time" className="admin-input" value={form.time} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Price Per Seat (₹)</label>
                <input required name="pricePerSeat" type="number" min="0" className="admin-input" value={form.pricePerSeat} onChange={handleChange} />
              </div>
            </div>

            {/* Venue Details */}
            <div className="admin-section">
              <h3 className="admin-section-title">📍 Venue Details</h3>
              <div className="admin-form-grid-2">
                <div className="admin-form-group" style={{ marginBottom: '0' }}>
                  <label className="admin-label">Venue Name</label>
                  <input required name="venueName" type="text" className="admin-input" value={form.venueName} onChange={handleChange} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: '0' }}>
                  <label className="admin-label">City</label>
                  <input required name="venueCity" type="text" className="admin-input" value={form.venueCity} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-group" style={{ marginTop: '20px', marginBottom: '0' }}>
                <label className="admin-label">Full Address</label>
                <input required name="venueAddress" type="text" className="admin-input" value={form.venueAddress} onChange={handleChange} />
              </div>
            </div>

            {/* Seating Grid */}
            <div className="admin-section">
              <h3 className="admin-section-title">💺 Dynamic Seating Grid</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="admin-form-group" style={{ marginBottom: '0' }}>
                  <label className="admin-label">Row Names (Comma separated)</label>
                  <input required name="rowsConfig" type="text" className="admin-input" value={form.rowsConfig} onChange={handleChange} />
                  <span className="admin-help-text">e.g. A, B, C, VIP</span>
                </div>
                <div className="admin-form-group" style={{ marginBottom: '0' }}>
                  <label className="admin-label">Seats per Row</label>
                  <input required name="seatsPerRow" type="number" min="1" className="admin-input" value={form.seatsPerRow} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" className="admin-btn-submit" disabled={loading}>
              {loading ? 'Processing...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;