import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import ContactEmail from '@/emails/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, message } = await request.json();

    // Validate required fields
    if (!fullName || !message || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Render the email template
    const emailHtml = await render(
      ContactEmail({
        fullName,
        email: email || undefined,
        phone: phone || undefined,
        message,
      })
    );

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'info@christianonoh.com'],
      subject: `New Contact Form Submission from ${fullName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}