"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  submitSubscribeForm,
  type SubscribeFormState,
} from "@/lib/actions/subscribe";
import { Turnstile } from "@marsidev/react-turnstile";

interface NewsletterSignupProps {
  source?: string;
  title?: string;
  description?: string;
  className?: string;
  onSubscribeSuccess?: () => void;
}

const NewsletterSignup = ({
  source = "newsletter",
  title = "Subscribe to my newsletter",
  description = "Get the latest updates on my projects, blog posts, and tech insights delivered to your inbox.",
  className = "",
  onSubscribeSuccess,
}: NewsletterSignupProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const initialState: SubscribeFormState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    submitSubscribeForm,
    initialState
  );

  // Reset form on successful submission
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setTurnstileToken(""); // Reset turnstile token
      onSubscribeSuccess?.();
    }
  }, [state.success, onSubscribeSuccess]);

  return (
    <section className="w-full p-6 md:p-8 bg-gradient-to-r from-accent/10 to-accent-dark/10 dark:from-accent/15 dark:to-accent-dark/15 rounded-xl border border-accent/20 dark:border-accent/30 backdrop-blur-sm shadow-lg dark:shadow-gray-900/20">
      <div className={`max-w-md mx-auto w-full ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2 text-dark dark:text-light">
            <i className='fa-bell'></i>&nbsp;
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="turnstileToken" value={turnstileToken} />

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <input
              type="text"
              name="firstName"
              placeholder="Your name (optional)"
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-white/70 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 disabled:opacity-50 hover:border-accent/50 backdrop-blur-sm"
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              disabled={isPending}
              className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-700/50 border rounded-lg text-dark dark:text-light placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 disabled:opacity-50 hover:border-accent/50 backdrop-blur-sm ${
                state.errors?.email
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {state.errors?.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Status Messages */}
          {!state.success && state.message && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm shadow-sm backdrop-blur-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {state.message}
              </div>
            </div>
          )}

          {state.success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm shadow-sm backdrop-blur-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {state.message}
              </div>
            </div>
          )}

          {/* Turnstile Widget */}
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !turnstileToken}
            className={`w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-xl ${
              isPending
                ? "animate-pulse"
                : "hover:shadow-accent/30 dark:hover:shadow-accent/20"
            }`}
          >
            <span
              className={`transition-all duration-300 ${isPending ? "opacity-0" : "opacity-100"}`}
            >
              Subscribe
            </span>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </div>
              </div>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            No spam, unsubscribe at any time. I respect your privacy.
          </p>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
