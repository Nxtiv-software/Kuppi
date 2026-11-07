import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getPublicAppSettings } from '../services/api';

const AppSettingsContext = createContext(null);

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppSettingsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPublicAppSettings();
      // getPublicAppSettings returns response.data (which includes success + data)
      const payload = res?.data ?? res;
      setSettings(payload?.data || {});
    } catch (error) {
      console.error('Failed to load public app settings', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <AppSettingsContext.Provider value={{ loading, settings, refresh: fetchSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsContext;
