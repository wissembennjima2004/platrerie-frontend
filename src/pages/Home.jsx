import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const services = [
  { icon: '🏛️', key: 'service1' },
  { icon: '🔧', key: 'service2' },
  { icon: '✨', key: 'service3' }
];

const stats = [
  { value: '100+', key: 'stats_projects' },
  { value: '15+',  key: 'stats_years' },
  { value: '98%',  key: 'stats_clients' }
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Électricité • Plâtrerie • Peinture • Revêtements
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              {t('home.hero_title')}
            </h1>

            <p className="text-xl text-stone-300 leading-relaxed mb-10 max-w-2xl">
              {t('home.hero_subtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/realisations" className="btn-primary text-base px-8 py-4">
                {t('home.hero_cta')}
                <span>→</span>
              </Link>
              <Link to="/avis" className="btn-secondary text-base px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                {t('nav.reviews')}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, key }) => (
              <div key={key} className="text-center text-white">
                <div className="text-4xl font-black mb-1">{value}</div>
                <div className="text-primary-100 text-sm font-medium">{t(`home.${key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                Notre Histoire
              </div>
              <h2 className="section-title mb-6">{t('home.about_title')}</h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed mb-6">
                {t('home.about_text')}
              </p>
              <div className="flex gap-4">
                <div className="flex-1 bg-stone-50 dark:bg-stone-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-primary-600">10 ans</div>
                  <div className="text-xs text-stone-500 mt-1">Garantie</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-xl shadow-primary-500/30">
                🏗️
              </div>
              <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl aspect-square flex items-center justify-center text-6xl mt-8">
                🪚
              </div>
              <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl aspect-square flex items-center justify-center text-6xl -mt-4">
                🔨
              </div>
              <div className="bg-gradient-to-br from-stone-700 to-stone-900 rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-xl">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">{t('home.services_title')}</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Nous proposons une gamme complète de services pour tous vos projets de construction et rénovation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map(({ icon, key }) => (
              <div key={key} className="card p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">{t(`home.${key}_title`)}</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{t(`home.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-stone-900 to-stone-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">{t('home.cta_title')}</h2>
          <p className="text-stone-400 text-lg mb-10">{t('home.cta_text')}</p>
          <button
            type="button"
            className="btn-primary text-base px-10 py-4 shadow-2xl"
          >
            {t('home.cta_button')}
          </button>
        </div>
      </section>
    </main>
  );
}
