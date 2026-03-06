import {
  getProfile,
  getFeaturedProjects,
  getProjectCount,
  getBlogPostCount,
  getBlogPosts,
  getTestimonials,
  getFaqs,
} from "@/sanity/sanity.fetch";
import Transition from "@/components/shared/Transition";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import CredibilityMetrics from "@/components/home/CredibilityMetrics";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import AboutSnippet from "@/components/home/AboutSnippet";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import BlogPreview from "@/components/home/BlogPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default async function Home() {
  const [
    profile,
    featuredProjects,
    projectCount,
    blogCount,
    blogPosts,
    testimonials,
    faqs,
  ] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getProjectCount(),
    getBlogPostCount(),
    getBlogPosts(),
    getTestimonials(),
    getFaqs(),
  ]);

  const profileData = profile?.[0];

  return (
    <Transition>
      <main>
        {profileData && <HeroSection profile={profileData} />}
        <ServicesSection />
        <CredibilityMetrics
          projectCount={projectCount || 0}
          blogCount={blogCount || 0}
        />
        {featuredProjects && featuredProjects.length > 0 && (
          <FeaturedProjects projects={featuredProjects} />
        )}
        {profileData && <AboutSnippet profile={profileData} />}
        {testimonials && testimonials.length > 0 && (
          <TestimonialsSection testimonials={testimonials} />
        )}
        {blogPosts && blogPosts.length > 0 && (
          <BlogPreview posts={blogPosts} />
        )}
        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}
        <ContactCTA />
      </main>
    </Transition>
  );
}
