import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface WelcomeEmailProps {
  subscriberName?: string;
  unsubscribeUrl?: string;
}

export const WelcomeEmail = ({
  subscriberName,
  unsubscribeUrl,
}: WelcomeEmailProps) => {
  return (
    <EmailLayout
      previewText="Thank you for subscribing to my newsletter"
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* Greeting */}
      <Section style={greetingSection}>
        <Heading style={heading}>
          Welcome {subscriberName || "there"}! 🎉
        </Heading>
        <Text style={subtitle}>
          Thank you for subscribing to my newsletter
        </Text>
      </Section>

      {/* What to Expect */}
      <Section style={contentSection}>
        <Heading as="h2" style={sectionHeading}>
          What to expect:
        </Heading>
        <Section style={listSection}>
          <Text style={listItem}>🚀 Latest projects and updates</Text>
          <Text style={listItem}>💡 Tech insights and learnings</Text>
          <Text style={listItem}>📝 New blog posts and articles</Text>
          <Text style={listItem}>🎯 Behind-the-scenes content</Text>
        </Section>
      </Section>

      {/* Closing */}
      <Section style={closingSection}>
        <Text style={closingText}>
          I'm excited to have you on board! You'll hear from me soon with
          exciting updates and content.
        </Text>
        <Text style={signature}>
          Best regards,
          <br />
          <strong>Christian Onoh</strong>
        </Text>
      </Section>

      {/* ✅ Mobile + Dark Mode Styles */}
      <style>
        {`
          /* Responsive for mobile clients */
          @media only screen and (max-width: 600px) {
            .email-container {
              padding: 20px !important;
            }

            h1, h2, p {
              font-size: 15px !important;
              line-height: 1.6 !important;
            }

            h1 {
              font-size: 24px !important;
            }

            h2 {
              font-size: 18px !important;
            }

            .content-box {
              padding: 20px !important;
            }
          }

          /* Outlook mobile safe area */
          @media only screen and (max-width:480px) {
            body, table, td, p, a, li, blockquote {
              -ms-text-size-adjust: 100% !important;
              -webkit-text-size-adjust: 100% !important;
            }
          }

          /* 🌙 Dark Mode Support */
          @media (prefers-color-scheme: dark) {
            body, .email-container {
              background-color: #0f0f11 !important;
              color: #e6e6e9 !important;
            }

            h1, h2 {
              color: #eaeaea !important;
            }

            .content-box {
              background-color: #1a1a1d !important;
              border-left: 4px solid #b8a2f2 !important;
            }

            p, span, td, div {
              color: #cccccc !important;
            }

            a {
              color: #b8a2f2 !important;
            }
          }
        `}
      </style>
    </EmailLayout>
  );
};

/* ---------------- Styles ---------------- */

const accent = "#b8a2f2";

const greetingSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const heading = {
  color: "#333333",
  fontSize: "30px",
  fontWeight: "bold",
  lineHeight: "1.3",
  margin: "0 0 10px",
};

const subtitle = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "10px 0 0",
};

const contentSection = {
  backgroundColor: "#f8f9fa",
  padding: "28px",
  borderRadius: "12px",
  margin: "24px 0",
  borderLeft: `4px solid ${accent}`,
} as const;

const sectionHeading = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const listSection = {
  margin: "0",
};

const listItem = {
  color: "#555555",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "6px 0",
};

const closingSection = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const closingText = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "20px",
};

const signature = {
  color: "#333333",
  fontSize: "16px",
  fontWeight: "500",
  marginTop: "20px",
};

export default WelcomeEmail;
