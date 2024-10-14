import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import GlobalMapContext from './contexts/GlobalMapContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalMapContext>
      <App />
    </GlobalMapContext>
  </StrictMode>,
)
