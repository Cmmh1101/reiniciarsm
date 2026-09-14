-- Adds active users and traffic-source (channel) breakdown to the daily GA4 sync, so
-- /admin/analytics can show a stat card + a "Traffic sources" table alongside top pages.
alter table ga4_daily_stats
  add column active_users int not null default 0,
  add column traffic_sources jsonb not null default '[]';
