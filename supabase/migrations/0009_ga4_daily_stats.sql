-- GA4 traffic, synced once a day by netlify/functions/sync-ga4-stats.mts (docs/CM-plan-admin-crm-analytics.md §5).
-- /admin/analytics reads this table directly — no live GA4 API calls on page load.

create table ga4_daily_stats (
  date date primary key,
  sessions int not null default 0,
  page_views int not null default 0,
  top_pages jsonb not null default '[]',
  synced_at timestamptz default now()
);
