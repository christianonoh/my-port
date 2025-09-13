import { NextResponse } from 'next/server';
import { sendNewProjectNotification, type Project } from '@/lib/services/notification';
import { writeClient } from '@/sanity/sanity.client';

export async function POST(request: Request) {
  try {
    const { projectId, slug } = await request.json();

    if (!projectId && !slug) {
      return NextResponse.json(
        { error: 'Either projectId or slug is required' },
        { status: 400 }
      );
    }

    let query = '';
    let params = {};

    if (projectId) {
      query = `*[_type == "project" && _id == $projectId][0]`;
      params = { projectId };
    } else {
      query = `*[_type == "project" && slug.current == $slug][0]`;
      params = { slug };
    }

    const project = await writeClient.fetch(`
      ${query} {
        title,
        slug,
        tagline,
        coverImage {
          asset-> {
            url
          },
          alt
        },
        projectUrl,
        githubUrl
      }
    `, params);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await sendNewProjectNotification(project as Project);

    return NextResponse.json({ 
      success: true, 
      message: 'Project notification sent successfully' 
    });
  } catch (error) {
    console.error('Project notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to send project notification' },
      { status: 500 }
    );
  }
}