import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_TABS = ['pending', 'accepted', 'refused'];

const statusBadge = {
  pending:  'badge bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  accepted: 'badge bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  refused:  'badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
};

export default function ReviewsManager() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = (status) => {
    setLoading(true);
    api.get(`/reviews/admin?status=${status}`)
      .then(r => setReviews(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      load(tab);
    } catch {
      alert(t('common.error'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/reviews/${deleteId}`);
      setDeleteId(null);
      load(tab);
    } catch {
      alert(t('common.error'));
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!draft.rating) {
      setMsg({ type: 'error', text: 'Veuillez sélectionner une note' });
      return;
    }
    if (!draft.comment.trim()) {
      setMsg({ type: 'error', text: 'Veuillez écrire un avis' });
      return;
    }

    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('rating', draft.rating);
      fd.append('comment', draft.comment.trim());
      await api.post('/reviews', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDraft({ rating: 0, comment: '' });
      setMsg({ type: 'success', text: 'Avis ajouté avec succès' });
      load('pending');
    } catch {
      setMsg({ type: 'error', text: t('common.error') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-3">{t('dashboard.confirm_delete')}</h3>
            <p className="text-stone-500 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">{t('dashboard.cancel')}</button>
              <button onClick={handleDelete} className="btn-danger">{t('dashboard.delete')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('dashboard.reviews')}</h2>
      </div>

      <div className="card p-5 mb-6">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-4">Laisser un avis</h3>
        <form onSubmit={handleCreateReview} className="space-y-4">
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
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Note</label>
            <StarRating value={draft.rating} onChange={v => setDraft(f => ({ ...f, rating: v }))} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Commentaire</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              value={draft.comment}
              onChange={e => setDraft(f => ({ ...f, comment: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-4">
            {submitting ? t('common.loading') : 'Publier l’avis'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 mb-6 w-fit">
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === s
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            {t(`dashboard.${s}`)}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner center /> : reviews.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-3">💬</div>
          <p>{t('dashboard.no_data')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {r.user?.firstName} {r.user?.lastName}
                    </span>
                    <span className="text-xs text-stone-400">{r.user?.email}</span>
                    <span className={statusBadge[r.status]}>{t(`dashboard.${r.status}`)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating value={r.rating} size="sm" />
                    <span className="text-xs text-stone-400">
                      {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-sm">{r.comment}</p>
                  {r.images?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {r.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-14 h-14 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(r._id, 'accepted')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors">
                        ✓ {t('dashboard.accept')}
                      </button>
                      <button onClick={() => updateStatus(r._id, 'refused')}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg font-medium transition-colors">
                        ✗ {t('dashboard.refuse')}
                      </button>
                    </>
                  )}
                  {r.status === 'accepted' && (
                    <button onClick={() => updateStatus(r._id, 'refused')}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg font-medium transition-colors">
                      ✗ {t('dashboard.refuse')}
                    </button>
                  )}
                  {r.status === 'refused' && (
                    <button onClick={() => updateStatus(r._id, 'accepted')}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors">
                      ✓ {t('dashboard.accept')}
                    </button>
                  )}
                  <button onClick={() => setDeleteId(r._id)} className="btn-danger py-1.5 px-3 text-sm">
                    {t('dashboard.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
