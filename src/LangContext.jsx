import { createContext, useContext, useState } from 'react';
import { UI, DATA } from './i18n.jsx';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggle = () => setLang(l => (l === 'en' ? 'fr' : 'en'));
  return (
    <LangContext.Provider value={{ lang, toggle, ui: UI[lang], data: DATA[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
