import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'

import './i18n'; // <-- Ensure this initializes i18n
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n' // <-- Path to your i18n.ts file

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
