import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type Rule = chrome.declarativeNetRequest.Rule;
type ResourceType = chrome.declarativeNetRequest.ResourceType;

type RuleSeed = {
  domain: string;
  resourceTypes: ResourceType[];
};

type RuleSetSeed = {
  name: string;
  seeds: RuleSeed[];
};

const ruleDir = path.resolve(process.cwd(), 'public', 'rules');
const FILTER_BUILD_ENABLED = process.env.SLIMTAB_FETCH_FILTERS === 'true';

const filterSources = {
  easyList: 'https://easylist-downloads.adblockplus.org/easylist.txt',
  easyPrivacy: 'https://easylist-downloads.adblockplus.org/easyprivacy.txt',
  peterLowe:
    'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0',
} as const;

const adLowSeeds: RuleSeed[] = [
  { domain: 'doubleclick.net', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'googlesyndication.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'googleadservices.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'adnxs.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'taboola.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'outbrain.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'criteo.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'scorecardresearch.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'zedo.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'rubiconproject.com', resourceTypes: ['image', 'sub_frame', 'xmlhttprequest', 'media'] },
  { domain: 'moatads.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'quantserve.com', resourceTypes: ['xmlhttprequest', 'image'] },
];

const adMediumSeeds: RuleSeed[] = [
  ...adLowSeeds,
  { domain: 'hotjar.com', resourceTypes: ['xmlhttprequest', 'image', 'sub_frame'] },
  { domain: 'fullstory.com', resourceTypes: ['xmlhttprequest', 'image', 'sub_frame'] },
  { domain: 'optimizely.com', resourceTypes: ['xmlhttprequest', 'sub_frame'] },
  { domain: 'segment.io', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'segment.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'mixpanel.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'amplitude.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'newrelic.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'nr-data.net', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'demdex.net', resourceTypes: ['xmlhttprequest', 'image', 'sub_frame'] },
  { domain: 'bluekai.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'adsafeprotected.com', resourceTypes: ['xmlhttprequest', 'image', 'sub_frame'] },
];

const adHighSeeds: RuleSeed[] = [
  ...adMediumSeeds,
  { domain: 'facebook.net', resourceTypes: ['xmlhttprequest', 'image', 'sub_frame'] },
  { domain: 'facebook.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'linkedin.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'snapchat.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'tiktok.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'bing.com', resourceTypes: ['xmlhttprequest', 'image'] },
  { domain: 'redditstatic.com', resourceTypes: ['image', 'xmlhttprequest'] },
  { domain: 'redditmedia.com', resourceTypes: ['image', 'media'] },
  { domain: 'branch.io', resourceTypes: ['xmlhttprequest', 'image'] },
];

const scriptLowSeeds: RuleSeed[] = [
  { domain: 'googletagmanager.com', resourceTypes: ['script'] },
  { domain: 'google-analytics.com', resourceTypes: ['script'] },
  { domain: 'connect.facebook.net', resourceTypes: ['script'] },
  { domain: 'static.hotjar.com', resourceTypes: ['script'] },
  { domain: 'script.crazyegg.com', resourceTypes: ['script'] },
  { domain: 'cdn.segment.com', resourceTypes: ['script'] },
  { domain: 'cdn.mxpnl.com', resourceTypes: ['script'] },
];

const scriptMediumSeeds: RuleSeed[] = [
  ...scriptLowSeeds,
  { domain: 'js-agent.newrelic.com', resourceTypes: ['script'] },
  { domain: 'snap.licdn.com', resourceTypes: ['script'] },
  { domain: 'bat.bing.com', resourceTypes: ['script'] },
  { domain: 'www.googleoptimize.com', resourceTypes: ['script'] },
  { domain: 'cdn.mouseflow.com', resourceTypes: ['script'] },
  { domain: 'js.hs-scripts.com', resourceTypes: ['script'] },
  { domain: 'platform.twitter.com', resourceTypes: ['script'] },
];

const scriptHighSeeds: RuleSeed[] = [
  ...scriptMediumSeeds,
  { domain: 'platform.linkedin.com', resourceTypes: ['script'] },
  { domain: 'platform.instagram.com', resourceTypes: ['script'] },
  { domain: 's.pinimg.com', resourceTypes: ['script'] },
  { domain: 'embed.tawk.to', resourceTypes: ['script'] },
  { domain: 'cdn.onesignal.com', resourceTypes: ['script'] },
  { domain: 'widget.intercom.io', resourceTypes: ['script'] },
];

const fallbackRuleSets: RuleSetSeed[] = [
  { name: 'ads-low', seeds: adLowSeeds },
  { name: 'ads-medium', seeds: adMediumSeeds },
  { name: 'ads-high', seeds: adHighSeeds },
  { name: 'scripts-low', seeds: scriptLowSeeds },
  { name: 'scripts-medium', seeds: scriptMediumSeeds },
  { name: 'scripts-high', seeds: scriptHighSeeds },
];

function toRule(id: number, seed: RuleSeed): Rule {
  return {
    id,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `||${seed.domain}^`,
      resourceTypes: seed.resourceTypes,
    },
  };
}

function sanitizeFilterLines(raw: string): string[] {
  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (line.startsWith('!') || line.startsWith('[')) return false;
      if (line.includes('##') || line.includes('#@#')) return false;
      return true;
    });
}

async function buildFromAbpSources(): Promise<Record<string, Rule[]>> {
  const pkg = await import('@eyeo/abp2dnr');
  const convertFilter = pkg.convertFilter as undefined | ((filter: string) => Promise<Omit<Rule, 'id'>[]>);
  const isRegexSupported = pkg.isRegexSupported as
    | undefined
    | ((options: { regex: string; isCaseSensitive: boolean; requireCapturing: boolean }) => {
        isSupported: boolean;
      });

  if (!convertFilter) {
    throw new Error('Expected @eyeo/abp2dnr to export convertFilter.');
  }

  const responses = await Promise.all(
    Object.entries(filterSources).map(async ([name, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download ${name}: ${response.status}`);
      return [name, sanitizeFilterLines(await response.text())] as const;
    }),
  );

  const combinedLines = responses.flatMap(([, lines]) => lines);
  const allRules: Rule[] = [];
  let nextId = 1;

  for (const line of combinedLines) {
    try {
      const converted = await convertFilter(line);
      for (const rule of converted) {
        const maybeRegex = rule.condition?.regexFilter;
        if (maybeRegex && isRegexSupported) {
          const validation = isRegexSupported({
            regex: maybeRegex,
            isCaseSensitive: Boolean(rule.condition?.isUrlFilterCaseSensitive),
            requireCapturing: false,
          });

          if (!validation.isSupported) continue;
        }

        allRules.push({ ...rule, id: nextId++ });
      }
    } catch {
      continue;
    }
  }

  const ads = allRules.filter((rule) => rule.action.type === 'block' && rule.condition.resourceTypes?.some((type) => type !== 'script'));
  const scripts = allRules.filter((rule) => rule.action.type === 'block' && rule.condition.resourceTypes?.includes('script'));

  return {
    'ads-low': ads.slice(0, Math.min(6000, ads.length)),
    'ads-medium': ads.slice(0, Math.min(12000, ads.length)),
    'ads-high': ads.slice(0, Math.min(24000, ads.length)),
    'scripts-low': scripts.slice(0, Math.min(2000, scripts.length)),
    'scripts-medium': scripts.slice(0, Math.min(4000, scripts.length)),
    'scripts-high': scripts.slice(0, Math.min(8000, scripts.length)),
  };
}

async function writeRules(name: string, rules: Rule[]) {
  await writeFile(path.join(ruleDir, `${name}.json`), JSON.stringify(rules, null, 2));
}

async function main() {
  await mkdir(ruleDir, { recursive: true });

  if (FILTER_BUILD_ENABLED) {
    try {
      const built = await buildFromAbpSources();
      await Promise.all(Object.entries(built).map(([name, rules]) => writeRules(name, rules)));
      return;
    } catch (error) {
      console.warn('Falling back to bundled seed rules because ABP conversion failed.');
      console.warn(error);
    }
  }

  await Promise.all(
    fallbackRuleSets.map(async ({ name, seeds }) => {
      const rules = seeds.map((seed, index) => toRule(index + 1, seed));
      await writeRules(name, rules);
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
