import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

import global_en from "./translations/en/global.json";
import global_si from "./translations/si/global.json";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./context/AuthContext.jsx";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",  // default language
  resources: {
    en: {
      global: global_en,
    },
    si: {
      global: global_si,
    }
  },
  defaultNS: 'global',  // default namespace
  ns: ['global'],       // namespaces used
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <I18nextProvider i18n={i18next}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </I18nextProvider>
    </ClerkProvider>
  </React.StrictMode>
);
