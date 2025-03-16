import mjml2html from "mjml";

export interface EmailVerificationSuccessProps {
  username: string;
  loginUrl: string;
  heading: string;
  body: string;
  btnTxt: string;
}

export const emailVerificationSuccess = function ({
  username,
  loginUrl = "https://campusconnect.com/login",
  heading = "Email Successfully Verified",
  body = "Congratulations! Your email has been successfully verified. Your Campus Connect account is now active and ready to use.",
  btnTxt = "Log in to Your Account",
}: EmailVerificationSuccessProps) {
  const currentYear = new Date().getFullYear();

  return mjml2html(`<!doctype html>
<mjml>
  <mj-head>
    <mj-title>Campus Connect</mj-title>
    <mj-preview>Campus Connect - Email Successfully Verified</mj-preview>
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
      .success-icon {
        font-size: 48px;
        color: #4CAF50;
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
        <!-- Success Icon -->
        <mj-text align="center" css-class="success-icon">
          ✓
        </mj-text>
        
        <mj-text font-size="24px" font-weight="bold" color="#4CAF50" align="center">
          ${heading}
        </mj-text>
        
        <mj-text>
          Hello ${username},
        </mj-text>
        
        <mj-text>
          ${body}
        </mj-text>
        
        <mj-text>
          You now have full access to all Campus Connect features. You can create events, join existing ones, and connect with fellow students across campus.
        </mj-text>
        
        <mj-button background-color="#4CAF50" href="${loginUrl}">
          ${btnTxt}
        </mj-button>
        
        <mj-text>
          We hope you enjoy using Campus Connect. If you have any questions or need assistance, don't hesitate to reach out to our support team.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- What's Next Section -->
    <mj-section background-color="#ffffff" padding="0 20px">
      <mj-column>
        <mj-text font-weight="bold" font-size="18px">
          What's Next?
        </mj-text>
        <mj-text>
          <ul>
            <li>Complete your profile</li>
            <li>Browse upcoming events</li>
            <li>Connect with fellow students</li>
            <li>Create your first event</li>
          </ul>
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
