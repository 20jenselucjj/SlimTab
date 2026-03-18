import type { PropsWithChildren } from 'react';

import '@/styles/globals.css';

export function AppShell({ children }: PropsWithChildren) {
  return <>{children}</>;
}
