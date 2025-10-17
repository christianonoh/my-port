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
