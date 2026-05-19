import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/reviews/my');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) { setError('Please write a comment.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/reviews', {
        customerId: user?.customerId || null,
        rating: form.rating,
        comment: form.comment,
      });
      setSuccess(true);
      setForm({ rating: 5, comment: '' });
      fetchReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={16} fill={n <= rating ? '#f59e0b' : 'none'} color={n <= rating ? '#f59e0b' : '#d1d5db'} />
      ))}
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <MessageSquare size={28} />
        <h1>Reviews & Ratings</h1>
      </div>
      <p className="page-desc">Share your experience with GarageHub services.</p>

      {/* Submit Review Form */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Leave a Review</h2>
        {success && <div className="success-banner" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '8px', color: '#065f46' }}>✅ Review submitted successfully!</div>}
        {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Rating *</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <Star size={28} fill={n <= form.rating ? '#f59e0b' : 'none'} color={n <= form.rating ? '#f59e0b' : '#d1d5db'} />
                </button>
              ))}
              <span style={{ color: '#6b7280', alignSelf: 'center', marginLeft: '8px' }}>({form.rating}/5)</span>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Comment *</label>
            <textarea
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={3}
              placeholder="Tell us about your experience..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Customer Reviews ({reviews.length})</h2>
      {loading ? (
        <div className="empty-state">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(r => (
            <div key={r.id} className="form-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{r.customer?.fullName || 'Anonymous'}</strong>
                  <StarRating rating={r.rating} />
                </div>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  {new Date(r.reviewDate).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#4b5563', margin: 0 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
