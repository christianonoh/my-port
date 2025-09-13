"use client";

import { useState, useEffect } from "react";
import NewsletterSignup from "./NewsletterSignup";

const NewsletterBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissedAt = localStorage.getItem('newsletter-banner-dismissed');
    const subscribedAt = localStorage.getItem('newsletter-subscribed');
    
    // Don't show if dismissed within last 7 days or already subscribed
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const isDismissed = dismissedAt && parseInt(dismissedAt) > sevenDaysAgo;
    const isSubscribed = subscribedAt;
    
    setIsLoaded(true);
    
    // Show banner after 3 seconds delay if not dismissed/subscribed
    if (!isDismissed && !isSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Store dismissal timestamp
    localStorage.setItem('newsletter-banner-dismissed', Date.now().toString());
  };

  const handleSubscribeSuccess = () => {
    setShowSuccess(true);
    // Store subscription timestamp
    localStorage.setItem('newsletter-subscribed', Date.now().toString());
    
    // Hide banner after showing success for 2 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 animate-slide-up md:max-w-sm max-w-[calc(100vw-8rem)] sm:max-w-xs">
      {showSuccess ? (
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-xl backdrop-blur-sm border border-green-700/20 transform transition-all duration-300">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-sm">🎉 Success!</h4>
              <p className="text-xs text-white/90">You&apos;re subscribed! Check your email.</p>
            </div>
          </div>
        </div>
      ) : !showForm ? (
        <div className="bg-accent text-white p-3 md:p-4 rounded-lg shadow-xl backdrop-blur-sm border border-accent-dark/20 transform transition-all duration-300 hover:scale-105">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close newsletter banner"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="pr-6">
            <h4 className="font-semibold mb-2 text-sm md:text-base">📬 Stay Updated</h4>
            <p className="text-xs md:text-sm text-white/90 mb-3">
              Get notified about new projects & posts!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-accent px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-white/90 transition-colors w-full"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute -top-2 -right-2 z-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-full p-1.5 shadow-md transition-colors"
            aria-label="Close newsletter form"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <NewsletterSignup 
            source="banner"
            title="📬 Newsletter"
            description="Stay updated with my latest work!"
            className="w-80"
            onSubscribeSuccess={handleSubscribeSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default NewsletterBanner;