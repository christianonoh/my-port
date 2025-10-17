import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface ContactEmailProps {
  fullName: string;
  email?: string;
  phone?: string;
  message: string;
}

export const ContactEmail = ({
  fullName,
  email,
  phone,
  message,
}: ContactEmailProps) => {
  const contactInfo = email || phone;
  const contactType = email ? "Email" : "Phone";

  return (
    <EmailLayout previewText={`New contact form submission from ${fullName}`}>
      {/* Header */}
      <Section style={headerSection}>
        <Heading style={heading}>New Contact Form Submission</Heading>
        <Text style={timestamp}>
          Received on {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Section>

      {/* Contact Details */}
      <Section style={detailsSection}>
        <Heading as="h2" style={sectionHeading}>
          Contact Details
        </Heading>
        <Section style={detailsBox}>
          <Text style={detailRow}>
            <strong style={label}>Name:</strong> {fullName}
          </Text>
          <Text style={detailRow}>
            <strong style={label}>{contactType}:</strong> {contactInfo}
          </Text>
        </Section>
      </Section>

      {/* Message */}
      <Section style={messageSection}>
        <Heading as="h2" style={sectionHeading}>
          Message
        </Heading>
        <Section style={messageBox}>
          <Text style={messageText}>{message}</Text>
        </Section>
      </Section>

      {/* Footer Note */}
      <Section style={footerNote}>
        <Text style={footerNoteText}>
          This message was sent from your portfolio contact form.
        </Text>
      </Section>

      {/* Mobile + Dark Mode Styles */}
      <style>
        {`
          @media only screen and (max-width: 600px) {
            .details-box, .message-box {
              padding: 16px !important;
            }

            h1 {
              font-size: 24px !important;
            }

            h2 {
              font-size: 18px !important;
            }

            p, span, td, div {
              font-size: 15px !important;
              line-height: 1.6 !important;
            }
          }

          @media (prefers-color-scheme: dark) {
            .details-box, .message-box {
              background-color: #1a1a1d !important;
              border-left: 4px solid #b8a2f2 !important;
            }

            h1, h2 {
              color: #eaeaea !important;
            }

            p, span, td, div {
              color: #cccccc !important;
            }
          }
        `}
      </style>
    </EmailLayout>
  );
};

/* ---------------- Styles ---------------- */

const accent = "#b8a2f2";

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: `2px solid ${accent}30`,
};

const heading = {
  color: "#333333",
  fontSize: "28px",
  fontWeight: "bold",
  lineHeight: "1.3",
  margin: "0 0 10px",
};

const timestamp = {
  color: "#999999",
  fontSize: "14px",
  margin: "10px 0 0",
};

const detailsSection = {
  marginBottom: "24px",
};

const sectionHeading = {
  color: "#555555",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const detailsBox = {
  backgroundColor: "#f8f9fa",
  padding: "20px 24px",
  borderRadius: "8px",
  borderLeft: `4px solid ${accent}`,
  margin: "0",
};

const detailRow = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const label = {
  color: "#555555",
  fontWeight: "600",
};

const messageSection = {
  marginBottom: "24px",
};

const messageBox = {
  backgroundColor: "#f9f9f9",
  padding: "24px",
  borderRadius: "8px",
  margin: "0",
};

const messageText = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footerNote = {
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid #eeeeee",
  textAlign: "center" as const,
};

const footerNoteText = {
  color: "#999999",
  fontSize: "13px",
  fontStyle: "italic",
  margin: "0",
};

export default ContactEmail;
