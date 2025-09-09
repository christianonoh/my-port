"use client";

import { useState, useEffect } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email && !formData.phone) {
      setError("Please provide either an email or phone number");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ fullName: "", email: "", phone: "", message: "" });
        setTimeout(() => setSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    if (error && (e.target.name === "email" || e.target.name === "phone")) {
      setError("");
    }
  };

  return (
    <div className={`max-w-md mx-auto w-full transition-all duration-700 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <h3 className="text-lg font-semibold mb-4 text-dark dark:text-light">Get in Touch</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-transparent border border-zinc-600 rounded-md text-dark dark:text-light placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 disabled:opacity-50 hover:border-accent/50"
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-transparent border border-zinc-600 rounded-md text-dark dark:text-light placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 disabled:opacity-50 hover:border-accent/50"
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-transparent border border-zinc-600 rounded-md text-dark dark:text-light placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 disabled:opacity-50 hover:border-accent/50"
          />
        </div>
        
        {/* Enhanced Notifications */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm animate-pulse shadow-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm shadow-sm animate-bounce">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Message sent successfully! I&apos;ll get back to you soon.
            </div>
          </div>
        )}
        
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <textarea
            name="message"
            placeholder="Your message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 bg-transparent border border-zinc-600 rounded-md text-dark dark:text-light placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none disabled:opacity-50 hover:border-accent/50"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white rounded-md font-medium relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            isSubmitting ? 'animate-pulse' : 'hover:shadow-accent/25'
          }`}
        >
          <span className={`transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            Send Message
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;