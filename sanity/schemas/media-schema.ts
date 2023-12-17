import { BiImage } from "react-icons/bi";
import { defineField } from "sanity";

const media = {
  name: "media",
  type: "document",
  title: "Media",
  icon: BiImage,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "A descriptive title for the media file",
    },
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Add a custom slug for the URL or generate one from the name",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "A short description of the media file",
    },
    {
      name: "file",
      type: "file",
      title: "File",
      description: "Upload the media file",
      options: {
        accept: "image/*,video/*",
      },
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "file.asset",
    },
  },
};

export default media;
