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
} | order(startDate asc)
`;

const projectsGroq = `*[_type == "project"]{
    _id,
    title,
    tagline,
    "slug": slug.current,
    "logo": logo.asset->url,
    projectUrl,
    "coverImage": coverImage.asset->url,
    description,
    "technologies": technologies[]->,
  }`;

const projectGroq = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    tagline,
    "logo": logo.asset->url,
    projectUrl,
    coverImage { alt, "image": asset-> },
    technologies[]->,
    description
  }`;

const technologiesGroq = `
*[_type == "technology"]{
  _id,
  title,
  "slug": slug.current,
  description,
  "logo":logo.asset->
}`;

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
} | order(startDate asc)
`;

export {
  profileGroq,
  worksGroq,
  projectsGroq,
  projectGroq,
  technologiesGroq,
  educationGroq,
  skillsGroq,
};
