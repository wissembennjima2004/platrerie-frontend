import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UsersManager() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/users/${deleteId}`);
      setDeleteId(null);
      load();
    } catch {
      alert(t('common.error'));
    }
  };

  return (
    <>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-3">{t('dashboard.confirm_delete')}</h3>
            <p className="text-stone-500 text-sm mb-6">L'utilisateur et ses données seront supprimés.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">{t('dashboard.cancel')}</button>
              <button onClick={handleDelete} className="btn-danger">{t('dashboard.delete')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('dashboard.users')}</h2>
        <span className="text-sm text-stone-500">{users.length} utilisateur(s)</span>
      </div>

      {loading ? <LoadingSpinner center /> : users.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-3">👤</div>
          <p>{t('dashboard.no_data')}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 dark:bg-stone-700/50">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold text-stone-600 dark:text-stone-300">Nom</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-stone-600 dark:text-stone-300">Email</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-stone-600 dark:text-stone-300">Statut</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-stone-600 dark:text-stone-300">Inscrit le</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-stone-600 dark:text-stone-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <span className="font-medium text-stone-900 dark:text-white">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${u.isVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'}`}>
                        {u.isVerified ? '✓ Vérifié' : '⏳ Non vérifié'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setDeleteId(u._id)} className="btn-danger py-1.5 px-3 text-xs">
                        {t('dashboard.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
