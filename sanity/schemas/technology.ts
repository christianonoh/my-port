import { defineField, defineType } from "sanity";
import { VscTools } from "react-icons/vsc";

export default defineType({
  name: "technology",
  title: "Technology",
  icon: VscTools,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 30,
      },
    }),
    {
      name: "proficient",
      title: "Are you proficient with this technology?",
      type: "boolean",
      description: "Toggle to enable or disable the technology on your site.",
      initialValue: true,
    },
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) =>
        Rule.max(200).warning("Shorter descriptions are encouraged."),
    }),
    defineField({
      name: "logo",
      title: "Technology Logo",
      type: "image",
      description: "Upload a logo for this technology",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
    }),
  ],
});
