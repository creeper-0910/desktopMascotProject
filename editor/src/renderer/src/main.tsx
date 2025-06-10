import './assets/main.css'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import App from './App'
import Edit from './Edit'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webDarkTheme} id="provider">
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </HashRouter>
    </FluentProvider>
  </StrictMode>
)
