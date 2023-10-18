import { groq } from 'next-sanity';
import { Profile } from '@/types/profile';
import sanityClient from "./sanity.client";

const getProfile = async (): Promise<Profile[]> => {
  return sanityClient.fetch(
    groq`*[_type == "profile"]{
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
  `);
}
export default getProfile;
