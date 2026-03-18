import React from "react";
import {
  FeatureCard,
  SegmentedControl,
  SectionHeader,
} from "../../components/ui";
import type {
  SlimTabSettings,
  AutoplayStrategy,
  FontStrategy,
  PreloadStrategy,
} from "../../store/settings";

// ── Icons ────────────────────────────────────────────────────────────
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Content</title><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
);

const TypeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Fonts</title><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></svg>
);

const VolumeXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Autoplay</title><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><title>Preload</title><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);

const FONT_OPTIONS: { value: FontStrategy; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "swap", label: "Swap" },
  { value: "optional", label: "Optional" },
  { value: "system-only", label: "System" },
];

const PRELOAD_OPTIONS: { value: PreloadStrategy; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "hover", label: "On Hover" },
  { value: "viewport", label: "Viewport" },
];

const AUTOPLAY_OPTIONS: { value: AutoplayStrategy; label: string }[] = [
  { value: "allow-common", label: "Allow Common" },
  { value: "block-all", label: "Block All" },
];

interface ContentSectionProps {
  settings: SlimTabSettings;
  onUpdate: <K extends keyof SlimTabSettings>(
    key: K,
    value: SlimTabSettings[K],
  ) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <section>
      <SectionHeader
        icon={<FileTextIcon />}
        title="Content Optimization"
        description="Fine-tune fonts, media, and link behavior"
      />

      <div className="space-y-3">
        {/* Font Optimization */}
        <FeatureCard
          icon={<TypeIcon />}
          title="Font Optimization"
          description="Control how web fonts load to prevent layout shifts and improve perceived speed."
          enabled={settings.fontOptimization}
          onToggle={(v) => onUpdate("fontOptimization", v)}
        >
          <div>
            <span className="text-xs text-white/40 font-medium mb-1.5 block">
              Font Display Strategy
            </span>
            <SegmentedControl
              value={settings.fontStrategy}
              onChange={(v) => onUpdate("fontStrategy", v)}
              options={FONT_OPTIONS}
              size="sm"
            />
            <p className="mt-2 text-[11px] text-white/25 leading-relaxed">
              {settings.fontStrategy === "swap" &&
                "Show fallback font immediately, swap when custom font loads."}
              {settings.fontStrategy === "optional" &&
                "Use custom font only if already cached, otherwise use system font."}
              {settings.fontStrategy === "system-only" &&
                "Always use system fonts. Fastest but may change page appearance."}
              {settings.fontStrategy === "off" &&
                "No font optimization applied."}
            </p>
          </div>
        </FeatureCard>

        {/* Stop Autoplay */}
        <FeatureCard
          icon={<VolumeXIcon />}
          title="Stop Autoplay"
          description="Prevent videos and audio from playing automatically when pages load."
          enabled={settings.stopAutoplay}
          onToggle={(v) => onUpdate("stopAutoplay", v)}
        >
          <div>
            <span className="text-xs text-white/40 font-medium mb-1.5 block">
              Autoplay Strategy
            </span>
            <SegmentedControl
              value={settings.autoplayStrategy}
              onChange={(v) => onUpdate("autoplayStrategy", v)}
              options={AUTOPLAY_OPTIONS}
              size="sm"
            />
          </div>
        </FeatureCard>

        {/* Link Preloading */}
        <FeatureCard
          icon={<LinkIcon />}
          title="Link Preloading"
          description="Pre-fetch linked pages to make navigation feel instant."
          enabled={settings.linkPreloading}
          onToggle={(v) => onUpdate("linkPreloading", v)}
        >
          <div>
            <span className="text-xs text-white/40 font-medium mb-1.5 block">
              Preload Strategy
            </span>
            <SegmentedControl
              value={settings.preloadStrategy}
              onChange={(v) => onUpdate("preloadStrategy", v)}
              options={PRELOAD_OPTIONS}
              size="sm"
            />
            <p className="mt-2 text-[11px] text-white/25 leading-relaxed">
              {settings.preloadStrategy === "hover" &&
                "Start loading when you hover over a link. Balanced approach."}
              {settings.preloadStrategy === "viewport" &&
                "Pre-fetch all visible links. Fastest navigation, uses more data."}
              {settings.preloadStrategy === "off" &&
                "No link preloading."}
            </p>
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};
