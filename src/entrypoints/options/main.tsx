import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppShell } from '@/app/AppShell';
import Options from '@/options/Options';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <Options />
    </AppShell>
  </React.StrictMode>,
);
