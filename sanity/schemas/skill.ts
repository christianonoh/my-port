import { defineField, defineType } from "sanity";
import { GiSkills } from "react-icons/gi";

export default defineType({
  name: "skill",
  title: "Skill",
  icon: GiSkills,
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
  ],
});
