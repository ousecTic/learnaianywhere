import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// A hello for anyone who opens the browser's console.
console.log(
  '%cHey, Henry here! If you’re reading this, know that you’re amazing, and I hope you have a wonderful day :)',
  'font-size: 16px; font-weight: 700; color: #2B8AC4;',
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
