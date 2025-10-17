'use server'

import { redirect } from 'next/navigation'
import { verifyTurnstileToken } from '@/lib/turnstile'

export type SubscribeFormState = {
  success: boolean
  message: string
  errors?: {
    email?: string[]
    firstName?: string[]
    lastName?: string[]
  }
}

export async function submitSubscribeForm(
  prevState: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const source = formData.get('source') as string
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
  const errors: SubscribeFormState['errors'] = {}
  
  if (!email) {
    errors.email = ['Email address is required']
  } else if (!/\S+@\S+\.\S+/.test(email)) {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: firstName || null,
        lastName: null,
        source: source || 'form',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to subscribe. Please try again later.'
      }
    }

    return {
      success: true,
      message: result.message || 'Successfully subscribed! Check your email for a welcome message.'
    }
  } catch (error) {
    console.error('Subscribe form error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    }
  }
}