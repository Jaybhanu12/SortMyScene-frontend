// // import React, { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import apiClient from '../api/apiClient';
// // import toast from 'react-hot-toast';

// // const CreateEvent = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
  
// //   const [form, setForm] = useState({
// //     name: '',
// //     description: '',
// //     date: '',
// //     time: '',
// //     venueName: '',
// //     venueCity: '',
// //     venueAddress: '',
// //     pricePerSeat: '',
// //     category: 'concert',
// //     rowsConfig: 'A, B, C, D, E', // Default example string
// //     seatsPerRow: '10'
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       // 1. Combine Date and Time
// //       const eventDateTime = new Date(`${form.date}T${form.time}`);

// //       // 2. Parse the rows string into an array (e.g., "A, B, C" -> ['A', 'B', 'C'])
// //       const rowsArray = form.rowsConfig.split(',').map(row => row.trim()).filter(row => row !== '');

// //       // 3. Construct the payload matching the Mongoose Schema
// //       const payload = {
// //         name: form.name,
// //         description: form.description,
// //         date: eventDateTime,
// //         pricePerSeat: Number(form.pricePerSeat),
// //         category: form.category,
// //         venue: {
// //           name: form.venueName,
// //           city: form.venueCity,
// //           address: form.venueAddress
// //         },
// //         layout: {
// //           rows: rowsArray,
// //           seatsPerRow: Number(form.seatsPerRow)
// //         }
// //       };

// //       // 4. Send to our secure admin route
// //       await apiClient.post('/admin/events', payload);
      
// //       toast.success('Event created successfully!');
// //       navigate('/admin'); // Redirect back to dashboard

// //     } catch (error) {
// //       toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to create event');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
// //       <div style={{ marginBottom: '20px' }}>
// //         <Link to="/admin" style={{ textDecoration: 'none', color: '#6366f1' }}>&larr; Back to Dashboard</Link>
// //       </div>
      
// //       <div className="card">
// //         <h2>Create Dynamic Event</h2>
// //         <p style={{ color: '#64748b', marginBottom: '20px' }}>
// //           Total seats will be calculated automatically based on your row and seat configuration.
// //         </p>

// //         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
// //             <div className="form-group">
// //               <label className="form-label">Event Name</label>
// //               <input required name="name" type="text" className="form-input" value={form.name} onChange={handleChange} />
// //             </div>
// //             <div className="form-group">
// //               <label className="form-label">Category</label>
// //               <select name="category" className="form-input" value={form.category} onChange={handleChange}>
// //                 <option value="concert">Concert</option>
// //                 <option value="sports">Sports</option>
// //                 <option value="theater">Theater</option>
// //                 <option value="conference">Conference</option>
// //                 <option value="other">Other</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="form-group">
// //             <label className="form-label">Description</label>
// //             <textarea name="description" className="form-input" rows="3" value={form.description} onChange={handleChange}></textarea>
// //           </div>

// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
// //             <div className="form-group">
// //               <label className="form-label">Date</label>
// //               <input required name="date" type="date" className="form-input" value={form.date} onChange={handleChange} />
// //             </div>
// //             <div className="form-group">
// //               <label className="form-label">Time</label>
// //               <input required name="time" type="time" className="form-input" value={form.time} onChange={handleChange} />
// //             </div>
// //             <div className="form-group">
// //               <label className="form-label">Price Per Seat (₹)</label>
// //               <input required name="pricePerSeat" type="number" min="0" className="form-input" value={form.pricePerSeat} onChange={handleChange} />
// //             </div>
// //           </div>

// //           <fieldset style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
// //             <legend style={{ padding: '0 10px', fontWeight: 'bold' }}>Venue Details</legend>
// //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
// //               <div className="form-group">
// //                 <label className="form-label">Venue Name</label>
// //                 <input required name="venueName" type="text" className="form-input" value={form.venueName} onChange={handleChange} />
// //               </div>
// //               <div className="form-group">
// //                 <label className="form-label">City</label>
// //                 <input required name="venueCity" type="text" className="form-input" value={form.venueCity} onChange={handleChange} />
// //               </div>
// //             </div>
// //             <div className="form-group" style={{ marginTop: '10px' }}>
// //               <label className="form-label">Address</label>
// //               <input required name="venueAddress" type="text" className="form-input" value={form.venueAddress} onChange={handleChange} />
// //             </div>
// //           </fieldset>

// //           <fieldset style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginTop: '10px', backgroundColor: '#f8fafc' }}>
// //             <legend style={{ padding: '0 10px', fontWeight: 'bold', color: '#0f172a' }}>Dynamic Seating Grid</legend>
// //             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
// //               <div className="form-group">
// //                 <label className="form-label">Row Names (Comma separated)</label>
// //                 <input 
// //                   required 
// //                   name="rowsConfig" 
// //                   type="text" 
// //                   className="form-input" 
// //                   placeholder="A, B, C, VIP1, VIP2" 
// //                   value={form.rowsConfig} 
// //                   onChange={handleChange} 
// //                 />
// //                 <small style={{ color: '#64748b' }}>Defines the letters/names on the Y-Axis.</small>
// //               </div>
// //               <div className="form-group">
// //                 <label className="form-label">Seats per Row</label>
// //                 <input 
// //                   required 
// //                   name="seatsPerRow" 
// //                   type="number" 
// //                   min="1" 
// //                   className="form-input" 
// //                   value={form.seatsPerRow} 
// //                   onChange={handleChange} 
// //                 />
// //                 <small style={{ color: '#64748b' }}>Defines the numbers on the X-Axis.</small>
// //               </div>
// //             </div>
// //           </fieldset>

// //           <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '20px' }} disabled={loading}>
// //             {loading ? 'Creating...' : 'Create Event'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateEvent;









// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import apiClient from '../api/apiClient';
// import toast from 'react-hot-toast';

// const CreateEvent = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
  
//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     date: '',
//     time: '',
//     venueName: '',
//     venueCity: '',
//     venueAddress: '',
//     pricePerSeat: '',
//     category: 'concert',
//     rowsConfig: 'A, B, C, D, E', 
//     seatsPerRow: '10'
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1. Combine Date and Time
//       const eventDateTime = new Date(`${form.date}T${form.time}`);

//       // 2. Parse the rows string into an array (e.g., "A, B, C" -> ['A', 'B', 'C'])
//       const rowsArray = form.rowsConfig.split(',').map(row => row.trim()).filter(row => row !== '');

//       if (rowsArray.length === 0) throw new Error("Please provide at least one valid row name.");

//       // 3. Construct the payload
//       const payload = {
//         name: form.name,
//         description: form.description,
//         date: eventDateTime,
//         pricePerSeat: Number(form.pricePerSeat),
//         category: form.category,
//         venue: {
//           name: form.venueName,
//           city: form.venueCity,
//           address: form.venueAddress
//         },
//         layout: {
//           rows: rowsArray,
//           seatsPerRow: Number(form.seatsPerRow)
//         }
//       };

//       // 4. Send to secure admin route
//       await apiClient.post('/admin/events', payload);
      
//       toast.success('Event created successfully!');
//       navigate('/admin');

//     } catch (error) {
//       toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      
//       <div className="dashboard-header-row">
//         <h1 className="dashboard-title">Create Dynamic Event</h1>
//         <Link to="/admin" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>
//           &larr; Back to Dashboard
//         </Link>
//       </div>

//       <div className="admin-card">
//         <div className="admin-form-container">
//           <p style={{ color: '#64748b', marginBottom: '30px', marginTop: '0' }}>
//             Fill out the details below. Total capacity will be calculated automatically based on your seating grid config.
//           </p>

//           <form onSubmit={handleSubmit}>
            
//             {/* General Info */}
//             <div className="admin-form-grid-2">
//               <div className="admin-form-group">
//                 <label className="admin-label">Event Name</label>
//                 <input required name="name" type="text" className="admin-input" placeholder="e.g. Coldplay World Tour" value={form.name} onChange={handleChange} />
//               </div>
//               <div className="admin-form-group">
//                 <label className="admin-label">Category</label>
//                 <select name="category" className="admin-input" value={form.category} onChange={handleChange}>
//                   <option value="concert">Concert</option>
//                   <option value="sports">Sports</option>
//                   <option value="theater">Theater</option>
//                   <option value="conference">Conference</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="admin-form-group">
//               <label className="admin-label">Description</label>
//               <textarea name="description" className="admin-input" placeholder="Brief description of the event..." value={form.description} onChange={handleChange}></textarea>
//             </div>

//             <div className="admin-form-grid-3">
//               <div className="admin-form-group">
//                 <label className="admin-label">Date</label>
//                 <input required name="date" type="date" className="admin-input" value={form.date} onChange={handleChange} />
//               </div>
//               <div className="admin-form-group">
//                 <label className="admin-label">Time</label>
//                 <input required name="time" type="time" className="admin-input" value={form.time} onChange={handleChange} />
//               </div>
//               <div className="admin-form-group">
//                 <label className="admin-label">Price Per Seat (₹)</label>
//                 <input required name="pricePerSeat" type="number" min="0" className="admin-input" placeholder="e.g. 1499" value={form.pricePerSeat} onChange={handleChange} />
//               </div>
//             </div>

//             {/* Venue Details Section */}
//             <div className="admin-section">
//               <h3 className="admin-section-title">📍 Venue Details</h3>
//               <div className="admin-form-grid-2">
//                 <div className="admin-form-group" style={{ marginBottom: '0' }}>
//                   <label className="admin-label">Venue Name</label>
//                   <input required name="venueName" type="text" className="admin-input" placeholder="e.g. DY Patil Stadium" value={form.venueName} onChange={handleChange} />
//                 </div>
//                 <div className="admin-form-group" style={{ marginBottom: '0' }}>
//                   <label className="admin-label">City</label>
//                   <input required name="venueCity" type="text" className="admin-input" placeholder="e.g. Mumbai" value={form.venueCity} onChange={handleChange} />
//                 </div>
//               </div>
//               <div className="admin-form-group" style={{ marginTop: '20px', marginBottom: '0' }}>
//                 <label className="admin-label">Full Address</label>
//                 <input required name="venueAddress" type="text" className="admin-input" placeholder="e.g. Sector 7, Nerul" value={form.venueAddress} onChange={handleChange} />
//               </div>
//             </div>

//             {/* Dynamic Seating Section */}
//             <div className="admin-section">
//               <h3 className="admin-section-title">💺 Dynamic Seating Grid</h3>
//               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
//                 <div className="admin-form-group" style={{ marginBottom: '0' }}>
//                   <label className="admin-label">Row Names (Comma separated)</label>
//                   <input 
//                     required 
//                     name="rowsConfig" 
//                     type="text" 
//                     className="admin-input" 
//                     placeholder="A, B, C, VIP1, VIP2" 
//                     value={form.rowsConfig} 
//                     onChange={handleChange} 
//                   />
//                   <span className="admin-help-text">Defines the letters/names on the Y-Axis.</span>
//                 </div>
//                 <div className="admin-form-group" style={{ marginBottom: '0' }}>
//                   <label className="admin-label">Seats per Row</label>
//                   <input 
//                     required 
//                     name="seatsPerRow" 
//                     type="number" 
//                     min="1" 
//                     className="admin-input" 
//                     value={form.seatsPerRow} 
//                     onChange={handleChange} 
//                   />
//                   <span className="admin-help-text">Defines the capacity on the X-Axis.</span>
//                 </div>
//               </div>
//             </div>

//             <button type="submit" className="admin-btn-submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px', marginRight: '10px' }}></span>
//                   Creating Event...
//                 </>
//               ) : (
//                 'Create Event'
//               )}
//             </button>
            
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;