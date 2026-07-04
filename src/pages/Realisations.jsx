import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import ImageModal from '../components/ImageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentsBox from '../components/CommentsBox';

const BACKEND_URL = "https://platrerie-backend.onrender.com";

const getImageUrl = (img) => {
  if (!img) return "";
  return img.startsWith("http") ? img : `${BACKEND_URL}${img}`;
};

export default function Realisations() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ imgs: [], idx: null });

  useEffect(() => {
    api.get('/realisations')
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (imgs, idx) => setModal({ imgs, idx });
  const closeModal = () => setModal({ imgs: [], idx: null });
  const prev = () => setModal(m => ({ ...m, idx: (m.idx - 1 + m.imgs.length) % m.imgs.length }));
  const next = () => setModal(m => ({ ...m, idx: (m.idx + 1) % m.imgs.length }));
  const updateItem = (updated) =>
    setItems(list => list.map(item => item._id === updated._id ? updated : item));

  return (
    <>
      <ImageModal images={modal.imgs} index={modal.idx} onClose={closeModal} onPrev={prev} onNext={next} />

      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">{t('realisations.title')}</h1>
            <p className="text-stone-400 text-lg">{t('realisations.subtitle')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <LoadingSpinner center size="lg" />
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-xl">{t('realisations.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map(item => (
                <article key={item._id} className="card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">

                  <div className="space-y-4 p-6 bg-stone-100 dark:bg-stone-700">

                    {item.beforeImages?.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-2">
                          Avant
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {item.beforeImages.map((img, index) => (
                            <button
                              key={img}
                              onClick={() => openModal(item.beforeImages, index)}
                              className="overflow-hidden rounded-lg"
                            >
                              <img
                                src={getImageUrl(img)}
                                alt="Avant"
                                className="w-full h-24 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.afterImages?.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-2">
                          Après
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {item.afterImages.map((img, index) => (
                            <button
                              key={img}
                              onClick={() => openModal(item.afterImages, index)}
                              className="overflow-hidden rounded-lg"
                            >
                              <img
                                src={getImageUrl(img)}
                                alt="Après"
                                className="w-full h-24 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.images?.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-2">
                          Galerie
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {item.images.slice(0, 3).map((img, index) => (
                            <button
                              key={img}
                              onClick={() => openModal(item.images, index)}
                              className="overflow-hidden rounded-lg"
                            >
                              <img
                                src={getImageUrl(img)}
                                alt="Image"
                                className="w-full h-24 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="p-6">

                    <h3 className="text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="text-sm text-stone-500">
                      {item.description}
                    </p>

                    {item.images?.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {item.images.slice(0, 4).map((img, i) => (
                          <button
                            key={i}
                            onClick={() => openModal(item.images, i)}
                            className="w-12 h-12 rounded-lg overflow-hidden"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <CommentsBox
                      endpoint={`/realisations/${item._id}/comments`}
                      comments={item.comments || []}
                      onUpdated={updateItem}
                    />

                  </div>

                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}