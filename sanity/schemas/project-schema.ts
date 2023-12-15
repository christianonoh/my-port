import { BiPackage } from "react-icons/bi";
import { defineField } from "sanity";

const project = {
  name: "project",
  title: "Project",
  type: "document",
  icon: BiPackage,
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      description: "Enter the name of the project",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.max(60).required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Add a custom slug for the URL or generate one from the name",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "reference", to: { type: "technology" } }],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Upload a cover image for this project",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      description: "Write a full description about this project",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),

    {
      name: "projectUrl",
      title: "Project URL",
      type: "url",
    },
    {
      name: "githubUrl",
      title: "Github URL",
      type: "url",
    },
  ],
};

export default project;
