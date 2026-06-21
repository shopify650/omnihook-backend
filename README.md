# OmniHook — Framer Webhook Automation Plugin

OmniHook turns Framer designs into webhook-powered automations.
It lets users connect page events and component actions to any webhook URL, including Make.com, Zapier, Pipedream, n8n, and Webhook.site.

## Overview

OmniHook is a Framer plugin that enables fast webhook automation directly from your Framer project. Users can create automations, paste any supported webhook URL, test trigger events, and export a ready-to-use Framer component for their project.

## Key Features

- **Universal webhook support** — accepts any `http` or `https` webhook URL.
- **Platform detection** — recognizes Zapier, Make.com, Pipedream, n8n, and Webhook.site.
- **Automation management** — create, edit, pause, resume, and delete automation rules.
- **Live test flow** — send a sample webhook payload and verify the integration.
- **Trigger logs** — view recent webhook activity and inspect results.
- **Component copy** — generate a ready-to-use Framer component from each automation card.
- **License gating** — protects premium functionality with a Whop license key.
- **Device-specific validation** — locks a license to a single user installation.

## How OmniHook Works

### 1. Initialization

When the plugin loads, it:

- fetches stored automations and logs
- loads the saved license key, if present
- generates or loads a persistent device ID
- validates the license with Whop using the device ID

If the license is invalid or missing, the plugin shows the `LicenseScreen` to prompt for entry.

### 2. Creating an Automation

Users create automations in `CreateHookScreen` by entering:

- hook name
- description
- trigger type
- webhook URL
- payload fields

Automations are stored locally using plugin data storage.

### 3. Testing Webhooks

The plugin validates entered webhook URLs with `isValidWebhookUrl()`.
If valid, it sends a POST request to the webhook using `fetch()` in `no-cors` mode. This avoids browser preflight issues while still firing the request.

### 4. Copying a Component

Each automation can generate a custom Framer component via the `Copy` action.
The plugin replaces placeholder values in `component/HookTrigger.tsx` and copies the result to the clipboard.
Users paste that component into Framer manually.

### 5. Logs and Troubleshooting

Trigger activity is recorded in `localStorage` and displayed in `LogScreen`.
Users can clear logs or inspect webhook test results.

## Supported Webhook Platforms

OmniHook works with any webhook URL, with explicit support for:

- Make.com
- Zapier
- Pipedream
- n8n
- Webhook.site

It also treats other HTTP/S endpoints as custom webhooks.

## File Structure

- `src/App.tsx` — main application flow and screen routing.
- `src/hooks/usePluginStorage.ts` — plugin data persistence.
- `src/hooks/useAutomations.ts` — automation state and webhook firing.
- `src/hooks/useWebhookTest.ts` — webhook test execution.
- `src/services/whopService.ts` — Whop license validation.
- `src/services/webhookService.ts` — webhook validation, payload building, request logic.
- `src/services/storageService.ts` — local plugin data storage.
- `src/components/LicenseScreen.tsx` — license entry interface.
- `src/components/HomeScreen.tsx` — dashboard and automation list.
- `src/components/CreateHookScreen.tsx` / `EditHookScreen.tsx` — automation editors.
- `src/components/HelpScreen.tsx` — usage guide and supported platforms.
- `src/components/TestScreen.tsx` — webhook test status.
- `src/components/LogScreen.tsx` — trace log viewer.
- `src/components/HookCard.tsx` — automation item display.
- `src/components/WebhookInput.tsx` — webhook URL field with validation.

## Installation & Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open the plugin in Framer via:

```text
https://framer.com/plugins/open
```

## Packaging for Framer Marketplace

Build and pack the plugin:

```bash
npm run pack
```

This generates `plugin.zip` in the project root, ready for upload.

## Marketplace Listing Copy

- **Byline:** Best Framer Plugin for webhook automation
- **Tags:** `integrations`, `webhooks`, `automation`
- **Integrations:** Make.com, Zapier, Pipedream, n8n, Webhook.site, any webhook
- **Pricing:** One-time license / premium plugin

## Coming Soon Page Features

These are the planned enhancements for the next release:

- Something powerful is loading…
- Automation for Framer is almost here
- Your website + webhooks, coming soon
- Get ready to connect Framer to 10k+ apps
- Hook it, fire it, automate it
- Big workflow energy arriving soon
- Your next Framer plugin is being built
- Launching soon: instant webhooks for Framer
- Soon: no-code triggers for every page
- Stay tuned for smarter page actions

## Future Enhancements

Planned improvements include:

- onboarding guide and starter templates
- richer webhook templates for Make, Zapier, Pipedream, n8n
- integration presets for Slack, Google Sheets, HubSpot, and more
- better error feedback for webhook failures
- license self-service and activation management
- analytics dashboard for automation performance

## Notes

- The plugin uses `no-cors` mode for webhook requests because Framer runs in a browser environment.
- Actual webhook success is inferred from the request being sent rather than response details.
- The license system uses Whop validation and persistent local plugin storage.

---

If you want, I can also add a dedicated `DOCUMENTATION.md` with a quick reference section and FAQ for the plugin.  