import React from 'react'
import ReactDOM from 'react-dom/client'
import appIcon from '@/resources/build/icon.png'
import { WindowContextProvider, menuItems } from '@/lib/window'
import App from './app'
import './styles/app.css'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <WindowContextProvider titlebar={{ title: 'One Click Teach', icon: appIcon, menuItems }}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </WindowContextProvider>
  </React.StrictMode>
)
