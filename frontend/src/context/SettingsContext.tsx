import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsAPI } from '../services/api';

interface Settings {
  [key: string]: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Settings) => Promise<void>;
  applyCSSVariables: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const applyCSSVariables = () => {
    const root = document.documentElement;

    // Design Colors
    if (settings.primary_color) root.style.setProperty('--color-primary', settings.primary_color);
    if (settings.secondary_color) root.style.setProperty('--color-secondary', settings.secondary_color);
    if (settings.accent_color) root.style.setProperty('--color-accent', settings.accent_color);
    if (settings.background_color) root.style.setProperty('--color-background', settings.background_color);
    if (settings.text_color) root.style.setProperty('--color-text', settings.text_color);

    // Header
    if (settings.header_background) root.style.setProperty('--header-background', settings.header_background);
    if (settings.header_text_color) root.style.setProperty('--header-text-color', settings.header_text_color);
    if (settings.header_height) root.style.setProperty('--header-height', `${settings.header_height}px`);

    // Footer
    if (settings.footer_background) root.style.setProperty('--footer-background', settings.footer_background);
    if (settings.footer_text_color) root.style.setProperty('--footer-text-color', settings.footer_text_color);

    // Typography
    if (settings.font_family) root.style.setProperty('--font-family', settings.font_family);
    if (settings.font_size_base) root.style.setProperty('--font-size-base', `${settings.font_size_base}px`);
    if (settings.heading_font) root.style.setProperty('--font-heading', settings.heading_font);
    if (settings.line_height) root.style.setProperty('--line-height', settings.line_height);
    if (settings.heading_weight) root.style.setProperty('--font-weight-heading', settings.heading_weight);
    if (settings.body_weight) root.style.setProperty('--font-weight-body', settings.body_weight);

    // Design Elements
    if (settings.button_radius) root.style.setProperty('--button-radius', `${settings.button_radius}px`);
    if (settings.button_padding) root.style.setProperty('--button-padding', settings.button_padding);
    if (settings.card_radius) root.style.setProperty('--card-radius', `${settings.card_radius}px`);
    if (settings.card_shadow) root.style.setProperty('--card-shadow', settings.card_shadow);
    if (settings.spacing_unit) root.style.setProperty('--spacing-unit', `${settings.spacing_unit}px`);
    if (settings.container_max_width) root.style.setProperty('--container-max-width', `${settings.container_max_width}px`);
  };

  const refreshSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAll();
      const settingsData = response.data.settings;

      // Convert settings object to flat key-value pairs
      const flatSettings: Settings = {};
      Object.keys(settingsData).forEach(key => {
        flatSettings[key] = settingsData[key].value;
      });

      setSettings(flatSettings);
      return flatSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await settingsAPI.updateMultiple(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      // Settings werden sofort angewendet
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Apply CSS variables whenever settings change
  useEffect(() => {
    if (!loading && Object.keys(settings).length > 0) {
      applyCSSVariables();
    }
  }, [settings, loading]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings, applyCSSVariables }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
