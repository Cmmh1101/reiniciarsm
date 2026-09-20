-- Records which audience segment a broadcast targeted, shown in the "Enviados anteriormente" history.
alter table newsletter_issues add column audience text not null default 'all';
