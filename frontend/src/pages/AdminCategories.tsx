import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  post_count: number;
  icon: string;
}

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    icon: '📁',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock-Daten für Kategorien
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Technologie',
          description: 'Artikel über neue Technologien und Trends',
          slug: 'technologie',
          post_count: 12,
          icon: '💻',
        },
        {
          id: 2,
          name: 'Tutorials',
          description: 'Schritt-für-Schritt Anleitungen',
          slug: 'tutorials',
          post_count: 8,
          icon: '📚',
        },
        {
          id: 3,
          name: 'Allgemein',
          description: 'Allgemeine Blog-Beiträge',
          slug: 'allgemein',
          post_count: 15,
          icon: '📰',
        },
        {
          id: 4,
          name: 'News',
          description: 'Aktuelle Nachrichten und Updates',
          slug: 'news',
          post_count: 6,
          icon: '📢',
        },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      icon: '📁',
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      icon: category.icon,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Möchten Sie diese Kategorie wirklich löschen?')) return;

    try {
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert('Fehler beim Löschen der Kategorie');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentCategory) {
        // Update existing category
        const updatedCategory = { ...currentCategory, ...formData };
        setCategories(categories.map((c) => (c.id === currentCategory.id ? updatedCategory as Category : c)));
      } else {
        // Create new category
        const newCategory: Category = {
          id: Math.max(...categories.map((c) => c.id), 0) + 1,
          ...formData,
          post_count: 0,
        } as Category;
        setCategories([...categories, newCategory]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Fehler beim Speichern der Kategorie');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Lädt Kategorien...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="posts-header">
          <div>
            <h1>Kategorien</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Organisiere deine Inhalte in Kategorien
            </p>
          </div>
          <button onClick={handleCreateCategory} className="btn-create">
            <span>+</span>
            Neue Kategorie
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="no-results">
            <p>Keine Kategorien vorhanden</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p className="category-desc">{category.description}</p>
                <p className="category-count">{category.post_count} Posts</p>
                <div className="category-actions">
                  <button onClick={() => handleEditCategory(category)} className="btn-edit">
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="btn-delete-post"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="📁"
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug (URL-Bezeichnung)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #ddd' }}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Abbrechen
                </button>
                <button type="submit" className="btn-submit">
                  {currentCategory ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
