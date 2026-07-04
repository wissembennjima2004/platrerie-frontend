import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`card p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</p>
        <p className="text-4xl font-black text-stone-900 dark:text-white mt-1">{value ?? '—'}</p>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
);

export default function Stats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner center />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard label={t('dashboard.total_users')} value={stats?.totalUsers} icon="👤" color="border-blue-500" />
      <StatCard label={t('dashboard.total_realisations')} value={stats?.totalRealisations} icon="🏗️" color="border-primary-500" />
      <StatCard label={t('dashboard.total_reviews')} value={stats?.totalReviews} icon="💬" color="border-purple-500" />
      <StatCard label={t('dashboard.pending_reviews')} value={stats?.pendingReviews} icon="⏳" color="border-orange-500" />
    </div>
  );
}
