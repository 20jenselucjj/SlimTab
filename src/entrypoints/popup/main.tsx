import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppShell } from '@/app/AppShell';
import Popup from '@/popup/Popup';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <Popup />
    </AppShell>
  </React.StrictMode>,
);
