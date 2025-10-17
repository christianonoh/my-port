'use server'

import { Resend } from 'resend'
import { redirect } from 'next/navigation'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { render } from '@react-email/components'
import ContactEmail from '@/emails/ContactEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactFormState = {
  success: boolean
  message: string
  errors?: {
    fullName?: string[]
    email?: string[]
    phone?: string[]
    message?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = formData.get('message') as string
  const subscribe = formData.get('subscribe') === 'on'
  const turnstileToken = formData.get('turnstileToken') as string

  // Verify Turnstile token
  const isValidToken = await verifyTurnstileToken(turnstileToken)
  if (!isValidToken) {
    return {
      success: false,
      message: 'Verification failed. Please try again.'
    }
  }

  // Validation
  const errors: ContactFormState['errors'] = {}
  
  if (!fullName) {
    errors.fullName = ['Full name is required']
  }
  
  if (!message) {
    errors.message = ['Message is required']
  }
  
  if (!email && !phone) {
    errors.email = ['Either email or phone number is required']
    errors.phone = ['Either email or phone number is required']
  }
  
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors
    }
  }

  try {
    // Render the email template
    const emailHtml = await render(
      ContactEmail({
        fullName,
        email: email || undefined,
        phone: phone || undefined,
        message,
      })
    )

    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'info@christianonoh.com'],
      subject: `New Contact Form Submission from ${fullName}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        success: false,
        message: 'Failed to send message. Please try again later.'
      }
    }

    // Handle newsletter subscription if checked and email is provided
    if (subscribe && email) {
      try {
        const subscribeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            firstName: fullName.split(' ')[0] || null, // Use first part of full name
            lastName: null,
            source: 'contact_form',
          }),
        })

        if (subscribeResponse.ok) {
          return {
            success: true,
            message: 'Message sent successfully! You\'ve also been subscribed to the newsletter. Check your email for a welcome message.'
          }
        }
      } catch (subscriptionError) {
        console.error('Newsletter subscription error:', subscriptionError)
        // Don't fail the contact form if subscription fails
      }
    }

    return {
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    }
  }
}