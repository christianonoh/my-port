import { BiBriefcase } from "react-icons/bi";
import { defineField } from "sanity";

const work = {
  name: "work",
  title: "Work",
  type: "document",
  icon: BiBriefcase,
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      description: "What is the name of the company?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description: "Enter the job title. E.g: Software Developer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Write a brief description about this role",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "reference", to: { type: "technology" } }],
    }),
    {
      name: "endDate",
      title: "End Date",
      type: "date",
    },
    {
      name: "location",
      title: "Location",
      type: "string",
    },
    {
      name: "companyUrl",
      title: "Company Website",
      type: "url",
    },
  ],
};

export default work;
