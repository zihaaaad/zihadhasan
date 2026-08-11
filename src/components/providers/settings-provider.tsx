"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CMSService, GlobalSettings } from "@/lib/cms-service";

interface SettingsContextType {
 settings: GlobalSettings | null;
 loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({ settings: null, loading: true });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
 const [settings, setSettings] = useState<GlobalSettings | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 CMSService.getGlobalSettings()
 .then(setSettings)
 .catch(() => setSettings(null))
 .finally(() => setLoading(false));
 }, []);

 return (
 <SettingsContext.Provider value={{ settings, loading }}>
 {children}
 </SettingsContext.Provider>
 );
}

export function useSettings() {
 return useContext(SettingsContext);
}
