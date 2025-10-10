import {
  Heading,
  Hr,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface NewsletterEmailProps {
  subject: string;
  preheader?: string;
  subscriberName?: string;
  contentHtml: string;
  unsubscribeUrl?: string;
}

export const NewsletterEmail = ({
  subject,
  preheader,
  subscriberName,
  contentHtml,
  unsubscribeUrl,
}: NewsletterEmailProps) => {
  return (
    <EmailLayout previewText={preheader} unsubscribeUrl={unsubscribeUrl}>
      {/* Greeting */}
      <Section style={greetingSection}>
        <Heading style={heading}>{subject}</Heading>
        <Text style={greeting}>Hi {subscriberName || "there"} 👋</Text>
      </Section>

      {/* Newsletter Content */}
      <Section className="content-box" style={contentSection}>
        <div
          style={contentHtmlWrapper}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </Section>

      <Hr style={divider} />

      {/* Closing */}
      <Section style={closingSection}>
        <Text style={closingText}>
          Thanks for reading 💜<br />
          Stay tuned for more updates!
        </Text>
      </Section>

      {/* ✅ Mobile + Dark Mode Styles */}
      <style>
        {`
          /* Mobile-friendly tweaks */
          @media only screen and (max-width: 600px) {
            .email-container {
              padding: 18px !important;
            }

            h1, h2, p {
              font-size: 15px !important;
              line-height: 1.6 !important;
            }

            h1 {
              font-size: 22px !important;
            }

            .content-box {
              padding: 16px !important;
              margin: 14px 0 !important;
            }
          }

          /* Outlook mobile safe area */
          @media only screen and (max-width:480px) {
            body, table, td, p, a, li, blockquote {
              -ms-text-size-adjust: 100% !important;
              -webkit-text-size-adjust: 100% !important;
            }
          }

          /* 🌙 Dark Mode Compatibility */
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
              border-left: 3px solid #b8a2f2 !important;
              color: #eaeaea !important;
            }

            p, span, td, div {
              color: #cccccc !important;
            }

            a {
              color: #b8a2f2 !important;
            }

            hr {
              border-color: rgba(184, 162, 242, 0.3) !important;
            }
          }
        `}
      </style>
    </EmailLayout>
  );
};

/* ---------------- Styles ---------------- */

const accent = "#b8a2f2"; // pastel purple

const greetingSection = {
  textAlign: "center" as const,
  marginBottom: "22px",
  padding: "0 20px",
};

const heading = {
  color: "#2d2d2d",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "1.3",
  margin: "0 0 8px",
};

const greeting = {
  color: "#555",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "6px 0 0",
};

const contentSection = {
  backgroundColor: "#faf9ff",
  padding: "20px 24px",
  borderRadius: "10px",
  margin: "18px 0",
  borderLeft: `3px solid ${accent}`,
  color: "#333",
  fontSize: "15px",
  lineHeight: "1.6",
  width: "100%",
  boxSizing: "border-box" as const,
};

const contentHtmlWrapper = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Helvetica Neue", sans-serif',
  color: "#333",
  fontSize: "15px",
  lineHeight: "1.6",
};

const divider = {
  margin: "28px auto 18px",
  border: "none",
  borderTop: "1px solid #eee",
  width: "85%",
};

const closingSection = {
  textAlign: "center" as const,
  marginTop: "8px",
  padding: "0 20px",
};

const closingText = {
  color: "#777",
  fontSize: "13px",
  lineHeight: "20px",
};

export default NewsletterEmail;
