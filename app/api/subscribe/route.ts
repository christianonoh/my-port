import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/sanity.client';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, source } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Check if email is already subscribed
    const existingSubscriber = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        await writeClient
          .patch(existingSubscriber._id)
          .set({ 
            status: 'active',
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null
          })
          .commit();
      }
    } else {
      // Create new subscriber
      await writeClient.create({
        _type: 'subscriber',
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        status: 'active',
        subscribedAt: new Date().toISOString(),
        source: source || 'unknown',
      });
    }

    // Send welcome email using React Email template
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;

    const emailHtml = await render(
      WelcomeEmail({
        subscriberName: firstName,
        unsubscribeUrl,
      })
    );

    const { error } = await resend.emails.send({
      from: 'Christian <noreply@christianonoh.com>',
      to: [email],
      subject: 'Welcome to my newsletter!',
      html: emailHtml,
    });

    if (error) {
      console.error('Welcome email error:', error);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}