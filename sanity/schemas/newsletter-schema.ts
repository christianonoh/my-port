import { defineField, defineType } from "sanity";

const newsletter = defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  icon: () => "📬",
  fields: [
    defineField({
      name: "subject",
      title: "Email Subject",
      type: "string",
      validation: (rule) => rule.required().max(150),
      description: "The subject line for your newsletter email",
    }),
    defineField({
      name: "preheader",
      title: "Preheader Text",
      type: "string",
      validation: (rule) => rule.max(100),
      description: "Preview text shown in email clients (optional)",
    }),
    defineField({
      name: "content",
      title: "Newsletter Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audienceType",
      title: "Send To",
      type: "string",
      options: {
        list: [
          { title: "All Active Subscribers", value: "all" },
          { title: "Filter by Tags", value: "tags" },
          { title: "Filter by Interests", value: "interests" },
          { title: "Test (Send to yourself only)", value: "test" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      description: "Choose who will receive this newsletter",
    }),
    defineField({
      name: "testEmail",
      title: "Test Email Address",
      type: "string",
      description: "Email address to send test newsletter to",
      validation: (rule) => rule.email(),
      hidden: ({ document }) => document?.audienceType !== "test",
    }),
    defineField({
      name: "filterTags",
      title: "Filter by Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Only send to subscribers with these tags",
      options: {
        layout: "tags",
      },
      hidden: ({ document }) => document?.audienceType !== "tags",
    }),
    defineField({
      name: "filterInterests",
      title: "Filter by Interests",
      type: "array",
      of: [{ type: "string" }],
      description: "Only send to subscribers with these interests",
      options: {
        list: [
          { title: "Web Development", value: "web-dev" },
          { title: "Mobile Development", value: "mobile-dev" },
          { title: "Design", value: "design" },
          { title: "Projects", value: "projects" },
          { title: "Blog Posts", value: "blog" },
          { title: "Tutorials", value: "tutorials" },
        ],
      },
      hidden: ({ document }) => document?.audienceType !== "interests",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Sent", value: "sent" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scheduledFor",
      title: "Scheduled Send Time",
      type: "datetime",
      description: "When to send this newsletter (optional)",
      hidden: ({ document }) => document?.status !== "scheduled",
    }),
    defineField({
      name: "sentAt",
      title: "Sent At",
      type: "datetime",
      description: "When this newsletter was sent",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "sent",
    }),
    defineField({
      name: "recipientCount",
      title: "Recipient Count",
      type: "number",
      description: "Number of subscribers who received this newsletter",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "sent",
    }),
    defineField({
      name: "successCount",
      title: "Successfully Sent",
      type: "number",
      description: "Number of emails successfully delivered",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "sent",
    }),
    defineField({
      name: "failureCount",
      title: "Failed Sends",
      type: "number",
      description: "Number of emails that failed to send",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "sent",
    }),
    defineField({
      name: "errors",
      title: "Send Errors",
      type: "array",
      of: [{ type: "text" }],
      description: "Any errors encountered during sending",
      readOnly: true,
      hidden: ({ document }) => !document?.errors || (Array.isArray(document.errors) && document.errors.length === 0),
    }),
  ],
  preview: {
    select: {
      title: "subject",
      status: "status",
      sentAt: "sentAt",
      recipientCount: "recipientCount",
    },
    prepare({ title, status, sentAt, recipientCount }) {
      const statusEmojis: Record<string, string> = {
        draft: "📝",
        scheduled: "⏰",
        sent: "✅",
      };
      const statusEmoji = statusEmojis[status as string] || "📬";

      return {
        title,
        subtitle: status === "sent"
          ? `Sent to ${recipientCount || 0} subscribers on ${new Date(sentAt).toLocaleDateString()}`
          : `Status: ${status}`,
        media: () => statusEmoji,
      };
    },
  },
  orderings: [
    {
      title: "Sent Date (newest first)",
      name: "sentAtDesc",
      by: [{ field: "sentAt", direction: "desc" }],
    },
    {
      title: "Created Date (newest first)",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});

export default newsletter;
