# Fetcher usage audit

Use `fetcher` from `@/lib/server` for all backend API calls (SHARKDOM_API_URL) so token refresh and retry logic live in one place.

## API routes already using fetcher

- **no/auth**: zoho/fields/[userId], zoho/data/[userId], save/overlap, find-overlaps, report/history/[userId], report/history/org/[orgId], report-count/[userId], report-count/org/[orgId], overlap/my/records/[userId], overlap/my-records/org/[organizationId], hubspot, hubspot/fields/[userId], organization/integration (POST + GET [userId] when cookie auth)
- **user**: otp-success, [userId]
- **tasks**: list, create, [id]/status, list/external/partner
- **mailboxes/connect**, **suggest-brand**, **send-one-trigger**, **run-trigger**, **resend-email**
- **deal-registration**
- **reseller/deals**: stage, create, details/[id], customer/list, customer/add, customer/[id], customer/license/allocate, count/status, approve/[id], [dealId]/licenses, calculate/partner/tier
- **my-deals**: internal (sent/deals, received/deals, partner/portal/approve/[dealId], external/partner), external/partner/portal (getDealsCount/[vendorOrgId], get/deals, deal/exist, approve/[dealId], get/all), dealExist
- **partner-portal**: connected-apps, salesforce/contacts, salesforce/contacts/describe, pipedrive/fields, pipedrive/data, hubspot/fields, hubspot/data
- **partner-mapping**: report/history, report/save, overview, comparison
- **organizationCollaboration**: route, save/assignment, my-partners, get/partner/assignment/[id]
- **organization**: users, getShortListing/[orgId], currency, id
- **org/team/section**: sharkdom/roles, roles, roles/[roleId]/permissions, create, roles/with/users; **orgUserMapping/team/section/roles/with/users**
- **offline-partner**: code, save, documents
- **ppi**: verify-and-save-dns, fetchQuestionByFormId, counter, response/internalForm/save, branding (GET/PUT), dns/txt-record/by-org, dns/domain-validation-status/by-org, generate/target-host, save/Script, org-form-requests, internalFormsView, getTopTenForms, getCounterByFormId, getCounter, formView, form/status, findByResponseId (all use fetcher only; getServerUser only where user.uid needed)
- **onboarding**: steps (POST), steps/[userId] (GET), complete/[email]
- **my-deals**: approve/[dealId], [dealId]
- **reseller/deals/stripe/payment** (link/generation, [requestId]) – fetcher only
- **pan-verify**, **organization-collaboration/[id]**, **orgUserMapping/team/section**, **hubspot-data**, **configuration-by-type**, **map-user-to-org**, **map-role-to-user**, **get-referral-campaigns**
- **partner/training**: upload, my/partner/dashboard/stats, labels, courses, users/[userId]
- **mailboxes/user/[userId]**
- **V1/addUser**, **partner/portal/share**, **persona/partner/data/[userId]**, **partner/training/drive**, **configuration**, **docfetcher/extract-agreement**, **user/team/section/requests**, **external/partner/pulse/filter/search**

## Not converted (by design)

- **auth/refresh** – special axios flow to backend refresh endpoint.
- **organization/integration** (POST) – uses request `Authorization` header when provided.
- **reset-password** – calls Cloud Function URL, not SHARKDOM_API_URL.
- **upload-logo**, **upload-document** – FormData; fetcher is JSON-oriented.
- **onboarding/start**, **onboarding/website/check** – no auth sent; backend may be unauthenticated.
- **OAuth callbacks** (zoho, salesforce, pipedrive, zoom, typeform, stripe, razorpay, slack, etc.) – mixed external + backend; convert backend call to fetcher when desired.

## Remaining API routes (still direct fetch/axios to backend)

Convert to fetcher (relative path, `data` for body, catch `error?.response?.status` / `error?.response?.data`). Backend path = no `/api` prefix (e.g. `/partner/training/...` not `/api/partner/training/...`).

- **partner/training** (still axios/fetch): labels/add, my/partner/courses/assign, assign/status/update, [courseId]/stages/[stageId]/complete, [courseId]/readiness, [courseId]/progress, my/partner/assigned/dashboard/courses, dashboard/course/[courseId]/insights, dashboard/associated/partners, dashboard/associated/partners/course/[courseId], created/by/org/certificates, courses/unpublished, courses/stages/[stageId]/quiz, courses/stages/[stageId]/content, courses/invite, courses/add, courses/[courseId]/\*, course/stages/[stageId], course/stages/[stageId]/quiz/answer/verify
- **partner-course**: dashboard/stats, dashboard/courses, course/status/add, course/[courseId]/\* (all routes)
- **talent/network**: upload/pdf, save/community/opt-in, requirement/create
- **email**: outreach/message/\* (sends, send, send/external/partner, receives, event/summary, drafts), outreach/mailbox/claim, claim/check, domain, domain-status, agent/generate; **email-verify**, **email/subscribe**, **email/addDomain**
- **catalogues**: route, pricing/tiers/_, partner/tiers/_
- **campaign**: route, triggers, triggers/[id], trigger/template, updateTrigger, trigger/general
- **admin-portal**: scheduler; **admin-portal-search**; **ai-discover**; **auth/me** (returns token/user only – no backend call); **test-auth**
- **add-partner**, **add-partner-referral-campaign**, **active-partners**, **ask-for-clarification**, **add-team-member**, **OrgByPartialName**
- **chat-messages**, **chatbot/ask**, **docfetcher/extract-agreement**, **google-meet**, **login-verify-partner**, **messages**, **referral** (NEXT_PUBLIC URLs), **trigger-mail**
- **OAuth callbacks** (zoho, salesforce, pipedrive, zoom, typeform, stripe, razorpay, slack, mailchimp, closecrm, calendly, discord): backend call to organization/integration can be switched to fetcher if desired

## Lib files

All backend calls in **lib/db** and **lib/actions** use `fetcher`; `getServerUser()` is kept only where `user.uid` or `user` is needed in the path/body.

- **lib/db**: user.ts, organization.ts, integrations.ts, customer-persona.ts (fetcher for persona/integration; Zoho OAuth uses external `fetch`), subscription.ts, partnership-details.ts, ipp-details.ts, company-details.ts, address-contact.ts, suggest-brand.ts, templates.ts, partner-alert.ts, perk.ts, payment.ts, mou.ts, notifications.ts, meetings.ts, inbox.ts, e-book.tsx, email.ts (getEmailStatistics, getEmailCampaigns), **email-outreach.ts** (checkMailboxClaim, claimMailbox, getEmailEventSummary), **demo.ts** (getDemoData) – all backend calls use fetcher.
- **lib/actions**: organization.ts, onboarding-v2.1.ts, onboarding.ts, referral.ts, slack.ts, pan-verification.ts, inbox.ts, meeting.ts, mou.tsx, notifications.ts, collaboration.ts, contract.ts – all use fetcher where they call the backend.
- **Not converted (by design)**: lib/db – customer-persona.ts (Zoho OAuth `fetch(publishableKey/oauth/v2/token)` – external), sheets.ts, hubspot.ts, forms.ts (Google OAuth / external APIs), sanity-cms.ts (Sanity client). lib/actions – unsubscribe.ts, public-profile.ts if they only use external URLs.

## Pattern for conversion

```ts
// Before
const { token } = await getServerUser()
const res = await fetch(`${process.env.SHARKDOM_API_URL}/path`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(body)
})
const data = await res.json()

// After
const data = await fetcher<ResponseType>('/path', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  data: body
})
```

Error handling: use `error?.response?.status`, `error?.response?.data` (axios-style). Path is relative (e.g. `/my-deals/...`); base URL and auth are added in `server.ts`.
