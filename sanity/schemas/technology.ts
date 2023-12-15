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
    defineField({
      name: "description",
      title: "Description",
      type: "text",
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
