import mjml2html from "mjml";

export interface PasswordResetConfirmationProps {
  heading: string;
  username: string;
  body: string;
  btnTxt: string;
  btnAction: string;
}

export const passwordResetConfirmationTemplate = function ({ heading, username, body, btnTxt, btnAction }: PasswordResetConfirmationProps) {
  const currentYear = new Date().getFullYear();

  return mjml2html(`
    <!doctype html>
<mjml>
  <mj-head>
    <mj-title>Sequential Jobs - Password Reset Confirmation</mj-title>
    <mj-preview>Your Sequential Jobs password has been reset</mj-preview>
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
      .message-body {
        white-space: pre-line;
      }
      .alert-icon {
        width: 60px;
        height: 60px;
      }
      .security-box {
        border: 1px solid #E0E0E0;
        border-radius: 6px;
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

    <!-- Alert Icon Section -->
    <mj-section background-color="#ffffff" padding="10px 20px 0">
      <mj-column>
        <mj-image src="https://placehold.co/60x60/3BD1E5/FFFFFF/png?text=✓" alt="Confirmation Icon" css-class="alert-icon" />
      </mj-column>
    </mj-section>

    <!-- Content Section -->
    <mj-section background-color="#ffffff" padding="0 20px">
      <mj-column>
        <mj-text font-size="22px" font-weight="bold" color="#3BD1E5" align="center">
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
    
    <!-- Security Info Section -->
    <mj-section background-color="#ffffff" padding="0 20px">
      <mj-column css-class="security-box">
        <mj-text font-size="16px" font-weight="bold" color="#333333" padding-bottom="0">
          Password Changed:
        </mj-text>
        <mj-text font-size="14px" color="#777777" padding-top="5px">
          • Date: {{date}}
          <br />
          • Time: {{time}}
          <br />
          • Device: {{device}}
          <br />
          • Location: {{location}}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Button Section -->
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-button href="${btnAction}" background-color="#3BD1E5" color="white" font-weight="bold" padding="12px 20px" border-radius="4px">
          ${btnTxt}
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Additional Security Tips -->
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-divider border-color="#E0E0E0" border-width="1px" />
        <mj-text font-size="16px" font-weight="bold" color="#333333">
          Security Tips:
        </mj-text>
        <mj-text font-size="14px" color="#777777">
          • Use strong, unique passwords for different accounts
          <br />
          • Enable two-factor authentication when available
          <br />
          • Never share your login credentials with anyone
          <br />
          • Check your account activity regularly
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Help Section -->
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-divider border-color="#E0E0E0" border-width="1px" />
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
