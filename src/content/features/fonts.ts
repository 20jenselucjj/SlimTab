export function optimizeFonts(level: 'low' | 'medium' | 'high') {
  const root = document.documentElement;
  root.dataset.slimtabFonts = level;

  const style = document.createElement('style');
  style.dataset.slimtab = 'fonts';
  style.textContent = `
    :root[data-slimtab-fonts] * {
      font-family: ${
        level === 'high'
          ? "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          : "'Segoe UI', system-ui, sans-serif"
      } !important;
      text-rendering: optimizeLegibility;
    }

    ${level === 'high' ? '@font-face { font-display: swap !important; }' : ''}
  `;
  document.documentElement.append(style);
}
