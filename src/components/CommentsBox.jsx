import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CommentsBox({ endpoint, comments = [], onUpdated }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const reviewId = endpoint.split('/')[2];
  const isAdmin = user?.role === 'admin';

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setError('Commentaire requis');

    setSaving(true);
    setError('');
    try {
      const { data } = await api.post(endpoint, { text: text.trim() });
      setText('');
      setOpen(true);
      onUpdated?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const { data } = await api.delete(`/reviews/${reviewId}/comments/${commentId}`);
      onUpdated?.(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur serveur');
    }
  };

  return (
    <div className="mt-5 border-t border-stone-100 dark:border-stone-700 pt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
      >
        Commenter ({comments.length})
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment._id} className="rounded-lg bg-stone-50 dark:bg-stone-800 p-3">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-sm font-semibold text-stone-900 dark:text-white">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => deleteComment(comment._id)}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {!user ? (
            <p className="text-sm text-stone-500">
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Connectez-vous
              </Link>{' '}
              pour ajouter un commentaire.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-2">
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder={isAdmin ? 'Répondre à cet avis...' : 'Ajouter un commentaire...'}
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-4">
                {saving ? 'Envoi...' : 'Publier'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
