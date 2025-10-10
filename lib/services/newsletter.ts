'use server'

import { Resend } from 'resend';
import { writeClient } from '@/sanity/sanity.client';
import { render } from '@react-email/components';
import { toHTML } from '@portabletext/to-html';
import NewsletterEmail from '@/emails/NewsletterEmail';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Image URL builder
const builder = imageUrlBuilder(writeClient);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface Subscriber {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'pending';
}

interface Newsletter {
  _id: string;
  subject: string;
  preheader?: string;
  content: any[]; // Portable Text array
  status: 'draft' | 'scheduled' | 'sent';
  audienceType?: 'all' | 'tags' | 'interests' | 'test';
  testEmail?: string;
  filterTags?: string[];
  filterInterests?: string[];
}

// Convert Portable Text to HTML for emails
function portableTextToHtml(blocks: any[]): string {
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const imageUrl = urlFor(value).width(600).url();
          const alt = value.alt || '';
          const caption = value.caption || '';

          return `
            <div style="margin: 24px 0;">
              <img
                src="${imageUrl}"
                alt="${alt}"
                style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;"
              />
              ${caption ? `<p style="color: #666; font-size: 14px; margin-top: 8px; text-align: center;">${caption}</p>` : ''}
            </div>
          `;
        },
      },
      marks: {
        link: ({ children, value }) => {
          const href = value?.href || '';
          return `<a href="${href}" style="color: #007bff; text-decoration: underline;">${children}</a>`;
        },
        strong: ({ children }) => `<strong style="font-weight: 600;">${children}</strong>`,
        em: ({ children }) => `<em>${children}</em>`,
        code: ({ children }) => `<code style="background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${children}</code>`,
      },
      block: {
        h1: ({ children }) => `<h1 style="color: #333; font-size: 32px; font-weight: bold; margin: 24px 0 16px; line-height: 1.3;">${children}</h1>`,
        h2: ({ children }) => `<h2 style="color: #333; font-size: 28px; font-weight: bold; margin: 24px 0 16px; line-height: 1.3;">${children}</h2>`,
        h3: ({ children }) => `<h3 style="color: #333; font-size: 24px; font-weight: bold; margin: 20px 0 12px; line-height: 1.3;">${children}</h3>`,
        normal: ({ children }) => `<p style="color: #555; font-size: 16px; line-height: 1.6; margin: 12px 0;">${children}</p>`,
        blockquote: ({ children }) => `<blockquote style="border-left: 4px solid #007bff; padding-left: 20px; margin: 20px 0; color: #666; font-style: italic;">${children}</blockquote>`,
      },
      list: {
        bullet: ({ children }) => `<ul style="color: #555; font-size: 16px; line-height: 1.6; margin: 16px 0; padding-left: 24px;">${children}</ul>`,
        number: ({ children }) => `<ol style="color: #555; font-size: 16px; line-height: 1.6; margin: 16px 0; padding-left: 24px;">${children}</ol>`,
      },
      listItem: {
        bullet: ({ children }) => `<li style="margin: 8px 0;">${children}</li>`,
        number: ({ children }) => `<li style="margin: 8px 0;">${children}</li>`,
      },
    },
  });
}

// Get all active subscribers
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await writeClient.fetch(
      `*[_type == "subscriber" && status == "active"]{
        _id,
        email,
        firstName,
        lastName,
        status
      }`
    );
    return subscribers;
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    return [];
  }
}

// Get filtered subscribers based on newsletter audience settings
export async function getFilteredSubscribers(newsletter: Newsletter): Promise<Subscriber[]> {
  try {
    const { audienceType, testEmail, filterTags, filterInterests } = newsletter;

    // LOG WHAT WE RECEIVED
    console.log('🎯 Audience filtering:', {
      audienceType,
      testEmail,
      filterTags,
      filterInterests
    });

    // Test mode - send to specific email only
    if (audienceType === 'test') {
      if (!testEmail) {
        throw new Error('Test email address is required for test mode');
      }
      console.log('✅ TEST MODE - Sending to:', testEmail);
      return [{
        _id: 'test',
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        status: 'active',
      }];
    }

    // Filter by tags
    if (audienceType === 'tags' && filterTags && filterTags.length > 0) {
      const subscribers = await writeClient.fetch(
        `*[_type == "subscriber" && status == "active" && count((tags[@ in $filterTags])) > 0]{
          _id,
          email,
          firstName,
          lastName,
          status
        }`,
        { filterTags }
      );
      return subscribers;
    }

    // Filter by interests
    if (audienceType === 'interests' && filterInterests && filterInterests.length > 0) {
      const subscribers = await writeClient.fetch(
        `*[_type == "subscriber" && status == "active" && count((interests[@ in $filterInterests])) > 0]{
          _id,
          email,
          firstName,
          lastName,
          status
        }`,
        { filterInterests }
      );
      return subscribers;
    }

    // Default: all active subscribers
    return getActiveSubscribers();
  } catch (error) {
    console.error('Error fetching filtered subscribers:', error);
    throw error;
  }
}

// Send newsletter to all active subscribers
export async function sendNewsletter(newsletterId: string): Promise<{
  success: boolean;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  errors: string[];
}> {
  try {
    // Fetch newsletter
    const newsletter = await writeClient.fetch<Newsletter>(
      `*[_type == "newsletter" && _id == $newsletterId][0]{
        _id,
        subject,
        preheader,
        content,
        status,
        audienceType,
        testEmail,
        filterTags,
        filterInterests
      }`,
      { newsletterId }
    );

    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    // LOG THE NEWSLETTER DATA
    console.log('📧 Newsletter data fetched:', {
      id: newsletter._id,
      subject: newsletter.subject,
      status: newsletter.status,
      audienceType: newsletter.audienceType,
      testEmail: newsletter.testEmail,
    });

    if (newsletter.status === 'sent') {
      throw new Error('Newsletter has already been sent');
    }

    // Get filtered subscribers based on audience selection
    const subscribers = await getFilteredSubscribers(newsletter);

    console.log(`👥 Subscriber count: ${subscribers.length}`);

    if (subscribers.length === 0) {
      throw new Error('No active subscribers to send to');
    }

    // Convert Portable Text to HTML
    const contentHtml = portableTextToHtml(newsletter.content);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const unsubscribeBaseUrl = `${baseUrl}/api/unsubscribe`;

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // Send emails with rate limiting (batch approach)
    const batchSize = 10; // Send 10 emails at a time
    const delayMs = 1000; // 1 second delay between batches

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const promises = batch.map(async (subscriber) => {
        try {
          const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(subscriber.email)}&id=${subscriber._id}`;

          const emailHtml = await render(
            NewsletterEmail({
              subject: newsletter.subject,
              preheader: newsletter.preheader,
              subscriberName: subscriber.firstName,
              contentHtml,
              unsubscribeUrl,
            })
          );

          const { error } = await resend.emails.send({
            from: 'Christian Newsletter <newsletter@christianonoh.com>',
            to: [subscriber.email],
            subject: newsletter.subject,
            html: emailHtml,
          });

          if (error) {
            throw error;
          }

          successCount++;
          console.log(`Newsletter sent to ${subscriber.email}`);
        } catch (error) {
          failureCount++;
          const errorMsg = `Failed to send to ${subscriber.email}: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      });

      await Promise.all(promises);

      // Delay between batches (except for the last batch)
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    // Update newsletter status in Sanity
    await writeClient
      .patch(newsletter._id)
      .set({
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientCount: subscribers.length,
        successCount,
        failureCount,
        errors: errors.length > 0 ? errors : undefined,
      })
      .commit();

    console.log(`Newsletter sent: ${successCount} success, ${failureCount} failures`);

    return {
      success: true,
      recipientCount: subscribers.length,
      successCount,
      failureCount,
      errors,
    };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}

// Preview newsletter (for testing)
export async function previewNewsletter(newsletterId: string): Promise<string> {
  try {
    const newsletter = await writeClient.fetch<Newsletter>(
      `*[_type == "newsletter" && _id == $newsletterId][0]{
        _id,
        subject,
        preheader,
        content
      }`,
      { newsletterId }
    );

    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    const contentHtml = portableTextToHtml(newsletter.content);

    const emailHtml = await render(
      NewsletterEmail({
        subject: newsletter.subject,
        preheader: newsletter.preheader,
        subscriberName: 'Preview User',
        contentHtml,
        unsubscribeUrl: '#',
      })
    );

    return emailHtml;
  } catch (error) {
    console.error('Error previewing newsletter:', error);
    throw error;
  }
}
