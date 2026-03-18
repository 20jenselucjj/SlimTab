import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { MetricCard } from '../components/ui/MetricCard';
import { getOptionsTabFromSearch } from '../options/navigation';

describe('popup navigation helpers', () => {
  it('parses a valid options tab from the query string', () => {
    expect(getOptionsTabFromSearch('?tab=privacy')).toBe('privacy');
  });

  it('falls back to dashboard for an invalid options tab', () => {
    expect(getOptionsTabFromSearch('?tab=unknown')).toBe('dashboard');
  });

  it('renders MetricCard as a button when clickable', () => {
    const html = renderToStaticMarkup(
      <MetricCard icon={<span>M</span>} value="1" label="Metric" onClick={() => undefined} />,
    );

    expect(html.startsWith('<button')).toBe(true);
  });

  it('renders MetricCard as a div when no click handler is provided', () => {
    const html = renderToStaticMarkup(
      <MetricCard icon={<span>M</span>} value="1" label="Metric" />,
    );

    expect(html.startsWith('<div')).toBe(true);
  });
});
