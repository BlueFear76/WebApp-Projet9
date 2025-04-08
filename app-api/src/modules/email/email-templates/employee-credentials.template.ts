// src/email/templates/employee-credentials.template.ts

export const employeeCredentialsEmail = (
  name: string,
  email: string,
  password: string,
  resetLink: string,
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Tool Tracking System</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #2f88d0;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .credentials {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .reset-link {
        color: #2f88d0;
        text-decoration: none;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        color: #888888;
        font-size: 12px;
        padding: 10px;
        background-color: #f9f9f9;
        border-top: 1px solid #eeeeee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Tool Tracking System!</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>For security reasons, we strongly recommend you reset your password after your first login.</p>
        <p>
          You can reset your password anytime by clicking the link below:
        </p>
        <h3>
          <a href="${resetLink}" class="reset-link">Reset Password</a>
        </h3>
        <p>We are excited to have you on board!</p>
        <p>
          Best regards,<br />
          Tool Tracking Team
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Tool Tracking System. All rights reserved.</p>
        <p>
          Need help? Contact us at
          <a href="mailto:support@tooltracking.com">support@tooltracking.com</a>
        </p>
      </div>
    </div>
  </body>
</html>
`;
