import mjml2html from "mjml";

export interface PasswordResetProps {
  heading: string;
  username: string;
  body: string;
  otp: string;
  expiryTime: string;
  resetUrl?: string; // Optional reset URL for button link
}

export const passwordResetTemplate = function ({ heading, username, body, otp, expiryTime, resetUrl = "#" }: PasswordResetProps) {
  const currentYear = new Date().getFullYear();

  return mjml2html(`
    <!doctype html>
<mjml>
  <mj-head>
    <mj-title>Sequential Jobs - Password Reset</mj-title>
    <mj-preview>Sequential Jobs - Reset Your Password</mj-preview>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="16px" color="#333333" line-height="1.5" />
      <mj-button background-color="#3BD1E5" color="white" border-radius="5px" />
    </mj-attributes>
    <mj-style>
      .header-logo {
        width: 150px;
      }
      .footer-link {
        color: #777777;
        text-decoration: none;
      }
      .otp-code {
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 3px;
      }
      .divider {
        border-color: #E0E0E0;
      }
      .message-body {
        white-space: pre-line;
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F4F4F4">
    <!-- Header Section -->
    <mj-section background-color="#ffffff" padding="20px 0">
      <mj-column>
        <mj-image src="https://placehold.co/150x50/3BD1E5/FFFFFF/png?text=SequentialJobs" alt="Sequential Jobs Logo" css-class="header-logo" />
      </mj-column>
    </mj-section>

    <!-- Content Section -->
    <mj-section background-color="#ffffff" padding="10px 20px 0">
      <mj-column>
        <mj-text font-size="22px" font-weight="bold" color="#3BD1E5">
          ${heading}
        </mj-text>
        <mj-text>
          Hello ${username},
        </mj-text>
        <mj-text css-class="message-body">
          ${body}
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Reset Button Section -->
    <mj-section background-color="#ffffff" padding="0 20px">
      <mj-column>
        <mj-button href="${resetUrl}" background-color="#3BD1E5" color="white" font-weight="bold" padding="12px 20px" border-radius="4px">
          Reset Password
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- OTP Section -->
    <mj-section background-color="#ffffff" padding="10px 20px">
      <mj-column>
        <mj-text font-size="14px" align="center">
          Or use this password reset code:
        </mj-text>
        <mj-section background-color="#f5f5f5" border-radius="8px" padding="10px">
          <mj-column>
            <mj-text align="center" css-class="otp-code">
              ${otp}
            </mj-text>
          </mj-column>
        </mj-section>
        
        <mj-text padding-top="15px" font-size="14px" color="#777777">
          This reset code will expire in ${expiryTime}.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Security Notice Section -->
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-divider border-color="#E0E0E0" border-width="1px" css-class="divider" />
        <mj-text font-size="14px" color="#777777">
          For security reasons, this password reset request was received from:
        </mj-text>
        <mj-text font-size="14px" color="#777777">
          • Browser: {{browser}}
          <br />
          • Location: {{location}}
          <br />
          • Time: {{timestamp}}
        </mj-text>
        <mj-text font-size="14px" color="#777777">
          If you didn't request a password reset, please secure your account immediately by <a href="#" style="color: #3BD1E5;">contacting support</a>.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Help Section -->
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-divider border-color="#E0E0E0" border-width="1px" css-class="divider" />
        <mj-text font-size="14px" color="#777777">
          Need help? Contact our support team at <a href="mailto:support@sequentialjobs.com" style="color: #3BD1E5;">support@sequentialjobs.com</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer Section -->
    <mj-section background-color="#333333" padding="20px 0">
      <mj-column>
        <mj-text font-size="14px" color="#ffffff" align="center">
          Sequential Jobs - Finding Your Next Career Opportunity
        </mj-text>
        <mj-social font-size="12px" align="center" mode="horizontal">
          <mj-social-element name="facebook" href="https://www.facebook.com/sequentialjobs" background-color="#333333" />
          <mj-social-element name="twitter" href="https://www.twitter.com/sequentialjobs" background-color="#333333" />
          <mj-social-element name="linkedin" href="https://www.linkedin.com/company/sequentialjobs" background-color="#333333" />
        </mj-social>
        <mj-text font-size="12px" color="#ffffff" align="center">
          © ${currentYear} Sequential Jobs. All rights reserved.
        </mj-text>
        <mj-text font-size="12px" color="#ffffff" align="center">
          <a href="#" class="footer-link" style="color: #ffffff;">Unsubscribe</a> |
          <a href="#" class="footer-link" style="color: #ffffff;">Privacy Policy</a> |
          <a href="#" class="footer-link" style="color: #ffffff;">Terms of Service</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);
};
