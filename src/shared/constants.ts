export const EXTENSION_NAME = 'SlimTab';

export const FEATURE_KEYS = [
  'suspension',
  'ads',
  'scripts',
  'fonts',
  'priority',
  'preloading',
  'autoplay',
  'safeMode',
] as const;

export const DEFAULT_PROTECTED_HOSTS = [] as const;

export const ALARM_NAME = 'slimtab:suspension-check';

export const SUSPENSION_ESTIMATED_MEMORY_MB = 120;

export const STORAGE_KEYS = {
  settings: 'local:settings',
  stats: 'local:stats',
  tabState: 'session:tab-state',
} as const;

export const SUSPENSION_PRESETS = {
  off: 0,
  low: 15,
  medium: 5,
  high: 2,
} as const;

export const LEVELS = ['off', 'low', 'medium', 'high'] as const;

export const THEME_OPTIONS = ['system', 'dark', 'midnight'] as const;
