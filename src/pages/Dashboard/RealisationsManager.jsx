import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const BACKEND_URL = "https://platrerie-backend.onrender.com";

const getImageUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http")
    ? img
    : `${BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};

const emptyForm = () => ({
  title: '',
  description: '',
  date: '',
  beforeImages: [],
  afterImages: [],
  images: [],
  existingBeforeImages: [],
  existingAfterImages: [],
  existingImages: []
});

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-700">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function RealisationsManager() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [moveLoading, setMoveLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/realisations').then(r => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      date: item.date ? item.date.slice(0, 10) : '',
      beforeImages: [],
      afterImages: [],
      images: [],
      existingBeforeImages: item.beforeImages || [],
      existingAfterImages: item.afterImages || [],
      existingImages: item.images || []
    });
    setError('');
    setShowModal(true);
  };

  const removeExistingBefore = (img) =>
    setForm(f => ({ ...f, existingBeforeImages: f.existingBeforeImages.filter(i => i !== img) }));

  const removeExistingAfter = (img) =>
    setForm(f => ({ ...f, existingAfterImages: f.existingAfterImages.filter(i => i !== img) }));

  const removeExisting = (img) =>
    setForm(f => ({ ...f, existingImages: f.existingImages.filter(i => i !== img) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setError('Titre et description requis');
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (form.date) fd.append('date', form.date);
      form.beforeImages.forEach(f => fd.append('beforeImages', f));
      form.afterImages.forEach(f => fd.append('afterImages', f));
      form.images.forEach(f => fd.append('images', f));
      if (editing) {
        form.existingBeforeImages.forEach(img => fd.append('existingBeforeImages', img));
        form.existingAfterImages.forEach(img => fd.append('existingAfterImages', img));
        form.existingImages.forEach(img => fd.append('existingImages', img));
      }

      if (editing) {
        await api.put(`/realisations/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/realisations', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/realisations/${deleteId}`);
      setDeleteId(null);
      load();
    } catch {
      alert(t('common.error'));
    }
  };

  const moveItem = async (id, direction) => {
    setMoveLoading(true);
    try {
      await api.put(`/realisations/${id}/move`, { direction });
      load();
    } catch {
      alert(t('common.error'));
    } finally {
      setMoveLoading(false);
    }
  };

  return (
    <>
      {/* Delete confirm */}
      {deleteId && (
        <Modal title={t('dashboard.confirm_delete')} onClose={() => setDeleteId(null)}>
          <p className="text-stone-600 dark:text-stone-400 mb-6">Cette action est irréversible.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn-secondary">{t('dashboard.cancel')}</button>
            <button onClick={handleDelete} className="btn-danger">{t('dashboard.delete')}</button>
          </div>
        </Modal>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal title={editing ? t('dashboard.edit') : t('dashboard.add_realisation')} onClose={() => setShowModal(false)}>
          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">{t('dashboard.title_field')} *</label>
              <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">{t('dashboard.description_field')} *</label>
              <textarea className="input-field resize-none" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">{t('dashboard.date_field')}</label>
              <input type="date" className="input-field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>

            {editing && (form.existingBeforeImages.length > 0 || form.existingAfterImages.length > 0 || form.existingImages.length > 0) && (
              <div className="grid gap-4 md:grid-cols-3">
                {form.existingBeforeImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Avant - images actuelles</label>
                    <div className="flex flex-wrap gap-2">
                      {form.existingBeforeImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={getImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button type="button" onClick={() => removeExistingBefore(img)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {form.existingAfterImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Après - images actuelles</label>
                    <div className="flex flex-wrap gap-2">
                      {form.existingAfterImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={getImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button type="button" onClick={() => removeExistingAfter(img)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {form.existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Autres images actuelles</label>
                    <div className="flex flex-wrap gap-2">
                      {form.existingImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={getImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button type="button" onClick={() => removeExisting(img)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Images Avant</label>
                <input type="file" accept="image/*" multiple
                  className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                  onChange={e => setForm(f => ({ ...f, beforeImages: Array.from(e.target.files) }))} />
                {form.beforeImages.length > 0 && <p className="text-xs text-stone-400 mt-1">{form.beforeImages.length} fichier(s)</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Images Après</label>
                <input type="file" accept="image/*" multiple
                  className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                  onChange={e => setForm(f => ({ ...f, afterImages: Array.from(e.target.files) }))} />
                {form.afterImages.length > 0 && <p className="text-xs text-stone-400 mt-1">{form.afterImages.length} fichier(s)</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Autres images</label>
              <input type="file" accept="image/*" multiple
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files) }))} />
              {form.images.length > 0 && <p className="text-xs text-stone-400 mt-1">{form.images.length} fichier(s)</p>}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{t('dashboard.cancel')}</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? t('common.loading') : t('dashboard.save')}</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('dashboard.realisations')}</h2>
        <button onClick={openCreate} className="btn-primary text-sm">+ {t('dashboard.add_realisation')}</button>
      </div>

      {loading ? <LoadingSpinner center /> : items.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-3">🏗️</div>
          <p>{t('dashboard.no_data')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              {item.images?.[0] ? (
<img
  src={getImageUrl(item.images[0])}
  alt={item.title}
  className="w-20 h-20 object-cover rounded-xl shrink-0"
/>
              ) : (
                <div className="w-20 h-20 bg-stone-100 dark:bg-stone-700 rounded-xl flex items-center justify-center text-3xl shrink-0">🏗️</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-900 dark:text-white truncate">{item.title}</h3>
                <p className="text-sm text-stone-500 line-clamp-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-stone-400">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                  <span className="text-xs text-stone-400">📷 {item.images.length}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => moveItem(item._id, 'up')}
                    disabled={moveLoading}
                    className="btn-secondary text-sm py-1.5 px-3"
                  >↑</button>
                  <button
                    onClick={() => moveItem(item._id, 'down')}
                    disabled={moveLoading}
                    className="btn-secondary text-sm py-1.5 px-3"
                  >↓</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="btn-secondary text-sm py-1.5 px-3">{t('dashboard.edit')}</button>
                  <button onClick={() => setDeleteId(item._id)} className="btn-danger text-sm py-1.5 px-3">{t('dashboard.delete')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
