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
import FeaturedProjects from "@/components/home/FeaturedProjects";
import AboutSnippet from "@/components/home/AboutSnippet";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import BlogPreview from "@/components/home/BlogPreview";
import ContactCTA from "@/components/home/ContactCTA";
import FloatingImageLayout from "@/components/home/FloatingImageLayout";

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
        {profileData && (
          <FloatingImageLayout profile={profileData}>
            <HeroSection profile={profileData} />
            <ServicesSection />
            <AboutSnippet
              profile={profileData}
              projectCount={projectCount || 0}
              blogCount={blogCount || 0}
            />
          </FloatingImageLayout>
        )}

        {featuredProjects && featuredProjects.length > 0 && (
          <FeaturedProjects projects={featuredProjects} />
        )}

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
