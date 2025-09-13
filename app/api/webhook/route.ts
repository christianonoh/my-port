import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('sanity-webhook-signature');
    
    // Verify webhook signature (if configured)
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (secret && signature) {
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      
      if (`sha256=${computedSignature}` !== signature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    console.log('Webhook received:', payload);

    // Handle document creation/update
    if (payload.action === 'create' || payload.action === 'update') {
      const document = payload.result;
      
      // Check if this is a published document (not a draft)
      if (!document._id.startsWith('drafts.')) {
        if (document._type === 'blogPost') {
          // Trigger blog post notification
          try {
            const notificationResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/blog`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blogPostId: document._id,
                  slug: document.slug?.current,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.error('Failed to send blog notification');
            }
          } catch (error) {
            console.error('Error triggering blog notification:', error);
          }
        } else if (document._type === 'project') {
          // Trigger project notification
          try {
            const notificationResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/project`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  projectId: document._id,
                  slug: document.slug?.current,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.error('Failed to send project notification');
            }
          } catch (error) {
            console.error('Error triggering project notification:', error);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}