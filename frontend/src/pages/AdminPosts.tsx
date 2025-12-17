import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { postsAPI } from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  status: string;
  created_at: string;
}

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post> | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Verwende Mock-Daten, da die API noch keine Posts hat
      const mockPosts = [
        {
          id: 1,
          title: 'Willkommen bei MeinCMS',
          content: 'Dies ist der erste Beitrag in unserem neuen Content Management System...',
          excerpt: 'Einführung in unser neues CMS',
          category: 'Allgemein',
          author: 'Admin',
          status: 'published',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Die Vorteile von TypeScript',
          content: 'TypeScript bietet viele Vorteile für moderne Web-Entwicklung...',
          excerpt: 'Warum TypeScript verwenden?',
          category: 'Technologie',
          author: 'Admin',
          status: 'published',
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'React Best Practices',
          content: 'Lernen Sie die besten Praktiken für React-Entwicklung...',
          excerpt: 'Optimale React-Entwicklung',
          category: 'Tutorials',
          author: 'Admin',
          status: 'draft',
          created_at: new Date().toISOString(),
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft',
    });
    setShowModal(true);
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      status: post.status,
    });
    setShowModal(true);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Möchten Sie diesen Post wirklich löschen?')) return;

    try {
      // await postsAPI.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      alert('Fehler beim Löschen des Posts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentPost) {
        // Update existing post
        const updatedPost = { ...currentPost, ...formData };
        setPosts(posts.map((p) => (p.id === currentPost.id ? updatedPost as Post : p)));
      } else {
        // Create new post
        const newPost: Post = {
          id: Math.max(...posts.map((p) => p.id), 0) + 1,
          ...formData,
          author: 'Admin',
          created_at: new Date().toISOString(),
        } as Post;
        setPosts([...posts, newPost]);
      }
      setShowModal(false);
    } catch (error) {
      alert('Fehler beim Speichern des Posts');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Lädt Posts...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="posts-header">
          <div>
            <h1>Posts</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Verwalte deine Blog-Beiträge und Inhalte
            </p>
          </div>
          <button onClick={handleCreatePost} className="btn-create">
            <span>+</span>
            Neuer Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="no-results">
            <p>Keine Posts vorhanden</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  {post.category === 'Technologie' ? '💻' : post.category === 'Tutorials' ? '📚' : '📰'}
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span>👤 {post.author}</span>
                    <span>📁 {post.category}</span>
                    <span className={`status-badge ${post.status === 'published' ? 'active' : 'inactive'}`}>
                      {post.status === 'published' ? '✓ Published' : '✎ Draft'}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-actions">
                    <button onClick={() => handleEditPost(post)} className="btn-edit">
                      Bearbeiten
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn-delete-post">
                      Löschen
                    </button>
                  </div>
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
              <h2>{currentPost ? 'Post bearbeiten' : 'Neuer Post'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titel</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kurzbeschreibung</label>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategorie</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Inhalt</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #ddd' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #ddd' }}
                >
                  <option value="draft">Entwurf</option>
                  <option value="published">Veröffentlicht</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Abbrechen
                </button>
                <button type="submit" className="btn-submit">
                  {currentPost ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
