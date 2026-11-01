import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FormspreeProvider } from '@formspree/react';
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FormspreeProvider project="mkgbwvyk">
        <App />
      </FormspreeProvider>
    </BrowserRouter>
  </StrictMode>
)
