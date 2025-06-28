import React from 'react'
import ReactDOM from 'react-dom/client'
import appIcon from '@/resources/build/icon.png'
import { WindowContextProvider, menuItems } from '@/lib/window'
import App from './app'
import './styles/app.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <WindowContextProvider titlebar={{ title: 'One Click Teach App', icon: appIcon, menuItems }}>
      <App />
    </WindowContextProvider>
  </React.StrictMode>
)
