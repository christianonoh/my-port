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
      name: "summary",
      title: "Summary",
      type: "array",
      description: "Write a summary of the project",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
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
      name: "stack",
      title: "Technology Stack",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "key",
              title: "Key",
              description: "What technology was used?",
              type: "reference",
              to: [{ type: "technology" }],
            },
            {
              name: "value",
              title: "Value",
              type: "string",
              description: "What was it was used for?",
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
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
      name: "features",
      title: "Feautures",
      type: "array",
      description: "Write a full description about this project",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "problemStatement",
      title: "Problem Statement",
      type: "array",
      description: "Define the challenges addressed by this project.",
      of: [{ type: "block" }],
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
      initialValue: "https://github.com/",
    },
    defineField({
      name: "milestone",
      title: "Milestone",
      type: "array",
      description: "What notable achievements has this project accomplished?",
      of: [{ type: "block" }],
    }),
  ],
};

export default project;
