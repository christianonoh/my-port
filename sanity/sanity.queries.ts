const profileGroq = `
    *[_type == "profile"]{
    _id,
    fullName,
    headline,
    profileImage {alt, "image": asset->url},
    shortBio,
    location,
    fullBio,
    email,
    "resumeURL": resumeURL.asset->url,
    socialLinks,
    skills
  }
`;

const jobsGroq = `
  *[_type == "job"]{
    _id,
    companyName,
    jobTitle,
    startDate,
    endDate,
    description,
    "companyLogo": companyLogo.asset->url,
    skills
  }
`;

const projectsGroq = `*[_type == "project"]{
    _id,
    title,
    tagline,
    "slug": slug.current,
    "logo": logo.asset->url,
    projectUrl,
    "coverImage": coverImage.asset->url,
    description
  }`;

const projectGroq = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    tagline,
    "logo": logo.asset->url,
    projectUrl,
    coverImage { alt, "image": asset->url },
    description
  }`;

export { profileGroq, jobsGroq, projectsGroq, projectGroq }