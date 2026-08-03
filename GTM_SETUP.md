# GTM / GA4 Setup Guide

How the website's dataLayer events map to Google Tag Manager triggers, variables, and GA4 tags. Hand this to whoever manages the Stape/GTM container (`6mrngdxayj`, GTM-WRC99LCR).

The site already pushes all events below to `window.dataLayer`. Until you create the matching **triggers** and **tags** in GTM, the events flow into the dataLayer but nothing consumes them.

---

## 0. One-time housekeeping

**Consent Mode** is already wired (default denied → `CookieBanner` updates it), so no change needed there.

**Turn OFF these GA4 Enhanced Measurement options** (Admin → Data Streams → your stream → Enhanced Measurement) to avoid double-counting the richer custom events:

| Disable | Because we now send |
|---------|---------------------|
| Scrolls | `scroll_depth` (25/50/75/100 %, not just 90 %) |
| Form interactions | explicit `form_start` / `generate_lead` |

Leave **Page views**, **Outbound clicks**, **File downloads**, **Site search**, **Video** enabled.

---

## 1. Data Layer Variables to create

Create one GTM **Data Layer Variable** per key below (Variables → New → Data Layer Variable). Name them `dlv_<key>`.

| DLV key | Used by |
|---------|---------|
| `form_id` | generate_lead, form_start, form_step, form_error |
| `form_location` | same |
| `lead_type` | generate_lead |
| `property_name` | generate_lead, roi_calculator_use |
| `percent` | scroll_depth |
| `seconds` | user_engagement_time |
| `cta_text`, `cta_location`, `destination` | cta_click |
| `location` | whatsapp_click |
| `error_type` | form_error |
| `step` | form_step |
| `choice`, `analytics_consent`, `marketing_consent` | consent_update |
| `field`, `value` | roi_calculator_use |
| `user_data` | generate_lead — **Enhanced Conversions / Meta CAPI ONLY, never GA4** (see §6) |
| `page` | pageview |
| `link_type`, `link_value` | contact_link_click (existing) |

For **ecommerce** events (`view_item`, `view_item_list`, `select_item`, `add_to_wishlist`) use GTM's built-in ecommerce handling — in the GA4 Event tag, tick **"Send Ecommerce data" → Data source: Data Layer**. The site pushes the standard `ecommerce.items` object (with `ecommerce: null` reset first), so GTM reads it automatically. No manual item variables needed.

---

## 2. Triggers

For every event, create a **Custom Event** trigger (Triggers → New → Custom Event) where **Event name** = the value in the table (exact match).

## 3. Full event catalog

Each row = one dataLayer event. "Params" are the DLV keys to attach to the GA4 Event tag.

### Conversion / lead funnel

| Event | Fires when | Params | GA4 tag |
|-------|-----------|--------|---------|
| `generate_lead` | form submitted successfully → CRM | form_id, form_location, lead_type, property_name | **GA4 Event `generate_lead`** — mark as Conversion; also add a **Google Ads Conversion** tag on this trigger |
| `form_start` | first field focus of any form | form_id, form_location | GA4 Event `form_start` |
| `form_step` | Exclusive Offer step 1 → 2 | form_id, step | GA4 Event `form_step` |
| `form_error` | validation (`invalid_phone`) or `submit_failed` | form_id, error_type | GA4 Event `form_error` (diagnostic, not a conversion) |

### Engagement

| Event | Fires when | Params | GA4 tag |
|-------|-----------|--------|---------|
| `scroll_depth` | 25 / 50 / 75 / 100 % of page | percent, page_path | GA4 Event `scroll_depth` |
| `user_engagement_time` | 15 / 30 / 60 / 120 s active time | seconds, page_path | GA4 Event `user_engagement_time` |
| `pageview` | route change (SPA nav) | page | usually not needed — GA4 config tag already sends `page_view`; use only if you want a custom marker |

### Interaction / intent

| Event | Fires when | Params | GA4 tag |
|-------|-----------|--------|---------|
| `cta_click` | primary CTA (strategy/analysis opens, hero) | cta_text, cta_location, destination | GA4 Event `cta_click` |
| `whatsapp_click` | floating WhatsApp button | location, page_path | GA4 Event `whatsapp_click` — consider marking as Conversion (high intent) |
| `contact_link_click` | phone / email / address click (existing) | link_type, link_value | GA4 Event `contact_click`; `phone`/`email` types worth a Conversion |
| `map_interaction` | contact-page map click (existing) | map_location | GA4 Event `map_interaction` |
| `consent_update` | cookie accept / decline / custom | choice, analytics_consent, marketing_consent | GA4 Event `consent_selection` |

### Property (GA4 e-commerce — use Data Layer ecommerce source)

| Event | Fires when | GA4 tag |
|-------|-----------|---------|
| `view_item_list` | properties listing / landing featured render | GA4 Event `view_item_list` (Send Ecommerce data = Data Layer) |
| `select_item` | property card click | GA4 Event `select_item` |
| `view_item` | property detail page load or popup open | GA4 Event `view_item` — key **remarketing** signal |
| `add_to_wishlist` | save/star a property | GA4 Event `add_to_wishlist` — remarketing signal |
| `roi_calculator_use` | ROI sliders / currency / mode changed (debounced) | GA4 Event `roi_calculator_use` (high-intent, custom params: field, value, property_name) |

Item schema pushed for the ecommerce events:
```
items: [{ item_id, item_name, price, item_category (type), item_category2 (location), item_brand (developer) }]
```

---

## 4. Recommended conversions & audiences

- **Conversions (mark in GA4 Admin → Events):** `generate_lead`, `whatsapp_click`, `contact_click` (phone/email).
- **Google Ads remarketing audiences:** users who fired `view_item` / `add_to_wishlist` / `roi_calculator_use` but not `generate_lead` — highest-intent non-converters.
- **Funnel exploration:** `view_item_list` → `select_item` → `view_item` → `cta_click` → `form_start` → `generate_lead`, with `form_error` as the drop-off diagnostic.

---

## 5. User data → Enhanced Conversions / Meta CAPI

The `generate_lead` event carries a `user_data` object for ad-platform conversion
matching. Shape:

```
user_data: {
  email: "...",
  phone_number: "+9715…",           // E.164
  address: { first_name, last_name }
}
```

**Rules:**
- ✅ Route it to **Google Ads → Enhanced Conversions for Leads** (the tag hashes it
  automatically) and/or **Meta CAPI** via the Stape server container (hashes server-side).
- ⛔ **Never map `user_data` into a GA4 tag.** Sending raw name/email/phone to GA4
  violates Google policy and can suspend the property.
- Gate the Google Ads / Meta tags on **`ad_storage` = granted** (Consent Mode already
  tracks this; see the `consent_update` event).

The lead's identity is also stored in **Frappe CRM** (posted straight from the browser to
the CRM's public `web_lead` endpoint) — that, not GTM/GA4, is where you view individual leads.

## 6. Testing

1. GTM → **Preview** (Tag Assistant), enter the site URL.
2. Interact: scroll, wait, open a property, drag ROI sliders, click WhatsApp, submit a form with and without a valid phone.
3. Confirm each event appears in Tag Assistant's dataLayer panel with the expected params, and that the GA4 tags fire.
4. Cross-check in **GA4 → Realtime → Events**.

> Attribution note: UTMs are **not** sent on form events — GA4/GTM already tie the session to its original UTM source from the landing `page_view`. The CRM lead separately stores raw UTM/ad values (captured first-party in the `clf_attribution` cookie and sent with the lead to the CRM's `web_lead` endpoint).
