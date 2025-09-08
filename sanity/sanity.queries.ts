const profileGroq = `
    *[_type == "profile"]{
    _id,
    fullName,
    headline,
    profileImage {alt, "image": asset-> },
    shortBio,
    location,
    fullBio,
    email,
    "resumeURL": resumeURL.asset->url,
    socialLinks,
    skills
  }
`;

const worksGroq = `
*[_type == "work"]{
  _id,
  companyName,
  position,
  startDate,
  endDate,
  description,
  location,
  "companyLogo": companyLogo.asset->url,
  skills,
} | order(startDate desc)
`;

const projectsGroq = `*[_type == "project"]{
    _id,
    title,
    tagline,
    "slug": slug.current,
    "logo": logo.asset->url,
    "stack": stack[]{
      "key": key->title,
      "value": value
    },
  } | order(title asc)`;

const projectGroq = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    tagline,
    title,
    "logo": logo.asset->url,
    projectUrl,
    coverImage { alt, "image": asset-> },
    "stack": stack[]{
      "key": key->title,
      "value": value
    },
    summary,
    githubUrl,
    features,
    milestone,
    problemStatement
  }`;

const technologiesGroq = `
*[_type == "technology" && proficient == true]{
  _id,
  title,
  "slug": slug.current,
  description,
  "logo":logo.asset->
} | order(title asc)`;

const skillsGroq = `
*[_type == "skill"]{
  _id,
  title,
  "slug": slug.current,
  description
}`;

const educationGroq = `
*[_type == "education"]{
  _id,
  discipline,
  schoolName,
  schoolUrl,
  description,
  location,
  startDate,
  endDate,
  "schoolLogo": schoolLogo.asset->url,
  skills,
} | order(startDate desc)
`;

const mediaGroq = `
*[_type == "media" && slug.current == $slug][0]{
  ...,
}`;

const blogPostsGroq = `
*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImage": coverImage{alt, "image": asset->},
  category,
  tags,
  publishedAt,
  featured,
  readingTime
}`;

const featuredBlogPostsGroq = `
*[_type == "blogPost" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImage": coverImage{alt, "image": asset->},
  category,
  tags,
  publishedAt,
  readingTime
}`;

const blogPostGroq = `
*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImage": coverImage{alt, "image": asset->},
  content,
  category,
  tags,
  publishedAt,
  featured,
  readingTime
}`;

const blogCategoriesGroq = `
*[_type == "blogPost"] {
  category
} | order(category asc)`;

export {
  profileGroq,
  worksGroq,
  projectsGroq,
  projectGroq,
  technologiesGroq,
  educationGroq,
  skillsGroq,
  mediaGroq,
  blogPostsGroq,
  featuredBlogPostsGroq,
  blogPostGroq,
  blogCategoriesGroq,
};
