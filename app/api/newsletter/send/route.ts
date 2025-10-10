import { NextResponse } from 'next/server';
import { sendNewsletter } from '@/lib/services/newsletter';

export async function POST(request: Request) {
  try {
    const { newsletterId } = await request.json();

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'Newsletter ID is required' },
        { status: 400 }
      );
    }

    const result = await sendNewsletter(newsletterId);

    return NextResponse.json({
      message: `Newsletter sent successfully to ${result.successCount} subscribers`,
      ...result,
    });
  } catch (error) {
    console.error('Newsletter send API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to send newsletter';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
