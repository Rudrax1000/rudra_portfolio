import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ReactLenis } from 'lenis/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root>
      <App />
    </ReactLenis>
  </StrictMode>,
);
