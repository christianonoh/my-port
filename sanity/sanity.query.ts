import { groq } from 'next-sanity';
import sanityClient from "./sanity.client";


const getProfile = async () => {
  return sanityClient.fetch(
    groq`*[_type == "profile"][0]{
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
    }
  `);
}
export default getProfile;