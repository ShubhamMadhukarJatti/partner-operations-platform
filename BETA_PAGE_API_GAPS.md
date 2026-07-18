# Beta Page API Gaps

_Last reviewed: 2026-03-26_

## Overview

This note tracks data-like hardcoding on the beta profile surfaces:

- `/explore-beta/[id]`
- `/settings/profile-beta`

It is intentionally limited to product data, analytics, and persistence gaps.

It does **not** flag the following as API issues:

- fixed Figma/image assets or icon URLs
- static marketing copy or section labels
- generic form placeholder text
- visual fallback states that do not pretend to be real business data

## Already API-backed

The following areas are already wired to APIs and do not currently require new backend endpoints:

- Resources on both pages
  - Public display on `explore-beta` is backed by the organization resources API.
  - Editing in `profile-beta` now uses create, update, delete, and by-org resource routes.
- Pricing on both pages
  - `explore-beta` uses the partner-organization pricing tiers endpoint.
  - `profile-beta` reuses the existing catalogue/tier flows.
- Partner-program editing in `profile-beta`
  - The editor reads via `getByOrg`, saves via `upsert`, and toggles active state via `toggle`.

## Needs New API Support

These are still materially hardcoded and should be backed by backend data if they are meant to be real.

### 1. Own-profile completion and visibility analytics

`explore-beta` still hardcodes:

- profile completion percent
- visibility score
- monthly views
- monthly inquiries
- category rank
- quick-action recommendations and their impact chips

This needs a dedicated completion / visibility analytics response for the current organization.

### 2. Certifications read/write data

Both pages still depend on placeholder certification data:

- `explore-beta` uses static certification tiles and a certification count derived from placeholder records
- `profile-beta` certifications are still visual-only and do not persist

This needs certification read and write APIs for organization-level certification records.

### 3. Banner upload and persisted `bannerUrl`

`profile-beta` still shows a visual-only banner uploader and always uses a local preview asset.

`explore-beta` already reads `org.bannerUrl`, so the missing backend piece is:

- persisted banner field on the organization payload
- banner upload/update flow that writes that field

### 4. Public partner-program metrics and benefits for the explore summary card

The explore summary card still falls back to fixed metric values and fixed benefit bullets when real values are missing.

If those values are meant to be factual, the public partner-program response should expose:

- acknowledgement rate
- time to fill
- question count
- public key benefits

### 5. External review / rating data for hero badges

The hero review pills for:

- G2
- Capterra
- Trustpilot

are currently static.

If those should reflect live or managed data, this needs a ratings/reviews API or a CMS-backed surface exposed through the org profile response.

## Existing API, But UI Still Uses Fake Fallbacks

These areas already have some API coverage, but the UI still invents values when data is thin or missing.

### 1. Market Intelligence defaults

The market-intelligence adapter still falls back to:

- `Enterprise Automation`
- `847`
- `API`, `Automation`, `AWS`

This is likely not a new-endpoint problem. It is either:

- a response-contract completeness problem, or
- a UI empty-state decision that should stop inventing realistic-looking numbers

### 2. Similar-profile mock fallback cards

Recommendations are API-backed, but the page still has a local mock fallback list when the request errors.

This likely does not need a new API unless product wants guaranteed server-side fallback recommendations.

### 3. Match-card fallback scores and categories

The hero match cards still invent fallback categories and scores when persona-match data is absent.

This may only need a stricter persona-match contract or a less data-like empty state.

### 4. Certification badge and count still rely on placeholder certification data

Even where the UI looks “real,” the certification badge state still depends on generated placeholder records rather than organization-owned certification entities.

This overlaps with the certification API gap above, but is called out separately because it affects the primary hero trust badge on `explore-beta`.

## Source References

### Explore Beta

- Own-profile completion constants:
  - [`ExploreBetaClient.tsx#L286`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L286>)
- Partner-program summary metric fallbacks:
  - [`ExploreBetaClient.tsx#L1382`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L1382>)
- Static hero review pills:
  - [`ExploreBetaClient.tsx#L1126`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L1126>)
- Certification trust badge count in hero:
  - [`ExploreBetaClient.tsx#L1174`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L1174>)
- Static certification tiles:
  - [`ExploreBetaClient.tsx#L90`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L90>)
  - [`ExploreBetaClient.tsx#L1955`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L1955>)
- Market-intelligence rendering:
  - [`ExploreBetaClient.tsx#L1980`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L1980>)
- Similar-profiles rendering:
  - [`ExploreBetaClient.tsx#L2025`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L2025>)
- Visibility metrics in rail/panel:
  - [`ExploreBetaClient.tsx#L2175`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L2175>)
  - [`ExploreBetaClient.tsx#L2209`](<../src/app/(app)/(dashboard-pages)/explore-beta/[id]/_components/ExploreBetaClient.tsx#L2209>)

### Profile Beta

- Banner is still visual-only:
  - [`ProfileBetaClient.tsx#L869`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L869>)
- Logo placeholder fallback:
  - [`ProfileBetaClient.tsx#L905`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L905>)
- Certifications are still visual-only:
  - [`ProfileBetaClient.tsx#L757`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L757>)
  - [`ProfileBetaClient.tsx#L1210`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L1210>)
- Resources are API-backed and persisted:
  - [`ProfileBetaClient.tsx#L1311`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L1311>)
- Partner-program editing is API-backed:
  - [`ProfileBetaClient.tsx#L1495`](<../src/app/(app)/(account-settings)/settings/profile-beta/_components/ProfileBetaClient.tsx#L1495>)

### Shared Adapters

- Placeholder certification generator:
  - [`adapters.ts#L202`](<../src/app/(app)/_beta-profile/adapters.ts#L202>)
- Hero fallback labels and logo fallback:
  - [`adapters.ts#L100`](<../src/app/(app)/_beta-profile/adapters.ts#L100>)
- Market-intelligence fake fallback values:
  - [`adapters.ts#L578`](<../src/app/(app)/_beta-profile/adapters.ts#L578>)
- Similar-profile mapping and its fallback-compatible defaults:
  - [`adapters.ts#L626`](<../src/app/(app)/_beta-profile/adapters.ts#L626>)
