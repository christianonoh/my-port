import { defineField, defineType } from "sanity";

const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  icon: () => "📧",
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .email()
          .custom(async (email, context) => {
            if (!email) return true;
            
            const { document, getClient } = context;
            const client = getClient({ apiVersion: '2023-05-03' });
            
            const existingDocs = await client.fetch(
              `*[_type == "subscriber" && email == $email && _id != $id]`,
              { email, id: document?._id }
            );
            
            return existingDocs.length === 0 || 'Email address already exists';
          }),
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName", 
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Subscription Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
          { title: "Pending", value: "pending" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Unsubscribed Date",
      type: "datetime",
    }),
    defineField({
      name: "source",
      title: "Subscription Source",
      type: "string",
      description: "Where did they subscribe from?",
      options: {
        list: [
          { title: "Homepage", value: "homepage" },
          { title: "Blog", value: "blog" },
          { title: "Contact Page", value: "contact" },
          { title: "Project Page", value: "project" },
          { title: "About Page", value: "about" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "status",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `Status: ${subtitle}`,
        media: () => "📧",
      };
    },
  },
  orderings: [
    {
      title: "Subscribed Date (newest first)",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Email A-Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
});

export default subscriber;