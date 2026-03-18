import type { Settings } from '@/shared/types/settings';

const STATIC_RULESETS = ['ads-low', 'ads-medium', 'ads-high', 'scripts-low', 'scripts-medium', 'scripts-high'] as const;
const DYNAMIC_RULE_ID_BASE = 90_000;

function pickAdsRuleset(level: Settings['blocking']['adsLevel']) {
  if (level === 'off') return [];
  if (level === 'low') return ['ads-low'];
  if (level === 'medium') return ['ads-medium'];
  return ['ads-high'];
}

function pickScriptsRuleset(level: Settings['blocking']['scriptsLevel']) {
  if (level === 'off') return [];
  if (level === 'low') return ['scripts-low'];
  if (level === 'medium') return ['scripts-medium'];
  return ['scripts-high'];
}

function buildAllowRule(
  id: number,
  pattern: string,
  resourceTypes: chrome.declarativeNetRequest.ResourceType[],
) {
  const hostname = pattern.replace(/^\*\./u, '');
  return {
    id,
    priority: 1000,
    action: {
      type: 'allow' as const,
    },
    condition: {
      initiatorDomains: [hostname],
      resourceTypes,
    },
  };
}

export async function reconcileRulesets(settings: Settings) {
  const target = new Set([...pickAdsRuleset(settings.blocking.adsLevel), ...pickScriptsRuleset(settings.blocking.scriptsLevel)]);
  const enabled = await chrome.declarativeNetRequest.getEnabledRulesets();
  const disableRulesetIds = STATIC_RULESETS.filter((id) => enabled.includes(id) && !target.has(id));
  const enableRulesetIds = [...target].filter((id) => !enabled.includes(id));

  await chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds, enableRulesetIds });

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const addRules = settings.whitelist.flatMap((entry, index) => {
    const rules: chrome.declarativeNetRequest.Rule[] = [];
    const idBase = DYNAMIC_RULE_ID_BASE + index * 10;

    if (entry.features.includes('ads')) {
      rules.push(buildAllowRule(idBase + 1, entry.pattern, ['image', 'sub_frame', 'xmlhttprequest', 'media', 'font']));
    }

    if (entry.features.includes('scripts')) {
      rules.push(buildAllowRule(idBase + 2, entry.pattern, ['script']));
    }

    return rules;
  });

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.filter((rule) => rule.id >= DYNAMIC_RULE_ID_BASE).map((rule) => rule.id),
    addRules,
  });
}
