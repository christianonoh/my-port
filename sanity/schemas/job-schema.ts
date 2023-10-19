import { BiBriefcase } from "react-icons/bi";
import { defineField } from "sanity";

const job = {
  name: 'job',
  title: 'Job',
  type: 'document',
  icon: BiBriefcase,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'What is the name of the company?',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'Enter the job title. E.g: Software Developer',
      validation: (rule) => rule.required(),
    }),
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      row: 3,
      description: "Write a brief description about this role",
    },
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    },
    {
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
    },
    {
      name: "url",
      title: "Company Website",
      type: "url",
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}

export default job;