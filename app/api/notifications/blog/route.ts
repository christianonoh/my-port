import { NextResponse } from 'next/server';
import { sendNewBlogPostNotification, type BlogPost } from '@/lib/services/notification';
import { writeClient } from '@/sanity/sanity.client';

export async function POST(request: Request) {
  try {
    const { blogPostId, slug } = await request.json();

    if (!blogPostId && !slug) {
      return NextResponse.json(
        { error: 'Either blogPostId or slug is required' },
        { status: 400 }
      );
    }

    let query = '';
    let params = {};

    if (blogPostId) {
      query = `*[_type == "blogPost" && _id == $blogPostId][0]`;
      params = { blogPostId };
    } else {
      query = `*[_type == "blogPost" && slug.current == $slug][0]`;
      params = { slug };
    }

    const blogPost = await writeClient.fetch(`
      ${query} {
        title,
        slug,
        excerpt,
        publishedAt,
        coverImage {
          asset-> {
            url
          },
          alt
        }
      }
    `, params);

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    await sendNewBlogPostNotification(blogPost as BlogPost);

    return NextResponse.json({ 
      success: true, 
      message: 'Blog post notification sent successfully' 
    });
  } catch (error) {
    console.error('Blog notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to send blog post notification' },
      { status: 500 }
    );
  }
}