export type OptionsTabId =
  | 'dashboard'
  | 'performance'
  | 'privacy'
  | 'content'
  | 'whitelist'
  | 'preferences';

export const OPTIONS_TAB_IDS: OptionsTabId[] = [
  'dashboard',
  'performance',
  'privacy',
  'content',
  'whitelist',
  'preferences',
];

export function getOptionsTabFromSearch(search: string): OptionsTabId {
  const requestedTab = new URLSearchParams(search).get('tab');

  if (requestedTab && OPTIONS_TAB_IDS.includes(requestedTab as OptionsTabId)) {
    return requestedTab as OptionsTabId;
  }

  return 'dashboard';
}
