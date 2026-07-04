import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;
  const devOtp = location.state?.devOtp;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return setError('Entrez les 6 chiffres');

    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: code });
      setSuccess(data.message);
      login(data.token, data.user);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      setCountdown(60);
      setError('');
      setSuccess('Nouveau code envoyé !');
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✉️</span>
          </div>

          <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2">{t('auth.otp_title')}</h1>
          <p className="text-stone-500 text-sm mb-1">{t('auth.otp_subtitle')}</p>
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-4">{email}</p>

          {devOtp && (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl px-4 py-3 mb-4 text-center">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">⚠️ Mode DEV — Email non configuré</p>
              <p className="text-2xl font-black tracking-widest text-amber-800 dark:text-amber-300">{devOtp}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-4 py-3 rounded-xl text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
                    border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800
                    text-stone-900 dark:text-white
                    focus:outline-none focus:border-primary-500 dark:focus:border-primary-500
                    transition-all duration-200"
                />
              ))}
            </div>

            <button type="submit" disabled={loading || otp.join('').length !== 6} className="btn-primary w-full py-3.5 text-base mb-4">
              {loading ? t('common.loading') : t('auth.otp_btn')}
            </button>

            <div className="text-sm text-stone-500">
              {countdown > 0 ? (
                <span>{t('auth.otp_resend_in')} <strong className="text-primary-600 dark:text-primary-400">{countdown}s</strong></span>
              ) : (
                <button type="button" onClick={handleResend} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  {t('auth.otp_resend')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
