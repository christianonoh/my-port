import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/sanity.client';

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

    // Send welcome email
    const { error } = await resend.emails.send({
      from: 'Christian <noreply@christianonoh.com>',
      to: [email],
      subject: 'Welcome to my newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://christianonoh.com/logo.svg" alt="Christian Onoh Logo" style="width: 80px; height: 80px; margin-bottom: 20px;" />
            <h1 style="color: #333; margin-bottom: 10px;">Welcome ${firstName || 'there'}!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for subscribing to my newsletter</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">What to expect:</h2>
            <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
              <li>🚀 Latest projects and updates</li>
              <li>💡 Tech insights and learnings</li>
              <li>📝 New blog posts and articles</li>
              <li>🎯 Behind-the-scenes content</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 20px;">Stay connected with me:</p>
            <div style="margin: 20px 0;">
              <a href="https://christianonoh.com" style="color: #007bff; text-decoration: none; margin: 0 15px; display: inline-flex; align-items: center;">
                <svg width="20" height="20" style="margin-right: 8px;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Website
              </a>
              <a href="https://github.com/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 15px; display: inline-flex; align-items: center;">
                <svg width="20" height="20" style="margin-right: 8px;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 15px; display: inline-flex; align-items: center;">
                <svg width="20" height="20" style="margin-right: 8px;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
            <p>You're receiving this because you subscribed to my newsletter.</p>
            <p>Don't want these emails? <a href="{{unsubscribe_url}}" style="color: #888;">Unsubscribe</a></p>
          </div>
        </div>
      `,
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