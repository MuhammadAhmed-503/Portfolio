# Changelog

All notable changes to this repository are recorded in this file.

## 2026-05-23
- Admin UI: Reworked login overlay to accept email + password and integrated Supabase client (frontend)
- Added `Publish` and `Undo` actions in admin header; live preview iframe added
- Implemented Supabase save (upsert) and backup insert stubs (`portfolio`, `portfolio_backups`)
- Added undo stack for drag-and-drop reordering
- Improved drag visual indicator and dragleave handling
- Service worker: kept network-first strategy for HTML/CSS/JS to avoid stale styling
- Manifest: switched to relative `start_url`/`scope` for better portability
- Sitemap: added explicit `index.html` entry
- Added Supabase migration SQL at `SUPABASE_MIGRATION.sql`

If you want a deployed migration applied to your Supabase project, follow the SQL file instructions.
