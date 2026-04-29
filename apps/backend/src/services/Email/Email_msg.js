export const getInviteEmailTemplate = (inviteToken, orgName, userEmail) => {
  const inviteLink = `${process.env.FRONTEND_URL}/register?token=${inviteToken}&email=${userEmail}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to Join ${orgName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #4CAF50;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${orgName}</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You have been invited to join <strong>${orgName}</strong> as a team member.</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p>Click the button below to complete your registration and activate your account:</p>
          <div style="text-align: center;">
            <a href="${inviteLink}" class="button">Complete Registration</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${inviteLink}
          </p>
          <p><strong>Note:</strong> This invitation link will expire in 7 days.</p>
          <p>Once registered, you can login and start using the platform.</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} ${orgName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getWelcomeEmailTemplate = (name, orgName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to ${orgName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          padding: 20px;
          background-color: #4CAF50;
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome ${name}!</h1>
        </div>
        <div class="content">
          <p>Your account has been successfully activated!</p>
          <p>You can now login to your dashboard and start using the platform.</p>
          <p><strong>Organization:</strong> ${orgName}</p>
          <p>If you have any questions, feel free to contact your organization administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getOrgWelcomeTemplate = (orgName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">

          <!-- Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

            <!-- Header -->
            <tr>
              <td style="background:#007bff; color:#ffffff; padding:20px; text-align:center;">
                <h2 style="margin:0;">🚀 IncidentWatch</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; text-align:center;">

                <h2 style="color:#333; margin-bottom:10px;">
                  🎉 Welcome ${orgName}!
                </h2>

                <p style="color:#555; font-size:15px; line-height:1.6;">
                  Your organization has been <strong>successfully verified</strong>.
                </p>

                <p style="color:#555; font-size:15px; line-height:1.6;">
                  You’re now ready to explore <strong>IncidentWatch</strong> and start monitoring your systems.
                </p>

                <!-- CTA Button -->
                <a href="http://localhost:3000/login"
                  style="display:inline-block; margin:25px 0; padding:14px 26px;
                         background:#28a745; color:#ffffff; text-decoration:none;
                         border-radius:6px; font-weight:bold; font-size:16px;">
                  🔐 Login to Dashboard
                </a>

                <p style="color:#555; font-size:14px;">
                  You can now:
                </p>

                <ul style="text-align:left; max-width:400px; margin:0 auto; color:#555; font-size:14px; line-height:1.6;">
                  <li>Invite your team members</li>
                  <li>Assign roles (Developer, Tester, etc.)</li>
                  <li>Integrate your services</li>
                  <li>Start receiving real-time alerts 🚨</li>
                </ul>

                <p style="margin-top:20px; color:#555; font-size:14px;">
                  Need help? We're here for you anytime.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9f9f9; text-align:center; padding:15px; font-size:12px; color:#888;">
                © ${new Date().getFullYear()} IncidentWatch • All rights reserved
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
  const verificationUrl = `http://localhost:4200/incidentwatch/verify/email/${token}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Account</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="500" cellpadding="0" cellspacing="0" 
               style="background:#1e293b; border-radius:10px; padding:30px; text-align:center; color:#ffffff;">

          <!-- Heading -->
          <tr>
            <td>
              <h2 style="margin-bottom:10px;">🔐 Account Verification</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td>
              <p style="font-size:14px; color:#cbd5f5; margin-bottom:25px; line-height:1.5;">
                Click the button below to verify your account and activate your profile.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td>
              <a href="${verificationUrl}"
                 style="display:inline-block; padding:12px 22px; background:#22c55e;
                        color:#ffffff; text-decoration:none; border-radius:6px;
                        font-weight:bold; font-size:15px;">
                ✅ Verify Account
              </a>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td>
              <p style="font-size:12px; color:#94a3b8; margin-top:20px;">
                If the button doesn't work, copy and paste this link:
              </p>

              <p style="font-size:12px; color:#cbd5f5; word-break:break-all;">
                ${verificationUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="font-size:12px; color:#94a3b8; margin-top:15px;">
                If you did not request this, you can safely ignore this email.
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
