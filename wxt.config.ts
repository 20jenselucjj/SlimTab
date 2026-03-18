import { defineConfig } from 'wxt';

const rulesets = [
  { id: 'ads-low', path: 'rules/ads-low.json' },
  { id: 'ads-medium', path: 'rules/ads-medium.json' },
  { id: 'ads-high', path: 'rules/ads-high.json' },
  { id: 'scripts-low', path: 'rules/scripts-low.json' },
  { id: 'scripts-medium', path: 'rules/scripts-medium.json' },
  { id: 'scripts-high', path: 'rules/scripts-high.json' },
];

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  manifest: {
    name: 'SlimTab',
    short_name: 'SlimTab',
    description:
      'Free tab suspension, ad blocking, script control, and page-speed controls for Chrome.',
    version: '0.1.0',
    permissions: [
      'storage',
      'tabs',
      'alarms',
      'declarativeNetRequest',
      'declarativeNetRequestFeedback',
      'contextMenus',
    ],
    host_permissions: ['http://*/*', 'https://*/*'],
    commands: {
      suspend_inactive_tabs: {
        suggested_key: {
          default: 'Alt+Shift+S',
        },
        description: 'Suspend eligible inactive tabs in the current window',
      },
      open_dashboard: {
        suggested_key: {
          default: 'Alt+Shift+D',
        },
        description: 'Open SlimTab options',
      },
    },
    declarative_net_request: {
      rule_resources: rulesets.map((ruleset) => ({
        id: ruleset.id,
        enabled: false,
        path: ruleset.path,
      })),
    },
    web_accessible_resources: [
      {
        resources: ['rules/*.json'],
        matches: ['<all_urls>'],
      },
    ],
  },
});
