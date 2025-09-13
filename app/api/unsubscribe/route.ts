import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/sanity.client';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Find subscriber
    const subscriber = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email address not found' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { message: 'Already unsubscribed' },
        { status: 200 }
      );
    }

    // Update subscription status
    await writeClient
      .patch(subscriber._id)
      .set({ 
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed' 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    );
  }
}