/**
 * Lead fallback mailer — Google Apps Script
 * ==========================================
 *
 * Free email relay for leads the CRM refused to accept. The website's
 * /api/lead-fallback route calls this script server-to-server; the script
 * sends the email from the Google account that owns it, so there is no
 * third-party service, no domain verification and no SMTP password anywhere.
 *
 * SETUP
 * -----
 * 1. Go to https://script.google.com  ->  New project
 * 2. Delete the sample code, paste this file in, and rename the project
 *    (e.g. "Clifton lead fallback mailer")
 * 3. Change SHARED_TOKEN below to a long random string, and set RECIPIENT
 * 4. Deploy  ->  New deployment  ->  type: Web app
 *       Execute as:        Me
 *       Who has access:    Anyone            <- required; the token is the guard
 * 5. Authorise when prompted (it needs permission to send mail as you)
 * 6. Copy the Web app URL and put it in .env.local as:
 *       LEAD_FALLBACK_SCRIPT_URL=<the /exec url>
 *       LEAD_FALLBACK_TOKEN=<the same SHARED_TOKEN>
 *
 * After editing this script you must redeploy (Deploy -> Manage deployments ->
 * edit -> New version), otherwise the old code keeps running.
 *
 * QUOTA: 100 recipients/day on a consumer Gmail account, 1,500/day on Google
 * Workspace. This only fires when the CRM fails, so that is ample.
 */

/** Must match LEAD_FALLBACK_TOKEN in the website's env. Change this. */
var SHARED_TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';

/** Where fallback leads are delivered. Kept here, never taken from the request,
 *  so a leaked token still cannot be used to mail anyone else. */
var RECIPIENT = 'realestate@cliftonuae.com';

/** Name shown as the sender. The address is the Google account running this. */
var SENDER_NAME = 'Clifton Website';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, error: 'empty_request' });
    }

    var body = JSON.parse(e.postData.contents);

    if (!body.token || body.token !== SHARED_TOKEN) {
      return reply({ ok: false, error: 'unauthorized' });
    }
    if (!body.subject || !(body.html || body.text)) {
      return reply({ ok: false, error: 'missing_content' });
    }

    var options = {
      name: SENDER_NAME,
      htmlBody: body.html || undefined,
    };

    // Lets sales reply straight to the lead from their inbox.
    if (body.replyTo && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.replyTo)) {
      options.replyTo = body.replyTo;
    }

    MailApp.sendEmail(RECIPIENT, String(body.subject).slice(0, 200), body.text || '', options);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

/** Apps Script always answers HTTP 200, so the caller must read this body. */
function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run this once from the editor to verify sending works before deploying. */
function testSend() {
  MailApp.sendEmail(RECIPIENT, 'Clifton fallback mailer — test', 'If you can read this, the script can send mail.', {
    name: SENDER_NAME,
  });
}
