import { ENV } from "@/configs/env.config.js";
import { API_PREFIX } from "@/constants/index.js";

const getCommonStyles = (frontendUrl) => `
  @font-face {
    font-family: 'NeueMachina';
    src: url('${frontendUrl}/fonts/NeueMachina-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
  body {
    font-family: Helvetica, Arial, sans-serif;
    background-color: #f6f6f6;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, .font-display {
    font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }
`;

export const getInviteEmailTemplate = (inviteToken, orgName, userEmail) => {
  const frontendUrl = `${ENV.BACKEND_URL}${API_PREFIX}/invite/accept-invite?token=${inviteToken}&email=${userEmail}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to Join ${orgName}</title>
      <style>
        ${getCommonStyles(frontendUrl)}
      </style>
    </head>
    <body style="background-color: #f6f6f6; font-family: Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f6f6; padding: 16px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);">
              <!-- Header/Logo -->
              <tr>
                <td style="padding: 32px 32px 0 32px;">
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td class="font-display" style="font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                        <span style="color: #389f16;">●</span> IncidentWatch
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Main Content -->
              <tr>
                <td style="padding: 32px;">
                  <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; line-height: 1.1; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    You've been invited to join ${orgName}
                  </h1>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    Hello! You've been invited to join the <strong>${orgName}</strong> team on IncidentWatch. 
                    Collaborate with your team to monitor services and manage incidents in real-time.
                  </p>
                  
                  <!-- Info Box -->
                  <table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f8fafc; border-radius: 10px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
                    <tr>
                      <td style="padding: 16px;">
                        <p style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Invited Email</p>
                        <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a;">${userEmail}</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    Click the button below to complete your registration and join the organization:
                  </p>

                  <!-- CTA Button -->
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${frontendUrl}" style="display: inline-block; padding: 14px 32px; background-color: #389f16; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 20px rgba(56, 159, 22, 0.3);">
                          Accept Invitation
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback Link -->
                  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <div style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 12px; color: #64748b; word-break: break-all;">
                      ${frontendUrl}
                    </div>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    This invitation link will expire in 7 days. If you weren't expecting this invitation, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Global Footer -->
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; margin-top: 16px;">
              <tr>
                <td align="center" style="font-size: 12px; color: #94a3b8;">
                  &copy; ${new Date().getFullYear()} IncidentWatch. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getWelcomeEmailTemplate = (name, orgName) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${orgName}</title>
      <style>
        ${getCommonStyles(frontendUrl)}
      </style>
    </head>
    <body style="background-color: #f6f6f6; font-family: Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f6f6; padding: 16px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);">
              <!-- Header/Logo -->
              <tr>
                <td style="padding: 32px 32px 0 32px;">
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td class="font-display" style="font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                        <span style="color: #389f16;">●</span> IncidentWatch
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Main Content -->
              <tr>
                <td style="padding: 32px;">
                  <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; line-height: 1.1; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    Welcome to the team, ${name}!
                  </h1>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    Your account has been successfully activated. We're excited to have you on board with <strong>${orgName}</strong>.
                  </p>
                  
                  <div style="background-color: rgba(56, 159, 22, 0.08); border: 1px solid rgba(56, 159, 22, 0.2); border-radius: 10px; padding: 20px; margin-bottom: 32px;">
                    <p style="margin: 0; font-size: 15px; color: #166534; line-height: 1.5;">
                      <strong>Success!</strong> Your setup is complete. You now have full access to your organization's dashboard.
                    </p>
                  </div>

                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    You can now login to your dashboard to start monitoring services, viewing logs, and collaborating with your team.
                  </p>

                  <!-- CTA Button -->
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${frontendUrl}/login" style="display: inline-block; padding: 14px 32px; background-color: #389f16; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 20px rgba(56, 159, 22, 0.3);">
                          Go to Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer Section -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    If you have any questions or need assistance, feel free to reach out to your organization administrator.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Global Footer -->
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; margin-top: 16px;">
              <tr>
                <td align="center" style="font-size: 12px; color: #94a3b8;">
                  &copy; ${new Date().getFullYear()} IncidentWatch. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const getOrgWelcomeTemplate = (orgName) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to IncidentWatch</title>
    <style>
      ${getCommonStyles(frontendUrl)}
    </style>
  </head>

  <body style="margin:0; padding:0; background-color:#f6f6f6; font-family: Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f6f6; padding: 16px 20px;">
      <tr>
        <td align="center">
          <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12); overflow: hidden;">
            <!-- Header Banner -->
            <tr>
              <td style="background-color: #0f172a; padding: 32px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">🚀</div>
                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.04em; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Welcome, ${orgName}!</h2>
                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.7); font-size: 16px;">Your organization is ready to go.</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
                <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.03em; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Let's get started</h3>
                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                  Your organization has been successfully verified. You’re now ready to explore <strong>IncidentWatch</strong> and take control of your system's health.
                </p>

                <!-- Next Steps -->
                <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom: 32px;">
                  <tr>
                    <td style="padding: 12px 0;">
                      <table border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td width="32" valign="top" style="font-size: 18px;">👥</td>
                          <td style="padding-left: 12px;">
                            <strong style="display: block; font-size: 15px; color: #0f172a; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Invite your team</strong>
                            <span style="font-size: 14px; color: #64748b;">Add developers and admins to your workspace.</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td width="32" valign="top" style="font-size: 18px;">🛠️</td>
                          <td style="padding-left: 12px;">
                            <strong style="display: block; font-size: 15px; color: #0f172a; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Integrate services</strong>
                            <span style="font-size: 14px; color: #64748b;">Connect your APIs and microservices for monitoring.</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td width="32" valign="top" style="font-size: 18px;">🚨</td>
                          <td style="padding-left: 12px;">
                            <strong style="display: block; font-size: 15px; color: #0f172a; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Configure alerts</strong>
                            <span style="font-size: 14px; color: #64748b;">Get real-time notifications when issues arise.</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    <td align="center">
                      <a href="${frontendUrl}/login" style="display: inline-block; padding: 14px 32px; background-color: #389f16; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 20px rgba(56, 159, 22, 0.3);">
                        Login to Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                  Need help? Check our documentation or reply to this email.
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">
                  &copy; ${new Date().getFullYear()} IncidentWatch • All rights reserved
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export const verifyEmail_msg = (token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${ENV.BACKEND_URL}${API_PREFIX}/auth/verify-email/${token}`;

  return `
    <!DOCTYPE html>
    <html lang="en"> 
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        ${getCommonStyles(frontendUrl)}
      </style>
    </head>
    <body style="background-color: #f6f6f6; font-family: Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f6f6; padding: 16px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);">
              <!-- Top Accent -->
              <tr>
                <td style="height: 6px; background-color: #389f16; border-radius: 14px 14px 0 0;"></td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <div style="font-size: 40px; margin-bottom: 24px;">✉️</div>
                  <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; font-family: 'NeueMachina', 'Helvetica Neue', Helvetica, Arial, sans-serif;">Verify your email</h1>
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    Thanks for signing up for IncidentWatch! Please verify your email address to get started.
                  </p>

                  <!-- CTA Button -->
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.2);">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback Link -->
                  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: left;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8;">
                      If the button doesn't work, copy and paste this link:
                    </p>
                    <div style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 12px; color: #64748b; word-break: break-all;">
                      ${verificationUrl}
                    </div>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 0 40px 32px 40px; text-align: center;">
                  <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                    If you did not request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Global Footer -->
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; width: 100%; margin-top: 16px;">
              <tr>
                <td align="center" style="font-size: 12px; color: #94a3b8;">
                  &copy; ${new Date().getFullYear()} IncidentWatch • Modern Monitoring
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
