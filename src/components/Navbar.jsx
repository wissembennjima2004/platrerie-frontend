import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import i18n from '../i18n/index.js';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const switchLang = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('lang', lang);
};

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-stone-600 dark:text-stone-300 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-100 dark:border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <img
              src="/logo.jpeg"
              alt="BJ RÉNOVATION"
              className="w-12 h-12 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className="font-black text-stone-900 dark:text-white leading-tight text-sm">BJ</div>
              <div className="font-black text-primary-600 dark:text-primary-400 leading-tight">RÉNOVATION</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/realisations" className={linkClass}>{t('nav.realisations')}</NavLink>
            <NavLink to="/avis" className={linkClass}>{t('nav.reviews')}</NavLink>
            {isAdmin && <NavLink to="/dashboard" className={linkClass}>{t('nav.dashboard')}</NavLink>}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Lang switcher */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
              <button
                onClick={() => switchLang('fr')}
                className={`px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
                  i18n.language === 'fr'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >FR</button>
              <button
                onClick={() => switchLang('en')}
                className={`px-2.5 py-1 rounded-md text-sm font-medium transition-all ${
                  i18n.language === 'en'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >EN</button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              title={dark ? t('common.light_mode') : t('common.dark_mode')}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {user.firstName}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-stone-100 dark:border-stone-800 px-4 py-4 space-y-3 animate-fade-in"
          style={{
            backgroundImage: "url('/menu.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="backdrop-brightness-75 rounded-3xl p-4 space-y-3 bg-black/30">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>{t('nav.home')}</NavLink>
            <NavLink to="/realisations" className={({ isActive }) => `block ${linkClass({ isActive })}`} onClick={() => setOpen(false)}>{t('nav.realisations')}</NavLink>
            <NavLink to="/avis" className={({ isActive }) => `block ${linkClass({ isActive })}`} onClick={() => setOpen(false)}>{t('nav.reviews')}</NavLink>
            {isAdmin && <NavLink to="/dashboard" className={({ isActive }) => `block ${linkClass({ isActive })}`} onClick={() => setOpen(false)}>{t('nav.dashboard')}</NavLink>}
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex gap-1 bg-white/80 dark:bg-stone-900/80 rounded-lg p-1 backdrop-blur-sm">
              <button onClick={() => switchLang('fr')} className={`px-2.5 py-1 rounded-md text-sm font-medium ${i18n.language === 'fr' ? 'bg-stone-100 dark:bg-stone-700 shadow-sm' : 'text-stone-500'}`}>FR</button>
              <button onClick={() => switchLang('en')} className={`px-2.5 py-1 rounded-md text-sm font-medium ${i18n.language === 'en' ? 'bg-stone-100 dark:bg-stone-700 shadow-sm' : 'text-stone-500'}`}>EN</button>
            </div>
            <button onClick={toggle} className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white/20 dark:hover:bg-stone-800 transition-all">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {user ? (
            <button onClick={handleLogout} className="w-full btn-secondary text-sm">{t('nav.logout')}</button>
          ) : (
            <div className="space-y-2">
              <Link to="/login" className="block w-full btn-secondary text-sm text-center" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
              <Link to="/register" className="block w-full btn-primary text-sm text-center" onClick={() => setOpen(false)}>{t('nav.register')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
