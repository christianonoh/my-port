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
            <h1 style="color: #333; margin-bottom: 10px;">Welcome ${firstName || 'there'}! 👋</h1>
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
              <a href="https://christianonoh.com" style="color: #007bff; text-decoration: none; margin: 0 10px;">🌐 Website</a>
              <a href="https://github.com/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💻 GitHub</a>
              <a href="https://linkedin.com/in/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💼 LinkedIn</a>
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