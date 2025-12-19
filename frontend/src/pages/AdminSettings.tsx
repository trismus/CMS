import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';

// Liste verfügbarer Schriftarten
const FONT_OPTIONS = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter (Standard)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: '"Open Sans", sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Normal (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi-Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra-Bold (800)' },
];

export const AdminSettings: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { settings: contextSettings, updateSettings, applyCSSVariables } = useSettings();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('design');

  const [formData, setFormData] = useState({
    // Design Colors
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    accent_color: '#28a745',
    background_color: '#ffffff',
    text_color: '#333333',

    // Header
    header_background: '#ffffff',
    header_text_color: '#333333',
    header_height: '70',
    header_logo_text: 'Base',

    // Footer
    footer_background: '#2c3e50',
    footer_text_color: '#ecf0f1',

    // Design Elements
    button_radius: '4',
    button_padding: '10px 20px',
    card_radius: '8',
    card_shadow: '0 2px 4px rgba(0,0,0,0.1)',
    spacing_unit: '8',
    container_max_width: '1200',

    // Typography
    font_family: 'Inter, system-ui, sans-serif',
    font_size_base: '16',
    heading_font: 'Inter, system-ui, sans-serif',
    line_height: '1.6',
    heading_weight: '600',
    body_weight: '400',

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

    // Load settings from context
    if (Object.keys(contextSettings).length > 0) {
      setFormData(prev => ({ ...prev, ...contextSettings }));
    }
  }, [isAdmin, navigate, contextSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateSettings(formData);
      // CSS-Variablen werden automatisch durch den Context aktualisiert
      applyCSSVariables();
      setMessage('Einstellungen erfolgreich gespeichert und angewendet!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="settings-page">
        <div className="settings-header">
          <h1>Einstellungen</h1>
          <p>Passe das Design und die Grundeinstellungen deiner Website an. Änderungen werden sofort live angewendet.</p>
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
            className={`tab-btn ${activeTab === 'header' ? 'active' : ''}`}
            onClick={() => setActiveTab('header')}
          >
            📐 Header
          </button>
          <button
            className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`}
            onClick={() => setActiveTab('footer')}
          >
            📊 Footer
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
              <h2>Farbschema & Design-Elemente</h2>
              <p className="tab-description">Definiere die Hauptfarben und Design-Eigenschaften</p>

              <h3>Hauptfarben</h3>
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

              <h3>Buttons</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="button_radius">Button Border Radius (px)</label>
                  <input
                    type="number"
                    id="button_radius"
                    name="button_radius"
                    value={formData.button_radius}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="button_padding">Button Padding</label>
                  <input
                    type="text"
                    id="button_padding"
                    name="button_padding"
                    value={formData.button_padding}
                    onChange={handleChange}
                    placeholder="10px 20px"
                  />
                </div>
              </div>

              <h3>Cards & Container</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="card_radius">Card Border Radius (px)</label>
                  <input
                    type="number"
                    id="card_radius"
                    name="card_radius"
                    value={formData.card_radius}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="container_max_width">Container Max Width (px)</label>
                  <input
                    type="number"
                    id="container_max_width"
                    name="container_max_width"
                    value={formData.container_max_width}
                    onChange={handleChange}
                    min="800"
                    max="2000"
                    step="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="card_shadow">Card Shadow (CSS)</label>
                  <input
                    type="text"
                    id="card_shadow"
                    name="card_shadow"
                    value={formData.card_shadow}
                    onChange={handleChange}
                    placeholder="0 2px 4px rgba(0,0,0,0.1)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="spacing_unit">Spacing Unit (px)</label>
                  <input
                    type="number"
                    id="spacing_unit"
                    name="spacing_unit"
                    value={formData.spacing_unit}
                    onChange={handleChange}
                    min="4"
                    max="24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Header Tab */}
          {activeTab === 'header' && (
            <div className="tab-content">
              <h2>Header-Einstellungen</h2>
              <p className="tab-description">Konfiguriere Aussehen und Verhalten des Headers</p>

              <div className="form-group">
                <label htmlFor="header_logo_text">Logo Text</label>
                <input
                  type="text"
                  id="header_logo_text"
                  name="header_logo_text"
                  value={formData.header_logo_text}
                  onChange={handleChange}
                  placeholder="Base"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="header_background">
                    Header Hintergrundfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.header_background }}></span>
                  </label>
                  <input
                    type="color"
                    id="header_background"
                    name="header_background"
                    value={formData.header_background}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.header_background}
                    onChange={handleChange}
                    name="header_background"
                    placeholder="#ffffff"
                    style={{ marginTop: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="header_text_color">
                    Header Textfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.header_text_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="header_text_color"
                    name="header_text_color"
                    value={formData.header_text_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.header_text_color}
                    onChange={handleChange}
                    name="header_text_color"
                    placeholder="#333333"
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="header_height">Header Höhe (px)</label>
                <input
                  type="number"
                  id="header_height"
                  name="header_height"
                  value={formData.header_height}
                  onChange={handleChange}
                  min="50"
                  max="150"
                />
                <small>Empfohlen: 60-80px</small>
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div className="tab-content">
              <h2>Footer-Einstellungen</h2>
              <p className="tab-description">Konfiguriere Aussehen des Footers</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="footer_background">
                    Footer Hintergrundfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.footer_background }}></span>
                  </label>
                  <input
                    type="color"
                    id="footer_background"
                    name="footer_background"
                    value={formData.footer_background}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.footer_background}
                    onChange={handleChange}
                    name="footer_background"
                    placeholder="#2c3e50"
                    style={{ marginTop: '8px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="footer_text_color">
                    Footer Textfarbe
                    <span className="color-preview" style={{ backgroundColor: formData.footer_text_color }}></span>
                  </label>
                  <input
                    type="color"
                    id="footer_text_color"
                    name="footer_text_color"
                    value={formData.footer_text_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.footer_text_color}
                    onChange={handleChange}
                    name="footer_text_color"
                    placeholder="#ecf0f1"
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="tab-content">
              <h2>Schriftarten & Typografie</h2>
              <p className="tab-description">Konfiguriere die Typografie deiner Website</p>

              <div className="form-group">
                <label htmlFor="font_family">Basis-Schriftart</label>
                <select
                  id="font_family"
                  name="font_family"
                  value={formData.font_family}
                  onChange={handleChange}
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <small>Wird für normalen Text verwendet</small>
              </div>

              <div className="form-group">
                <label htmlFor="heading_font">Überschriften-Schriftart</label>
                <select
                  id="heading_font"
                  name="heading_font"
                  value={formData.heading_font}
                  onChange={handleChange}
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <small>Wird für H1, H2, H3, etc. verwendet</small>
              </div>

              <div className="form-row">
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
                  />
                  <small>Empfohlen: 14-18px</small>
                </div>

                <div className="form-group">
                  <label htmlFor="line_height">Zeilenhöhe</label>
                  <input
                    type="number"
                    id="line_height"
                    name="line_height"
                    value={formData.line_height}
                    onChange={handleChange}
                    min="1"
                    max="3"
                    step="0.1"
                  />
                  <small>Empfohlen: 1.4-1.8</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="heading_weight">Überschriften Schriftstärke</label>
                  <select
                    id="heading_weight"
                    name="heading_weight"
                    value={formData.heading_weight}
                    onChange={handleChange}
                  >
                    {FONT_WEIGHT_OPTIONS.map(weight => (
                      <option key={weight.value} value={weight.value}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="body_weight">Text Schriftstärke</label>
                  <select
                    id="body_weight"
                    name="body_weight"
                    value={formData.body_weight}
                    onChange={handleChange}
                  >
                    {FONT_WEIGHT_OPTIONS.map(weight => (
                      <option key={weight.value} value={weight.value}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>
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
              {saving ? 'Speichern...' : 'Einstellungen speichern & anwenden'}
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
            overflow-x: auto;
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
            white-space: nowrap;
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

          .tab-content h3 {
            margin: 30px 0 16px 0;
            font-size: 16px;
            color: #555;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 8px;
          }

          .tab-content h3:first-of-type {
            margin-top: 20px;
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
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
          }

          .form-group select {
            cursor: pointer;
            background-color: white;
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
