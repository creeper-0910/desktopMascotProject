import './assets/main.css'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import App from './App'
import { MenuBar } from './components/MenuBar'
import Edit from './Edit'
import Version from './Version'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webDarkTheme} id="provider">
      <HashRouter>
        <Routes>
          <Route path="/version" element={<Version />} />
          <Route path="/" element={<MenuBar />}>
            <Route path="/" element={<App />} />
            <Route path="/edit" element={<Edit />} />
          </Route>
        </Routes>
      </HashRouter>
    </FluentProvider>
  </StrictMode>
)
