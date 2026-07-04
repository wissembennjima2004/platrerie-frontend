import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="BJ RÉNOVATION"
                className="w-12 h-12 object-contain rounded-xl"
              />
              <div>
                <div className="text-white font-black text-sm">BJ</div>
                <div className="text-primary-500 font-black">RÉNOVATION</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Électricité, plâtrerie, peinture et revêtements de sol en France.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/realisations" className="hover:text-primary-400 transition-colors">{t('nav.realisations')}</Link></li>
              <li><Link to="/avis" className="hover:text-primary-400 transition-colors">{t('nav.reviews')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 France</li>
              <li>📞 0771760632</li>
              <li>✉️ BJ.RENOVATION@LAPOSTE.NET</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} BJ RÉNOVATION. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
