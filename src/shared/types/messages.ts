import type { DashboardStats, Settings, TabSignal } from './settings';

export type RuntimeRequest =
  | { type: 'settings:get' }
  | { type: 'settings:update'; value: Settings }
  | { type: 'stats:get' }
  | {
      type: 'stats:increment';
      value: Partial<DashboardStats>;
    }
  | { type: 'tab:suspend-current' }
  | { type: 'tab:signal'; value: Omit<TabSignal, 'tabId'> }
  | { type: 'site:disable-temporarily'; hostname: string; minutes?: number }
  | { type: 'site:get-policy'; hostname: string };

export type RuntimeResponse =
  | { ok: true; settings: Settings }
  | { ok: true; stats: DashboardStats }
  | { ok: true; suspended: boolean }
  | { ok: true; policy: { safeMode: boolean; exemptions: string[]; protectedHost: boolean } }
  | { ok: false; error: string };
