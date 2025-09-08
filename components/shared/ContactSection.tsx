import ContactForm from "./ContactForm";

const ContactSection = () => {
  return (
    <section className="py-16 bg-light dark:bg-dark border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto md:px-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-light mb-4">
            Let's Work Together
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </div>
        <div className="flex justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;