import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageModal from '../components/ImageModal';
import CommentsBox from '../components/CommentsBox';

const BACKEND_URL = "https://platrerie-backend.onrender.com";

const getImageUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${BACKEND_URL}${img}`;
};

function ReviewCard({ review, onClick, onUpdated }) {
  const imgs = review.images || [];
  return (
    <article className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-stone-900 dark:text-white">
            {review.user?.firstName} {review.user?.lastName}
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{review.comment}</p>
      {imgs.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => onClick(imgs, i)} className="w-16 h-16 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
              <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <CommentsBox
        endpoint={`/reviews/${review._id}/comments`}
        comments={review.comments || []}
        onUpdated={onUpdated}
      />
    </article>
  );
}

export default function Reviews() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 0, comment: '', images: [] });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [modal, setModal] = useState({ imgs: [], idx: null });

  useEffect(() => {
    api.get('/reviews').then(r => setReviews(r.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) return setMsg({ type: 'error', text: 'Veuillez sélectionner une note' });
    if (!form.comment.trim()) return setMsg({ type: 'error', text: 'Veuillez écrire un commentaire' });

    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('rating', form.rating);
      fd.append('comment', form.comment);
      form.images.forEach(f => fd.append('images', f));

      await api.post('/reviews', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg({ type: 'success', text: t('reviews.success') });
      setForm({ rating: 0, comment: '', images: [] });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const updateReview = (updated) =>
    setReviews(list => list.map(review => review._id === updated._id ? updated : review));

  return (
    <>
      <ImageModal images={modal.imgs} index={modal.idx} onClose={() => setModal({ imgs: [], idx: null })}
        onPrev={() => setModal(m => ({ ...m, idx: (m.idx - 1 + m.imgs.length) % m.imgs.length }))}
        onNext={() => setModal(m => ({ ...m, idx: (m.idx + 1) % m.imgs.length }))} />

      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">{t('reviews.title')}</h1>
            <p className="text-stone-400 text-lg">{t('reviews.subtitle')}</p>
            {avgRating && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <span className="text-3xl font-black text-primary-400">{avgRating}</span>
                <StarRating value={Math.round(avgRating)} size="md" />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Reviews grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <LoadingSpinner center />
              ) : reviews.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl">{t('reviews.empty')}</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {reviews.map(r => (
                    <ReviewCard
                      key={r._id}
                      review={r}
                      onClick={(imgs, idx) => setModal({ imgs, idx })}
                      onUpdated={updateReview}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit form */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">{t('reviews.add_title')}</h2>

                {!user ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔐</div>
                    <p className="text-stone-500 mb-4">{t('reviews.login_required')}</p>
                    <Link to="/login" className="btn-primary text-sm">{t('nav.login')}</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {msg.text && (
                      <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                        msg.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        {t('reviews.rating_label')}
                      </label>
                      <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} size="lg" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        {t('reviews.comment_label')}
                      </label>
                      <textarea
                        className="input-field resize-none"
                        rows={4}
                        placeholder={t('reviews.comment_placeholder')}
                        value={form.comment}
                        onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        {t('reviews.photos_label')}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                        onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files) }))}
                      />
                      {form.images.length > 0 && (
                        <p className="text-xs text-stone-400 mt-1">{form.images.length} fichier(s) sélectionné(s)</p>
                      )}
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                      {submitting ? t('common.loading') : t('reviews.submit')}
                    </button>

                    <p className="text-xs text-stone-400 text-center">{t('reviews.pending_msg')}</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
