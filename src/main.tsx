import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import FallbackApp from './FallbackApp'
import './index.css'

// Set this to false to use the main app
const USE_FALLBACK_APP = false;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {USE_FALLBACK_APP ? <FallbackApp /> : <App />}
  </React.StrictMode>
)