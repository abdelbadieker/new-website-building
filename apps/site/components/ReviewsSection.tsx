'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Send } from 'lucide-react';

type Review = {
  id: string;
  user_email: string;
  user_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

export function ReviewsSection() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; name?: string } } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const sb = createClient();

    // Fetch approved reviews
    sb.from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setReviews(data || []));

    // Check auth via session (works without middleware, reads local storage)
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user as typeof user);
      }
    });

    // Also listen for auth state changes (e.g. if user logs in from another tab)
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as typeof user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;
    setSubmitting(true);
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';
    await supabase.from('reviews').insert({
      user_email: user.email,
      user_name: userName,
      rating,
      comment: comment.trim(),
      is_approved: false,
    });
    setSubmitting(false);
    setSubmitted(true);
    setComment('');
    setShowForm(false);
  };

  return (
    <section id="reviews" style={{ padding: '100px 5vw', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h2 className="ct" style={{ marginBottom: 16 }}>
          What Our <span className="hi">Merchants</span> Say
        </h2>
        <p className="csub" style={{ maxWidth: 560, margin: '0 auto' }}>
          Real feedback from businesses using EcoMate every day
        </p>
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
          maxWidth: 1100,
          margin: '0 auto 48px',
        }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--bg-card, rgba(10,22,40,0.6))',
                border: '1px solid var(--border-c, rgba(51,65,85,0.5))',
                borderRadius: 16,
                padding: 24,
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #334155)',
                  border: '1px solid #475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: '#e2e8f0',
                }}>
                  {r.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main, #f1f5f9)', fontSize: 14 }}>{r.user_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-sub, #64748b)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      width: 16, height: 16,
                      fill: i < r.rating ? '#fbbf24' : 'none',
                      color: i < r.rating ? '#fbbf24' : '#334155',
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-sub, #94a3b8)' }}>
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0 48px', color: 'var(--text-sub, #64748b)', fontSize: 14 }}>
          No reviews yet — be the first to share your experience!
        </div>
      )}

      {/* Review CTA */}
      <div style={{ textAlign: 'center' }}>
        {!user ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ color: 'var(--text-sub, #64748b)', fontSize: 14 }}>Sign in to share your experience</p>
            <a
              href="/login"
              style={{
                padding: '12px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg, var(--s, #3b82f6), var(--g, #34d399))',
                color: '#fff', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Sign In to Leave a Review
            </a>
          </div>
        ) : submitted ? (
          <div style={{
            padding: 20, borderRadius: 12,
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            maxWidth: 500, margin: '0 auto',
            color: '#34d399', fontWeight: 600, fontSize: 14,
          }}>
            ✓ Thank you! Your review has been submitted and is pending approval.
          </div>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 28px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, var(--s, #3b82f6), var(--g, #34d399))',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            ★ Leave a Review
          </button>
        ) : (
          <div style={{
            maxWidth: 500, margin: '0 auto', textAlign: 'left',
            background: 'var(--bg-card, rgba(10,22,40,0.6))',
            border: '1px solid var(--border-c, rgba(51,65,85,0.5))',
            borderRadius: 16, padding: 24,
          }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text-main, #f1f5f9)', fontSize: 16, marginBottom: 18 }}>Share Your Experience</h3>
            
            {/* Star selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-sub, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Rating</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <Star style={{
                      width: 28, height: 28,
                      fill: s <= rating ? '#fbbf24' : 'none',
                      color: s <= rating ? '#fbbf24' : '#334155',
                      transition: 'all 0.15s',
                    }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-sub, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience with EcoMate..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'rgba(7,16,31,0.8)',
                  border: '1px solid var(--border-c, rgba(51,65,85,0.5))',
                  borderRadius: 10, color: 'var(--text-main, #e2e8f0)',
                  fontSize: 13, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleSubmit}
                disabled={submitting || !comment.trim()}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: 'none',
                  background: submitting || !comment.trim() ? '#1e293b' : 'linear-gradient(135deg, #34d399, #059669)',
                  color: submitting || !comment.trim() ? '#475569' : '#fff',
                  fontWeight: 600, fontSize: 13, cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Send style={{ width: 14, height: 14 }} /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: 'rgba(51,65,85,0.3)', color: 'var(--text-sub, #94a3b8)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
