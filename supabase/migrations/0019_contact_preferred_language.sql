-- Preferred language per contact, used to pick the language of automated emails (welcome
-- sequence, purchase and review emails) and to target newsletter broadcasts.
-- Additive only: every existing contact becomes Spanish ('es'), which is the language they were
-- all emailed in until now.

alter table contacts
  add column preferred_language text not null default 'es'
  check (preferred_language in ('en', 'es'));

-- Which language audience a broadcast targeted ('all', 'en' or 'es'), shown in the history.
alter table newsletter_issues add column language text not null default 'all';
