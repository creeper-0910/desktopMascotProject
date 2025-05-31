import './assets/main.css'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webDarkTheme} id="provider">
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </HashRouter>
    </FluentProvider>
  </StrictMode>
)
