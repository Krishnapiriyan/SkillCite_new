import * as Brevo from '@getbrevo/brevo';
import { apiInstance, isBrevoConfigured } from '../config/brevo.js';
import env from '../config/env.js';

const sendEmail = async (to, subject, htmlContent) => {
  if (isBrevoConfigured && apiInstance) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: env.BREVO_SENDER_NAME, email: env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    try {
      return await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (err) {
      if (err.response && err.response.body) {
        const detail = err.response.body.message || JSON.stringify(err.response.body);
        throw new Error(detail);
      }
      throw err;
    }
  } else {
    console.log('\n================== [MOCK EMAIL SENT] ==================');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('------------------------------------------------------');
    console.log(htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('=======================================================\n');
    return { messageId: `mock-id-${Date.now()}` };
  }
};

export const sendEmployerConfirmation = (toEmail, name, company) =>
  sendEmail(toEmail, 'We received your talent request — SkillCite',
    employerConfirmationTemplate(name, company));

export const sendCandidateConfirmation = (toEmail, name) =>
  sendEmail(toEmail, 'Your CV is in our talent network — SkillCite',
    candidateConfirmationTemplate(name));

export const sendEngineeringConfirmation = (toEmail, name, service) =>
  sendEmail(toEmail, 'Your engineering service request — SkillCite',
    engineeringConfirmationTemplate(name, service));

export const sendContactConfirmation = (toEmail, name) =>
  sendEmail(toEmail, 'We received your message — SkillCite',
    contactConfirmationTemplate(name));

export const sendAdminAlert = (type, submitterName, submitterEmail) =>
  sendEmail(env.ADMIN_ALERT_EMAIL, `[SkillCite] New ${type}: ${submitterName}`,
    adminAlertTemplate(type, submitterName, submitterEmail));

export const sendManualEmail = (toEmail, subject, body) => {
  const formattedBody = body
    .split('\n')
    .map(p => p.trim() ? `<p style="font-size: 14px; margin-bottom: 16px; color: #334155; line-height: 1.6;">${p}</p>` : '')
    .join('');

  const emailContent = `
    <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
      Message from SkillCite Team
    </h2>
    <div style="font-size: 14px; margin-bottom: 24px; color: #334155;">
      ${formattedBody}
    </div>
  `;

  return sendEmail(toEmail, subject, emailShell(emailContent));
};

// HTML Master Template Wrapper
const emailShell = (content) => `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0; width: 100%; -webkit-text-size-adjust: 100%;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); border-collapse: collapse;">
    <!-- Header -->
    <tr>
      <td style="background-color: #090e1a; background-image: linear-gradient(135deg, #090e1a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #2563eb;">
        <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase;">
          Skill<span style="color: #3b82f6;">Cite</span>
        </span>
        <div style="color: rgba(255,255,255,0.45); font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px;">
          Recruitment & Engineering Services
        </div>
      </td>
    </tr>
    <!-- Content Body -->
    <tr>
      <td style="padding: 40px 32px; color: #1f2937; line-height: 1.6;">
        ${content}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fafb; padding: 28px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #4b5563; font-size: 11px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: 0.08em; text-transform: uppercase;">
          SkillCite &mdash; Recruitment & Engineering Services
        </p>
        <p style="color: #9ca3af; font-size: 10px; margin: 0 0 16px 0; line-height: 1.4;">
          Connecting elite professionals with industry-leading organizations.
        </p>
        <p style="font-size: 11px; color: #9ca3af; margin: 0; line-height: 1.4;">
          <a href="https://skillcite.com" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: bold; margin: 0 8px;">Visit Portal</a> &bull; 
          <a href="mailto:admin@skillcite.com" style="color: #2563eb; text-decoration: none; font-weight: bold; margin: 0 8px;">Contact Support</a>
        </p>
      </td>
    </tr>
  </table>
</div>
`;

// HTML email templates — professional branded format
const employerConfirmationTemplate = (name, company) => emailShell(`
  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
    Hello ${name},
  </h2>
  <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
    Thank you for choosing SkillCite. We have successfully received your recruitment request for <strong>${company}</strong>.
  </p>
  <!-- Details Summary Box -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <h4 style="color: #1e293b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">
      Submission Highlights
    </h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Company:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${company}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Submitted By:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Review SLA:</td>
        <td style="padding: 6px 0; color: #059669; font-weight: 700;">24-Hour Review Active</td>
      </tr>
    </table>
  </div>
  <p style="font-size: 14px; margin-bottom: 0; color: #334155; line-height: 1.6;">
    Our specialized talent sourcing team is already reviewing your job parameters. We will map your vacancy against vetted engineering, drafting, and business specialists in our active pipeline and contact you shortly with matched candidates.
  </p>
`);

const candidateConfirmationTemplate = (name) => emailShell(`
  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
    Welcome to the Network, ${name}!
  </h2>
  <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
    Your CV has been successfully received and ingested into the **SkillCite Talent Network**.
  </p>
  <!-- Details Summary Box -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <h4 style="color: #1e293b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">
      Talent Profile Status
    </h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Candidate:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Ingestion Status:</td>
        <td style="padding: 6px 0; color: #2563eb; font-weight: 700;">Ingested & Live</td>
      </tr>
    </table>
  </div>
  <p style="font-size: 14px; margin-bottom: 0; color: #334155; line-height: 1.6;">
    We map our active recruitment pipeline to registered candidates daily. If a vacancy matches your skills, years of experience, and preferences, one of our technical recruiters will contact you directly to schedule an introductory interview.
  </p>
`);

const engineeringConfirmationTemplate = (name, service) => emailShell(`
  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
    Service Request Received, ${name}
  </h2>
  <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
    Thank you for submitting your engineering service requirements to SkillCite. We have logged your project criteria.
  </p>
  <!-- Details Summary Box -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <h4 style="color: #1e293b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">
      Technical Intake Details
    </h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Client Name:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Service Specialty:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-transform: capitalize;">${service}</td>
      </tr>
    </table>
  </div>
  <p style="font-size: 14px; margin-bottom: 0; color: #334155; line-height: 1.6;">
    Our structural computations and project design team are analyzing your uploaded plan sets and scope details. An engineering advisor will reach out with a technical proposal and fee timeline within **two business days**.
  </p>
`);

const contactConfirmationTemplate = (name) => emailShell(`
  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
    Thanks for Reaching Out, ${name}
  </h2>
  <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
    We have successfully received your contact inquiry message.
  </p>
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <p style="font-size: 13px; font-style: italic; color: #4b5563; margin: 0; line-height: 1.5;">
      "Our support administrators are reviewing your submission and will respond to your registered email address shortly."
    </p>
  </div>
  <p style="font-size: 14px; margin-bottom: 0; color: #334155; line-height: 1.6;">
    If your message relates to an active recruitment project or urgent talent placement, an account coordinator will follow up as a priority.
  </p>
`);

const adminAlertTemplate = (type, name, email) => emailShell(`
  <h2 style="color: #2563eb; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px;">
    New System Intake Received
  </h2>
  <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
    A new transactional submission has been recorded in the SkillCite database:
  </p>
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <h4 style="color: #1e293b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 12px;">
      Intake Summary
    </h4>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Intake Type:</td>
        <td style="padding: 6px 0; color: #2563eb; font-weight: 700; text-transform: uppercase;">${type}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Name / Co:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${email}</td>
      </tr>
    </table>
  </div>
  <p style="font-size: 14px; margin-bottom: 0; color: #334155; line-height: 1.6;">
    Please log in to the **Administrative Portal** to review the complete submitted credentials, download the CV, or check attached technical plans.
  </p>
`);
