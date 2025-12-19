import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { settingsAPI } from '../services/api';
import { AdminLayout } from '../components/AdminLayout';

interface Setting {
  key: string;
  value: string;
  category: string;
  description: string;
}

export const AdminSettings: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('design');

  const [formData, setFormData] = useState({
    // Design
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    accent_color: '#28a745',
    background_color: '#ffffff',
    text_color: '#333333',

    // Typography
    font_family: 'Inter, system-ui, sans-serif',
    font_size_base: '16',
    heading_font: 'Inter, system-ui, sans-serif',

    // General
    site_name: 'Base',
    site_tagline: 'Content Management System',
    copyright_text: '© 2025 Base. Alle Rechte vorbehalten.',
    footer_text: 'Entwickelt mit Claude Code',

    // Contact
    contact_email: 'info@base.local',
    support_email: 'support@base.local',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchSettings();
  }, [isAdmin, navigate]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      const settingsObj = response.data.settings;
      setSettings(settingsObj);

      // Update form data
      const newFormData: any = {};
      Object.keys(settingsObj).forEach(key => {
        newFormData[key] = settingsObj[key].value;
      });
      setFormData(prev => ({ ...prev, ...newFormData }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await settingsAPI.updateMultiple(formData);
      setMessage('Einstellungen erfolgreich gespeichert!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Lädt Einstellungen...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="settings-page">
        <div className="settings-header">
          <h1>Einstellungen</h1>
          <p>Passe das Design und die Grundeinstellungen deiner Website an</p>
        </div>

        {message && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: message.includes('erfolgreich') ? '#d4edda' : '#f8d7da',
            color: message.includes('erfolgreich') ? '#155724' : '#721c24',
            borderRadius: '4px',
            marginBottom: '20px',
          }}>
            {message}
          </div>
        )}

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            🎨 Design
          </button>
          <button
            className={`tab-btn ${activeTab === 'typography' ? 'active' : ''}`}
            onClick={() => setActiveTab('typography')}
          >
            📝 Typografie
          </button>
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            ⚙️ Allgemein
          </button>
          <button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📧 Kontakt
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="tab-content">
              <h2>Farbschema</h2>
              <p className="tab-description">Definiere die Hauptfarben deiner Website</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="primary_color">
                    Primärfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.primary_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="primary_color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={handleChange}
                    name="primary_color"
                    placeholder="#007bff"
                    style={{ marginTop: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="secondary_color">
                    Sekundärfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.secondary_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="secondary_color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    name="secondary_color"
                    placeholder="#6c757d"
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="accent_color">
                    Akzentfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.accent_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="accent_color"
                    name="accent_color"
                    value={formData.accent_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={handleChange}
                    name="accent_color"
                    placeholder="#28a745"
                    style={{ marginTop: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="background_color">
                    Hintergrundfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.background_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="background_color"
                    name="background_color"
                    value={formData.background_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.background_color}
                    onChange={handleChange}
                    name="background_color"
                    placeholder="#ffffff"
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="text_color">
                  Textfarbe
                  <span className="color-preview" style={{ backgroundColor: formData.text_color }}></span>
                </label>
                <input
                  type="color"
                  id="text_color"
                  name="text_color"
                  value={formData.text_color}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  value={formData.text_color}
                  onChange={handleChange}
                  name="text_color"
                  placeholder="#333333"
                  style={{ marginTop: '8px', maxWidth: '300px' }}
                />
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="tab-content">
              <h2>Schriftarten & Größen</h2>
              <p className="tab-description">Konfiguriere die Typografie deiner Website</p>

              <div className="form-group">
                <label htmlFor="font_family">Basis-Schriftart</label>
                <input
                  type="text"
                  id="font_family"
                  name="font_family"
                  value={formData.font_family}
                  onChange={handleChange}
                  placeholder="Inter, system-ui, sans-serif"
                />
                <small>Gebe mehrere Schriftarten als Fallback an, getrennt durch Komma</small>
              </div>

              <div className="form-group">
                <label htmlFor="heading_font">Überschriften-Schriftart</label>
                <input
                  type="text"
                  id="heading_font"
                  name="heading_font"
                  value={formData.heading_font}
                  onChange={handleChange}
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>

              <div className="form-group">
                <label htmlFor="font_size_base">Basis-Schriftgröße (px)</label>
                <input
                  type="number"
                  id="font_size_base"
                  name="font_size_base"
                  value={formData.font_size_base}
                  onChange={handleChange}
                  min="12"
                  max="24"
                  placeholder="16"
                />
                <small>Empfohlen: 14-18px für optimale Lesbarkeit</small>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="tab-content">
              <h2>Allgemeine Einstellungen</h2>
              <p className="tab-description">Website-Name, Slogan und Copyright-Informationen</p>

              <div className="form-group">
                <label htmlFor="site_name">Website-Name</label>
                <input
                  type="text"
                  id="site_name"
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleChange}
                  placeholder="Base"
                />
              </div>

              <div className="form-group">
                <label htmlFor="site_tagline">Slogan / Tagline</label>
                <input
                  type="text"
                  id="site_tagline"
                  name="site_tagline"
                  value={formData.site_tagline}
                  onChange={handleChange}
                  placeholder="Content Management System"
                />
              </div>

              <div className="form-group">
                <label htmlFor="copyright_text">Copyright Text</label>
                <textarea
                  id="copyright_text"
                  name="copyright_text"
                  value={formData.copyright_text}
                  onChange={handleChange}
                  rows={2}
                  placeholder="© 2025 Base. Alle Rechte vorbehalten."
                />
              </div>

              <div className="form-group">
                <label htmlFor="footer_text">Footer Text</label>
                <input
                  type="text"
                  id="footer_text"
                  name="footer_text"
                  value={formData.footer_text}
                  onChange={handleChange}
                  placeholder="Entwickelt mit Claude Code"
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="tab-content">
              <h2>Kontaktinformationen</h2>
              <p className="tab-description">E-Mail-Adressen für Kontakt und Support</p>

              <div className="form-group">
                <label htmlFor="contact_email">Kontakt E-Mail</label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="info@base.local"
                />
                <small>Wird für allgemeine Anfragen verwendet</small>
              </div>

              <div className="form-group">
                <label htmlFor="support_email">Support E-Mail</label>
                <input
                  type="email"
                  id="support_email"
                  name="support_email"
                  value={formData.support_email}
                  onChange={handleChange}
                  placeholder="support@base.local"
                />
                <small>Wird für technische Support-Anfragen verwendet</small>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn-save">
              {saving ? 'Speichern...' : 'Einstellungen speichern'}
            </button>
          </div>
        </form>

        <style>{`
          .settings-page {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }

          .settings-header {
            margin-bottom: 30px;
          }

          .settings-header h1 {
            margin: 0 0 8px 0;
            color: #333;
          }

          .settings-header p {
            margin: 0;
            color: #666;
          }

          .settings-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
          }

          .tab-btn {
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            transition: all 0.2s;
            margin-bottom: -2px;
          }

          .tab-btn:hover {
            color: #333;
            background-color: #f8f9fa;
          }

          .tab-btn.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }

          .settings-form {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .tab-content h2 {
            margin: 0 0 8px 0;
            font-size: 20px;
            color: #333;
          }

          .tab-description {
            margin: 0 0 24px 0;
            color: #666;
            font-size: 14px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
          }

          .color-preview {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }

          .form-group input[type="text"],
          .form-group input[type="email"],
          .form-group input[type="number"],
          .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
          }

          .form-group input[type="color"] {
            width: 100%;
            height: 50px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            cursor: pointer;
          }

          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }

          .form-group small {
            display: block;
            margin-top: 4px;
            color: #6c757d;
            font-size: 12px;
          }

          .form-actions {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
          }

          .btn-save {
            padding: 12px 32px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .btn-save:hover:not(:disabled) {
            background-color: #0056b3;
          }

          .btn-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};
