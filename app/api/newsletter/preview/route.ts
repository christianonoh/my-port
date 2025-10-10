import { NextResponse } from 'next/server';
import { previewNewsletter } from '@/lib/services/newsletter';

export async function POST(request: Request) {
  try {
    const { newsletterId } = await request.json();

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'Newsletter ID is required' },
        { status: 400 }
      );
    }

    const html = await previewNewsletter(newsletterId);

    // Return HTML for preview
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Newsletter preview API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to preview newsletter';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
