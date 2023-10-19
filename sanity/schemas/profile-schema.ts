import { BiUser } from 'react-icons/bi'
import { defineField } from 'sanity'

const profile = {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  icon: BiUser,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "In one short sentence, what do you do?",
      validation: (rule) => rule.required().min(40).max(50),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      description: 'Upload a profile image',
      options: { hotspot: true, },
      fields: [
        {
          name: 'alt',
          title: 'Alt',
          type: 'string',
        },
      ],
    }),
    {
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
    },
    {
      name: 'email',
      title: 'Email address',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'fullBio',
      title: 'Full Bio',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'resumeURL',
      title: 'Updload Resume',
      type: 'file',
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          initialValue: 'https://www.linkedin.com/in/',
        },
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
          initialValue: 'https://twitter.com/',
        },
        {
          name: 'github',
          title: 'Github',
          type: 'url',
          initialValue: 'https://github.com/',
        },
      ],
      options: {
        collapsed: false,
        collapsible: true,
        columns: 2,
      },
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}

export default profile;