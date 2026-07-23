# Cleaner Purchase Orders (Payment Statements) — Full Feature Reference

Everything implemented for the **cleaner/contractor Purchase Order (PO)** system —
backend + admin frontend — so the **cleaner portal** side can be built against it.

> A "Purchase Order" here = a **monthly payment statement** for a cleaner/contractor.
> It's generated from the shifts they worked, can carry manual adjustments, is
> approved by the cleaner, and is pushed to **Xero as a DRAFT Bill (ACCPAY)** to pay them.
> The paying entity is **Super Pro Services** (a separate Xero org from AEC).

Repos:
- **Backend**: `Stock-Management-backend`
- **Admin frontend**: `Stock-Management-frontend`

---

## 1. Lifecycle / status state machine

`PurchaseOrder.status` enum:

```
pending_cleaner_approval  ← created here (cleaner must approve)
        │  cleaner approves (PATCH /pos/:id/status/approve)
        ▼
     approved
        │  admin pushes to Xero (POST /xero/push-po/:id)
        ▼
   pushed_to_xero  ──►  paid       (set manually / future)
        │
     cancelled  (set manually / future)

disputed  ← in the enum, but NO endpoint sets it yet (see "Gaps")
```

- **Generation always starts a PO as `pending_cleaner_approval`.**
- **Adjustments** (add/remove) are only allowed while status is `pending_cleaner_approval`
  or `disputed` (helper `canEditAdjustments`). Otherwise the API returns **409**.
- The admin UI hides Edit/Delete once the PO is `pushed_to_xero`.

---

## 2. Data model

### `PurchaseOrder` (`src/models/purchaseOrderModel.js`)

```jsonc
{
  "_id": "…",
  "poNumber": "WALLY-726-1a2b-4821",   // WALLY-{month}{YY}-{cleanerId last4}-{random4}, unique
  "cleanerId": "…",                     // ref Cleaner
  "cleanerName": "…",                   // snapshot at generation
  "month": 7,                            // 1–12
  "year": 2026,

  "shifts": [                            // historical snapshot (not live refs)
    { "shiftId": "…", "date": "…", "siteName": "…",
      "shiftType": "job|task|event", "price": 100, "internalNotes": "…" }
  ],

  "adjustments": [                       // manual line items on top of shift totals
    { "_id": "…", "description": "Fuel reimbursement", "amount": 25,   // SIGNED
      "type": "compensation|reimbursement|deduction|other",
      "addedBy": "adminId", "date": "…" }
  ],

  "summary": {
    "totalJobs": 1, "totalTasks": 0, "totalEvents": 0,
    "subtotal": 100,      // sum of shift prices only
    "grandTotal": 110     // subtotal + sum of SIGNED adjustment amounts
  },

  "status": "pending_cleaner_approval",
  "generatedBy": "adminId",

  // Set once pushed to Xero as a DRAFT Bill:
  "xeroInvoiceId": "guid",       // used to deep-link "View in Xero"
  "xeroInvoiceNumber": "…",      // if Xero assigned one

  "createdAt": "…", "updatedAt": "…"
}
```

**Adjustment contract (important):** `amount` is **signed** — positive adds, negative
subtracts. `type` is a **display label only** and does NOT affect the maths (a
"deduction" must still be sent as a negative amount). Zero amounts are rejected.

### `Cleaner` additions (`src/models/cleanerModel.js`)

```jsonc
{
  "xeroContactId":  "…",   // linked Super Pro Xero contact (set on push/create/link)
  "xeroContactName": "…"
}
```
`contractorDetails.personalInfo` holds the source data used to create a Xero contact:
`firstName/surname/fullName`, `email`, `contactNumber`, `abn`, `bankName`,
`accountName`, `bsbNumber`, `accountNumber`, plus `contractorDetails.isGstRegistered`.

---

## 3. Backend API reference

Base: `/api/pos` (POs) and `/api/xero` (Xero). Auth via `Authorization: Bearer <token>`.
`adminOnly` = admin JWT; the two **cleaner-facing** routes use `protect` and read the
authenticated **cleaner** (`req.cleaner._id`).

### 3a. Admin — PO management (`/api/pos`)

| Method | Route | Handler | Purpose |
|---|---|---|---|
| GET | `/preview/:cleanerId/:month/:year` | `getPOPreview` | Uninvoiced shifts for that month (the estimate). Returns `{ success, data: [shift…] }` with `siteId.site_name` populated. |
| POST | `/generate` | `generatePO` | Create a PO from `selectedShiftIds` (+ optional `adjustments`). Snapshots shifts, computes totals, status → `pending_cleaner_approval`, marks shifts `isInvoiced`, **notifies the cleaner**. |
| GET | `/cleaner/:cleanerId` | `getCleanerPOs` | All POs for one cleaner (sorted year/month desc). |
| GET | `/period/:month/:year` | `getPOsByPeriod` | Every cleaner's POs for a month+year (sorted by cleanerName). |
| PATCH | `/:poId/status` | `updatePOStatus` | Set an arbitrary status (admin). |
| POST | `/:poId/adjustment` | `addAdjustmentToPO` | Add one adjustment. **409** unless pending/disputed. Recomputes total. |
| DELETE | `/:poId/adjustment/:adjustmentId` | `removeAdjustmentFromPO` | Remove one adjustment. **409** unless pending/disputed. Recomputes total. |
| DELETE | `/:poId/shifts/:shiftId` | `removeShiftFromPO` | Remove a shift, return it to the uninvoiced pool, recompute total. |
| DELETE | `/:poId` | `deletePO` | Delete the PO and return all its shifts to the uninvoiced pool. |

**Generate body:**
```jsonc
{
  "cleanerId": "…", "month": 7, "year": 2026,
  "selectedShiftIds": ["…"],
  "adjustments": [                                   // optional
    { "description": "Fuel reimbursement", "amount": 25, "type": "reimbursement" },
    { "description": "Uniform deduction",  "amount": -15, "type": "deduction" }
  ]
}
```
Adjustments validated server-side: non-empty `description`, non-zero numeric `amount`,
`type` defaults to `other`. `400` on a bad row.

### 3b. Cleaner-facing (`/api/pos`) — **what the cleaner portal uses**

| Method | Route | Handler | Purpose |
|---|---|---|---|
| GET | `/my-invoices` | `getMyInvoices` | All POs for the **logged-in cleaner** (`req.cleaner._id`), sorted year/month desc. `{ success, data: [PO…] }`. |
| PATCH | `/:poId/status/approve` | `approveInvoice` | Cleaner approves their statement. Verifies the PO belongs to them; **400** if not currently `pending_cleaner_approval`; sets status → `approved`. |

Both expect a **cleaner-authenticated** token (the same `protect` used elsewhere in the
cleaner portal). `approveInvoice` is ownership-checked (`findOne({ _id, cleanerId })`).

### 3c. Xero (`/api/xero`)

| Method | Route | Handler | Purpose |
|---|---|---|---|
| GET | `/connect` | `connectXero` | OAuth start (returns `{ url }` to redirect). Public. |
| GET | `/callback` | `xeroCallback` | OAuth callback; saves token set to `Settings{type:'global_config'}`; redirects to the PO page with `?xero=success|error`. Public. |
| GET | `/status` | `xeroStatus` | `{ success, connected, tenantId }` — connected = token+tenant exist. |
| GET | `/contacts/search?q=&page=&pageSize=` | `searchXeroContacts` | Typeahead search of this org's Xero contacts (min 3 chars). |
| POST | `/push-po/:poId` | `pushPOToXero` | Push the PO to Xero as a **DRAFT Bill (ACCPAY)**. See §4. |
| POST | `/po/:poId/create-contact` | `createXeroContactForPO` | Create a new Xero contact (optional edited `name` in body) mapped to account **415**, link it to the cleaner. |
| POST | `/po/:poId/link-contact` | `linkXeroContactToPO` | Link an existing Xero contact (`{ contactId, contactName }`) to the cleaner. |

---

## 4. Xero push behaviour (`pushPOToXero`)

1. **Token**: `ensureXeroReady()` calls `xero.initialize()` (SDK OpenID client is lazy),
   loads the stored token, and refreshes if expired — **persisting the rotated refresh
   token**. On `invalid_grant` it **clears the stored token** (so `/status` flips to
   disconnected and the UI shows "Connect Xero") and asks the admin to reconnect.
2. **Contact resolution**:
   1. Use `cleaner.xeroContactId` if set.
   2. Else exact-name match (`Name=="cleanerName"`) → if found, **store the id on the cleaner**.
   3. Else return **409** `{ needsContact: true, contactPreview, cleanerId }` so the UI can
      **create a new** contact or **link an existing** one.
3. **Bill**: creates an `ACCPAY` DRAFT invoice:
   - Line items — regular jobs grouped per site (`REGULAR CLEANING: N Shifts - <site>`),
     individual task/event lines, and one line per adjustment. **All on account `415`**.
   - `taxType` = `INPUT` if `contractorDetails.isGstRegistered` else `EXEMPTEXPENSES`.
   - `reference` = `poNumber`.
4. Saves `status = pushed_to_xero`, `xeroInvoiceId`, `xeroInvoiceNumber`.
5. **Deep link**: `https://go.xero.com/AccountsPayable/View.aspx?InvoiceID=<xeroInvoiceId>`.

**Bank details note:** a Xero contact stores one bank string; BSB + account number are
sent as **digits only, concatenated** (`bsb+accountNumber`) — Xero splits first 6 = BSB,
rest = account number. (A hyphen would leak into the account number.)

---

## 5. Admin frontend

- **Page** `src/pages/PurchaseOrders/PurchaseOrders.jsx`
  - **Two view modes**: *By Cleaner* (a cleaner's whole year) and *By Month & Year*
    (all cleaners' POs for a period). Accordion list per PO.
  - **Persistent "Connect Xero" indicator** (Checking / Connected / Connect), gated on
    `/xero/status`; re-checks on window focus and after a push error.
  - Per-PO actions: **Edit**, **Delete**, **Print PDF**, **Push to Xero** / **View in Xero**.
  - Hosts the contact-confirmation modal on a `needsContact` push.
- **`src/components/GeneratePOModal`** — step 1 pick cleaner/month/year → fetch estimate;
  step 2 select shifts + **add adjustment line items** (description, type, signed amount,
  live grand total) → generate.
- **`src/components/EditPOModal`** — manage shifts (remove) and adjustments (add/remove
  with the pending/disputed guard + type dropdown).
- **`src/components/ConfirmXeroContactModal`** — two modes: **Create new** (editable name +
  cleaner details + 415 badge) or **Link existing** (Xero contact typeahead).
- **Utils**
  - `src/utils/poApi.js` — `getPOPreview`, `generatePO`, `getCleanerPOs`, `getPOsByPeriod`,
    `addAdjustmentToPO`, `removeAdjustmentFromPO`, `removeShiftFromPO`, `deletePO`,
    `ADJUSTMENT_TYPES`, `toSignedAmount()`, `canEditAdjustments()`.
  - `src/utils/xeroApi.js` — `connectToXero`, `getXeroStatus`, `isXeroConnected`,
    `pushPOToXero`, `createXeroContactForPO`, `linkXeroContactForPO`, `searchXeroContacts`.
  - `src/utils/generatePOPdf.js` — branded PO/statement PDF (Super Pro Services).

---

## 6. Building the cleaner portal — guidance

The cleaner side already has the two endpoints it needs to start (`/my-invoices`,
`/:poId/status/approve`). A typical cleaner-portal build:

1. **Statement list** — `GET /api/pos/my-invoices` → list by month/year with the
   `status` and `summary.grandTotal`. Highlight ones that are `pending_cleaner_approval`
   (action required).
2. **Statement detail** — render `shifts` (you can group regular jobs per site like the
   admin/PDF does), then `adjustments` (show sign/colour), then `summary.subtotal` and
   `summary.grandTotal`. You can reuse `generatePOPdf.js` for a downloadable statement.
3. **Approve** — `PATCH /api/pos/:poId/status/approve`, only enabled when
   `status === 'pending_cleaner_approval'`. On success the row flips to `approved`.
4. **Notification** — on generation the cleaner already receives a `po_created`
   notification ("New Payment Statement Ready … review and approve by the 4th").

**Money display:** `grandTotal = subtotal (shifts) + Σ signed adjustments`. Never compute
the total client-side as the source of truth — use `summary.grandTotal`.

---

## 7. Gaps / things to add for the cleaner portal

- **Dispute flow is not implemented.** `disputed` is in the status enum (and adjustments
  are editable while `disputed`), but there is **no endpoint** to move a PO to `disputed`.
  To let cleaners dispute a statement you'd add e.g. `PATCH /api/pos/:poId/status/dispute`
  (ownership-checked, only from `pending_cleaner_approval`, store a reason) — mirror
  `approveInvoice`. The admin UI already treats `disputed` as editable.
- **No "revert from Xero" for POs** (unlike AEC orders). Pushing creates a new DRAFT bill;
  there's no delete/void-in-Xero + reset-to-draft. The admin UI avoids double-push by
  only showing **Push** when `status !== 'pushed_to_xero'`.
- **`paid` / `cancelled`** exist in the enum but are only settable via the generic admin
  `PATCH /:poId/status` — no dedicated flow yet.
- **Approval currently doesn't notify the admin.** If you want the office alerted when a
  cleaner approves/disputes, add a notification in `approveInvoice` (and the dispute
  handler) — the notification helper is already used in `generatePO`.

---

## 8. Gotchas

- **Adjustments are signed** and locked outside pending/disputed (409).
- **PO number** is generated, unique, and used as the Xero bill `reference`.
- **Deleting a PO** returns its shifts to the uninvoiced pool (they can be billed again).
- **Removing a shift** from a PO also returns just that shift to the pool and recomputes
  the total.
- **Restart the backend** after backend changes — routes/handlers don't hot-reload if the
  process wasn't watching; a missing route returns **404** (vs 401 for an existing
  protected route) which the frontend can silently swallow.
- **Xero tokens** expire after 60 days idle; both Wally/PO and AEC now self-heal on
  `invalid_grant` by clearing the token and prompting reconnect.
