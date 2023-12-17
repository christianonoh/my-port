import { BiBriefcase } from "react-icons/bi";
import { defineField } from "sanity";

const education = {
  name: "education",
  title: "Education",
  type: "document",
  icon: BiBriefcase,
  fields: [
    defineField({
      name: "schoolName",
      title: "School Name",
      type: "string",
      description: "What is the name of the school?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      type: "string",
      description:
        "Enter the field of study or academic discipline relevant to your education",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Write a brief description about this discipline",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "schoolLogo",
      title: "School Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      description: "List both technologies and soft skills you learned here.",
      of: [
        { type: "reference", to: [{ type: "technology" }, { type: "skill" }] },
      ],
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
      name: "schoolUrl",
      title: "School Website",
      type: "url",
    },
  ],
};

export default education;
