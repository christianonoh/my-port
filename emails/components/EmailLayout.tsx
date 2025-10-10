import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

export const EmailLayout = ({
  previewText,
  children,
  unsubscribeUrl,
}: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={main}>
        <Container className="email-container" style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://christianonoh.com/logo.png"
              width="70"
              height="70"
              alt="Christian Onoh Logo"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          {children}

          {/* Social Links */}
          <Section style={socialSection}>
            <Text style={socialText}>Stay connected</Text>
            <Section className="social-row" style={socialRow}>
              <Link href="https://christianonoh.com" style={iconLink}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/841/841364.png"
                  width="22"
                  height="22"
                  alt="Website"
                  style={icon}
                />
              </Link>
              <Link href="https://github.com/christianonoh" style={iconLink}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                  width="22"
                  height="22"
                  alt="GitHub"
                  style={icon}
                />
              </Link>
              <Link href="https://linkedin.com/in/christianonoh" style={iconLink}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png"
                  width="22"
                  height="22"
                  alt="LinkedIn"
                  style={icon}
                />
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You’re receiving this because you subscribed to my newsletter.
            </Text>
            {unsubscribeUrl && (
              <Text style={footerText}>
                Don’t want these emails?{" "}
                <Link href={unsubscribeUrl} style={unsubscribeLink}>
                  Unsubscribe
                </Link>
              </Text>
            )}
          </Section>
        </Container>

        {/* ✅ Mobile + Dark Mode Overrides */}
        <style>
          {`
            /* ============ Mobile ============ */
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                padding: 16px !important;
              }

              .social-row {
                display: flex !important;
                justify-content: center !important;
                gap: 20px !important;
              }

              .social-row img {
                width: 26px !important;
                height: 26px !important;
              }

              p, a, span, td, div {
                font-size: 15px !important;
                line-height: 1.6 !important;
              }

              img {
                max-width: 100% !important;
                height: auto !important;
              }
            }

            /* ============ Outlook Fixes ============ */
            @media only screen and (max-width:480px) {
              body, table, td, p, a, li, blockquote {
                -ms-text-size-adjust: 100% !important;
                -webkit-text-size-adjust: 100% !important;
              }
            }

            /* ============ Dark Mode (Gmail, Apple Mail, Outlook) ============ */
            @media (prefers-color-scheme: dark) {
              body, .email-container {
                background-color: #1a1a1a !important;
                color: #e5e5e5 !important;
              }

              a {
                color: #cbb6ff !important;
              }

              .social-row img {
                filter: brightness(0.9) invert(1);
              }

              .footer, .footerText {
                color: #aaaaaa !important;
              }
            }

            /* Force dark mode support for some clients */
            [data-ogsc] body, [data-ogsc] .email-container {
              background-color: #1a1a1a !important;
              color: #e5e5e5 !important;
            }

            [data-ogsc] a {
              color: #cbb6ff !important;
            }
          `}
        </style>
      </Body>
    </Html>
  );
};

/* ---------------- Styles ---------------- */

const accent = "#b8a2f2"; // pastel purple

const main = {
  backgroundColor: "#ffffff",
  color: "#333333",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "28px 28px 48px",
  maxWidth: "600px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 0 6px rgba(184,162,242,0.2)",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "25px",
};

const logo = {
  display: "block",
  margin: "0 auto",
};

const socialSection = {
  textAlign: "center" as const,
  marginTop: "36px",
  marginBottom: "20px",
};

const socialText = {
  color: "#777",
  fontSize: "14px",
  marginBottom: "12px",
};

const socialRow = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
};

const iconLink = {
  display: "inline-block",
};

const icon = {
  display: "block",
};

const footer = {
  borderTop: `1px solid ${accent}20`,
  paddingTop: "18px",
  marginTop: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "4px 0",
};

const unsubscribeLink = {
  color: accent,
  textDecoration: "underline",
};

export default EmailLayout;
