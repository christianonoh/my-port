---
title: "How to Add Cloudflare Turnstile to Your Next.js App: A Complete Guide"
description: "A comprehensive, step-by-step guide to implementing Cloudflare Turnstile bot protection in your Next.js application with App Router and Server Actions."
publishedAt: "2025-01-17"
updatedAt: "2025-01-17"
tags: ["Next.js", "Security", "Web Development", "Cloudflare", "Tutorial"]
image: "/blog/turnstile-guide-banner.jpg"
isPublished: true
author: "Christian Onoh"
---

Bot traffic is a reality every website faces. Whether you're running a small portfolio site or a large application, protecting your forms from automated submissions is crucial. In this guide, I'll show you how to implement Cloudflare Turnstile—a privacy-first, user-friendly alternative to Google reCAPTCHA—in your Next.js application.

## Table of Contents

1. [Why Cloudflare Turnstile?](#why-cloudflare-turnstile)
2. [Prerequisites](#prerequisites)
3. [Getting Your Turnstile Keys](#getting-your-turnstile-keys)
4. [Installation](#installation)
5. [Implementation](#implementation)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Why Cloudflare Turnstile?

Before diving into the implementation, let's understand why Turnstile stands out from other CAPTCHA solutions, particularly Google reCAPTCHA.

### 1. **Privacy-First Design**

Turnstile doesn't track users across websites or collect data for advertising purposes. Unlike reCAPTCHA, which can use visitor data to train Google's AI models and potentially feed into their advertising ecosystem, Turnstile is GDPR-compliant out of the box and doesn't require cookie consent banners in most cases.

**What this means for you**: Your users' privacy is protected, and you avoid potential GDPR compliance headaches.

### 2. **Superior User Experience**

Turnstile uses adaptive challenges that are often completely invisible to legitimate users. No more "click all the traffic lights" or "select all images with crosswalks" that frustrate real humans while bots evolve to solve them anyway.

**The numbers**: Turnstile adds less than 100ms of overhead, compared to reCAPTCHA's 200-500ms load time.

### 3. **Generous Free Tier**

Cloudflare offers **1 million requests per month for free**, compared to Google's 10,000 assessments per month. For most small to medium-sized applications, you'll never hit this limit.

### 4. **No Vendor Lock-in**

Turnstile doesn't harvest your user data to feed a larger advertising ecosystem. It's a focused security tool that does one job well, without hidden agendas.

### 5. **Lightweight Integration**

The Turnstile widget is lightweight and doesn't slow down your page load times. It integrates seamlessly with modern frameworks like Next.js, React, and Vue.

### Quick Comparison Table

| Feature | Cloudflare Turnstile | Google reCAPTCHA |
|---------|---------------------|------------------|
| **Privacy** | No cross-site tracking | Tracks users for ads |
| **User Friction** | Mostly invisible | Often requires puzzles |
| **Free Tier** | 1M requests/month | 10K assessments/month |
| **Load Time** | <100ms | 200-500ms |
| **GDPR Compliance** | Built-in | Requires additional setup |
| **Data Collection** | Minimal | Extensive |

## Prerequisites

Before we begin, make sure you have:

- ✅ **Next.js 13+** with App Router (this guide uses App Router and Server Actions)
- ✅ **Node.js 18+** installed
- ✅ **Basic understanding** of React hooks and Next.js Server Actions
- ✅ **A Cloudflare account** (free tier is fine)
- ✅ **Forms in your application** that need bot protection

If you're using Pages Router instead of App Router, the concepts are similar, but you'll need to adapt the Server Actions to API routes.

## Getting Your Turnstile Keys

### Step 1: Create a Cloudflare Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up for a free account
2. Verify your email address

### Step 2: Access Turnstile

1. Once logged in, look for **"Turnstile"** in the left sidebar
2. Click on **"Add site"** or **"Create"**

### Step 3: Configure Your Site

You'll need to provide:

- **Site name**: A descriptive name (e.g., "My Portfolio Site")
- **Domain**: Your website domain (use `localhost` for development, or add multiple domains)
- **Widget mode**:
  - **Managed** (recommended): Automatically adapts challenge difficulty
  - **Non-interactive**: Invisible challenge
  - **Invisible**: Runs in the background

For most use cases, choose **Managed** mode—it provides the best balance between security and user experience.

### Step 4: Get Your Keys

After creating the site, you'll receive two keys:

- **Site Key** (public): Used in your frontend code
- **Secret Key** (private): Used for server-side verification

⚠️ **Important**: Never expose your Secret Key in client-side code or commit it to public repositories!

## Installation

### Step 1: Install the Package

We'll use the `@marsidev/react-turnstile` package, which provides a clean React wrapper for Cloudflare Turnstile:

```bash
npm install @marsidev/react-turnstile
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root (if you don't have one already):

```bash
# .env.local

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here
```

**Note the naming**:
- `NEXT_PUBLIC_` prefix makes the variable available to the browser (needed for the widget)
- `TURNSTILE_SECRET_KEY` without the prefix keeps it server-side only

Don't forget to add `.env.local` to your `.gitignore`:

```bash
# .gitignore
.env.local
.env*.local
```

And update your `.env.example` for other developers:

```bash
# .env.example

# Cloudflare Turnstile (for bot protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

## Implementation

Now for the fun part! We'll implement Turnstile in three steps:

1. Create a server-side verification helper
2. Add the Turnstile widget to your form
3. Verify tokens in your Server Action

### Step 1: Create the Verification Helper

First, let's create a reusable server-side function to verify Turnstile tokens:

```typescript
// lib/turnstile.ts
'use server'

interface TurnstileResponse {
  success: boolean
  'error-codes': string[]
  challenge_ts?: string
  hostname?: string
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  if (!token) {
    console.error('No Turnstile token provided')
    return false
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const data: TurnstileResponse = await response.json()

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes'])
      return false
    }

    return true
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}
```

**What's happening here**:
- We're making a POST request to Cloudflare's verification endpoint
- Sending our secret key and the token from the user
- Cloudflare returns whether the token is valid
- We handle errors gracefully and log them for debugging

### Step 2: Add Turnstile to Your Form Component

Let's add the Turnstile widget to a contact form. Here's a complete example:

```typescript
// components/ContactForm.tsx
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import { Turnstile } from "@marsidev/react-turnstile";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const initialState: ContactFormState = {
    success: false,
    message: ""
  };

  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  // Reset form and Turnstile on successful submission
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setTurnstileToken(""); // Reset token to trigger new challenge
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Hidden input to pass token to Server Action */}
      <input type="hidden" name="turnstileToken" value={turnstileToken} />

      {/* Your form fields */}
      <div>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          disabled={isPending}
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={isPending}
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your message"
          rows={4}
          required
          disabled={isPending}
          className="w-full px-4 py-3 border rounded-lg"
        />
      </div>

      {/* Turnstile Widget */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken("")}
          onExpire={() => setTurnstileToken("")}
        />
      </div>

      {/* Error/Success Messages */}
      {state.message && (
        <div className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </div>
      )}

      {/* Submit Button - Disabled until Turnstile is complete */}
      <button
        type="submit"
        disabled={isPending || !turnstileToken}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
```

**Key points**:
- The `turnstileToken` state holds the verification token
- The submit button is disabled until Turnstile provides a valid token
- We pass the token via a hidden input field
- On success, we reset the token to trigger a new challenge for the next submission

### Step 3: Verify Token in Server Action

Now let's create the Server Action that handles form submission and verifies the Turnstile token:

```typescript
// lib/actions/contact.ts
'use server'

import { verifyTurnstileToken } from '@/lib/turnstile'

export type ContactFormState = {
  success: boolean
  message: string
  errors?: {
    fullName?: string[]
    email?: string[]
    message?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string
  const turnstileToken = formData.get('turnstileToken') as string

  // 🔒 STEP 1: Verify Turnstile token
  const isValidToken = await verifyTurnstileToken(turnstileToken)
  if (!isValidToken) {
    return {
      success: false,
      message: 'Verification failed. Please try again.'
    }
  }

  // STEP 2: Validate form data
  const errors: ContactFormState['errors'] = {}

  if (!fullName) {
    errors.fullName = ['Full name is required']
  }

  if (!email) {
    errors.email = ['Email is required']
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (!message) {
    errors.message = ['Message is required']
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors
    }
  }

  // STEP 3: Process the form (send email, save to database, etc.)
  try {
    // Your business logic here
    // For example: await sendEmail({ fullName, email, message })

    return {
      success: true,
      message: 'Message sent successfully!'
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    }
  }
}
```

**Security flow**:
1. ✅ Extract the Turnstile token from form data
2. ✅ Verify token with Cloudflare **before** processing the form
3. ✅ Only proceed with business logic if verification passes
4. ✅ Return appropriate error messages

## Testing

### Development Testing

During development, Cloudflare provides test keys that always pass or always fail:

**Always passes**:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

**Always fails**:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=2x00000000000000000000AB
TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA
```

**Always shows interactive challenge**:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=3x00000000000000000000FF
TURNSTILE_SECRET_KEY=3x0000000000000000000000000000000FF
```

### Testing Checklist

- ✅ **Submit without solving challenge**: Button should be disabled
- ✅ **Submit with valid token**: Form should submit successfully
- ✅ **Submit with expired token**: Should show error message
- ✅ **Network error handling**: Test with network throttling
- ✅ **Multiple submissions**: Token should reset after each submission
- ✅ **Mobile responsiveness**: Test on different screen sizes

### Production Testing

Before going live:

1. **Test with your production keys** on a staging environment
2. **Monitor your Cloudflare dashboard** for verification metrics
3. **Check server logs** for any verification errors
4. **Test from different locations** (VPNs can help simulate bot behavior)

## Troubleshooting

### Common Issues and Solutions

#### 1. Widget Not Rendering

**Symptoms**: Turnstile widget doesn't appear on the page

**Solutions**:
- ✅ Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set correctly
- ✅ Check browser console for JavaScript errors
- ✅ Ensure the Turnstile component is inside a client component (`"use client"`)
- ✅ Verify your domain is whitelisted in Cloudflare dashboard

#### 2. Token Verification Always Fails

**Symptoms**: Server-side verification returns `success: false`

**Solutions**:
- ✅ Double-check `TURNSTILE_SECRET_KEY` is correct (no extra spaces)
- ✅ Ensure you're using the **secret key**, not the site key
- ✅ Check that your server can reach `challenges.cloudflare.com`
- ✅ Verify the token isn't expired (tokens expire after 5 minutes)

#### 3. Button Stays Disabled

**Symptoms**: Submit button remains disabled even after completing challenge

**Solutions**:
- ✅ Check `onSuccess` callback is correctly updating state
- ✅ Verify `turnstileToken` state is being set
- ✅ Console.log the token to ensure it's a valid string
- ✅ Check for any React state update issues

#### 4. CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solutions**:
- ✅ Ensure your domain is added to Cloudflare Turnstile settings
- ✅ For localhost testing, add `localhost` as an allowed domain
- ✅ Check if you have any aggressive ad blockers interfering

#### 5. Token Doesn't Reset After Submission

**Symptoms**: User can't submit form again after successful submission

**Solutions**:
```typescript
// Make sure to reset token in useEffect
useEffect(() => {
  if (state.success) {
    setTurnstileToken(""); // This triggers a new challenge
    formRef.current?.reset();
  }
}, [state.success]);
```

### Debug Mode

Enable debug logging in your verification function:

```typescript
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  // Add this at the start for debugging
  console.log('Verifying token:', {
    tokenLength: token?.length,
    hasSecretKey: !!process.env.TURNSTILE_SECRET_KEY,
  })

  // ... rest of function
}
```

## Best Practices

### 1. Environment Variables

Always use environment variables for your keys:

```typescript
// ✅ Good
<Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} />

// ❌ Bad - Never hardcode keys
<Turnstile siteKey="1x00000000000000000000AA" />
```

### 2. Error Handling

Provide clear feedback to users:

```typescript
if (!isValidToken) {
  return {
    success: false,
    message: 'Verification failed. Please refresh the page and try again.'
  }
}
```

### 3. Token Expiration

Tokens expire after 5 minutes. For long forms, consider:

```typescript
// Reset token after 4 minutes to be safe
useEffect(() => {
  if (turnstileToken) {
    const timeout = setTimeout(() => {
      setTurnstileToken("");
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearTimeout(timeout);
  }
}, [turnstileToken]);
```

### 4. Accessibility

Ensure Turnstile doesn't break accessibility:

```typescript
<div className="flex justify-center" role="complementary" aria-label="Security verification">
  <Turnstile
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
    onSuccess={(token) => setTurnstileToken(token)}
  />
</div>
```

### 5. Multiple Forms

Reuse the verification helper across all forms:

```typescript
// ✅ Reusable across contact, newsletter, comments, etc.
import { verifyTurnstileToken } from '@/lib/turnstile'

// Use in any Server Action
const isValid = await verifyTurnstileToken(token)
```

## Performance Considerations

### Bundle Size

The `@marsidev/react-turnstile` package adds approximately **8KB** (gzipped) to your bundle. The Cloudflare Turnstile script itself is loaded asynchronously and doesn't block page rendering.

### Load Time Impact

- **Client-side**: <100ms to load and initialize
- **Server-side verification**: 100-200ms per request
- **Total user-facing impact**: Minimal (challenge is usually invisible)

### Optimization Tips

1. **Lazy load the component** for forms below the fold:

```typescript
import dynamic from 'next/dynamic'

const Turnstile = dynamic(
  () => import('@marsidev/react-turnstile').then(mod => mod.Turnstile),
  { ssr: false }
)
```

2. **Preconnect to Cloudflare**:

```typescript
// In your layout or head
<link rel="preconnect" href="https://challenges.cloudflare.com" />
```

## Conclusion

Implementing Cloudflare Turnstile in your Next.js application is straightforward and provides robust protection against bot traffic without sacrificing user experience or privacy.

**Key takeaways**:
- ✅ Turnstile offers better privacy than alternatives
- ✅ Implementation takes less than an hour
- ✅ Server-side verification is essential for security
- ✅ The user experience is seamless for legitimate users

### Next Steps

1. **Monitor your metrics** in the Cloudflare dashboard
2. **Adjust widget mode** based on your security needs
3. **Add Turnstile to other forms** (newsletter signup, comments, etc.)
4. **Set up alerts** for unusual verification failure rates

### Additional Resources

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Turnstile GitHub](https://github.com/marsidev/react-turnstile)

---

Found this guide helpful? Subscribe to my newsletter for more tutorials on building secure, privacy-focused web applications.

Have questions or run into issues? Drop a comment below or reach out via my contact page!
