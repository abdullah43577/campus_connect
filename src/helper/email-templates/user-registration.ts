import mjml2html from "mjml";

export interface UserRegistrationProps {
  heading: string;
  username: string;
  body: string;
  otp: string;
  expiryTime: string;
}

export const userRegistration = function ({ heading, username, body, otp, expiryTime }: UserRegistrationProps) {
  const currentYear = new Date().getFullYear();

  return mjml2html(`
    <!doctype html>
<mjml>
  <mj-head>
    <mj-title>Campus Connect</mj-title>
    <mj-preview>Campus Connect - Verification Code</mj-preview>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="16px" color="#333333" line-height="1.5" />
      <mj-button background-color="#4CAF50" color="white" border-radius="5px" />
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
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 5px;
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F4F4F4">
    <!-- Header Section -->
    <mj-section background-color="#ffffff" padding="20px 0">
      <mj-column>
        <mj-image src="https://placehold.co/150x50/4CAF50/FFFFFF/png?text=CampusConnect" alt="Campus Connect Logo" css-class="header-logo" />
      </mj-column>
    </mj-section>

    <!-- Content Section -->
    <mj-section background-color="#ffffff" padding="0 20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" color="#4CAF50">
          ${heading}
        </mj-text>
        <mj-text>
          Hello ${username},
        </mj-text>
        <mj-text>
          ${body}
        </mj-text>
        
        <!-- OTP Display -->
        <mj-section background-color="#f5f5f5" border-radius="8px" padding="10px">
          <mj-column>
            <mj-text align="center" css-class="otp-code">
              ${otp}
            </mj-text>
          </mj-column>
        </mj-section>
        
        <mj-text padding-top="15px">
          This verification code will expire in ${expiryTime}.
        </mj-text>
        <mj-text>
          If you did not request this code, please ignore this email or contact our support team.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Additional Info Section -->
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-divider border-color="#F4F4F4" border-width="1px" />
        <mj-text font-size="14px" color="#777777">
          Need help? Contact our support team at <a href="mailto:support@campusconnect.com">support@campusconnect.com</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer Section -->
    <mj-section background-color="#333333" padding="20px 0">
      <mj-column>
        <mj-text font-size="14px" color="#ffffff" align="center">
          Campus Connect - Connecting Students, Creating Memories
        </mj-text>
        <mj-social font-size="12px" align="center" mode="horizontal">
          <mj-social-element name="facebook" href="https://www.facebook.com/campusconnect" background-color="#333333" />
          <mj-social-element name="twitter" href="https://www.twitter.com/campusconnect" background-color="#333333" />
          <mj-social-element name="instagram" href="https://www.instagram.com/campusconnect" background-color="#333333" />
        </mj-social>
        <mj-text font-size="12px" color="#ffffff" align="center">
          © ${currentYear} Campus Connect. All rights reserved.
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
