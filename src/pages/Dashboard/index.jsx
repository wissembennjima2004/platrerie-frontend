import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stats from './Stats';
import RealisationsManager from './RealisationsManager';
import ReviewsManager from './ReviewsManager';
import UsersManager from './UsersManager';

const TABS = [
  { id: 'stats',        icon: '📊', key: 'stats' },
  { id: 'realisations', icon: '🏗️', key: 'realisations' },
  { id: 'reviews',      icon: '💬', key: 'reviews' },
  { id: 'users',        icon: '👤', key: 'users' }
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('stats');

  const renderContent = () => {
    switch (tab) {
      case 'stats':        return <Stats />;
      case 'realisations': return <RealisationsManager />;
      case 'reviews':      return <ReviewsManager />;
      case 'users':        return <UsersManager />;
      default:             return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black">{t('dashboard.title')}</h1>
          <p className="text-stone-400 text-sm mt-1">Entreprise de Plâtrerie — Administration</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <nav className="card p-2 space-y-1 sticky top-24">
              {TABS.map(({ id, icon, key }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    tab === id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  {t(`dashboard.${key}`)}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 animate-fade-in">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
