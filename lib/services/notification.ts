'use server'

import { Resend } from 'resend';
import { writeClient } from '@/sanity/sanity.client';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BlogPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  coverImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

export interface Project {
  title: string;
  slug: { current: string };
  tagline: string;
  coverImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  projectUrl?: string;
  githubUrl?: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'pending';
}

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

export async function sendNewBlogPostNotification(blogPost: BlogPost): Promise<void> {
  try {
    const subscribers = await getActiveSubscribers();
    
    if (subscribers.length === 0) {
      console.log('No active subscribers to notify');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const blogUrl = `${baseUrl}/blog/${blogPost.slug.current}`;
    const unsubscribeBaseUrl = `${baseUrl}/api/unsubscribe`;

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(subscriber.email)}&id=${subscriber._id}`;
      
      const { error } = await resend.emails.send({
        from: 'Christian <noreply@christianonoh.com>',
        to: [subscriber.email],
        subject: `📝 New Blog Post: ${blogPost.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">New Blog Post Alert! 📝</h1>
              <p style="color: #666; font-size: 16px;">Hi ${subscriber.firstName || 'there'}, I just published a new blog post!</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #007bff;">
              ${blogPost.coverImage ? `
                <img src="${blogPost.coverImage.asset.url}" alt="${blogPost.coverImage.alt || blogPost.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />
              ` : ''}
              <h2 style="color: #333; margin-top: 0; margin-bottom: 15px;">${blogPost.title}</h2>
              ${blogPost.excerpt ? `
                <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">${blogPost.excerpt}</p>
              ` : ''}
              <div style="text-align: center;">
                <a href="${blogUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Read Full Post →</a>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0; color: #666;">
              <p>Published on ${new Date(blogPost.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Stay connected:</p>
              <div style="margin: 20px 0;">
                <a href="https://christianonoh.com" style="color: #007bff; text-decoration: none; margin: 0 10px;">🌐 Website</a>
                <a href="https://github.com/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💻 GitHub</a>
                <a href="https://linkedin.com/in/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💼 LinkedIn</a>
              </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
              <p>You're receiving this because you subscribed to my newsletter.</p>
              <p>Don't want these emails? <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error(`Failed to send blog notification to ${subscriber.email}:`, error);
      } else {
        console.log(`Blog notification sent to ${subscriber.email}`);
      }
    }

    console.log(`Blog post notification sent to ${subscribers.length} subscribers`);
  } catch (error) {
    console.error('Error sending blog post notifications:', error);
  }
}

export async function sendNewProjectNotification(project: Project): Promise<void> {
  try {
    const subscribers = await getActiveSubscribers();
    
    if (subscribers.length === 0) {
      console.log('No active subscribers to notify');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const projectUrl = `${baseUrl}/projects/${project.slug.current}`;
    const unsubscribeBaseUrl = `${baseUrl}/api/unsubscribe`;

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${unsubscribeBaseUrl}?email=${encodeURIComponent(subscriber.email)}&id=${subscriber._id}`;
      
      const { error } = await resend.emails.send({
        from: 'Christian <noreply@christianonoh.com>',
        to: [subscriber.email],
        subject: `🚀 New Project Launch: ${project.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">New Project Launch! 🚀</h1>
              <p style="color: #666; font-size: 16px;">Hi ${subscriber.firstName || 'there'}, I just launched a new project!</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #28a745;">
              ${project.coverImage ? `
                <img src="${project.coverImage.asset.url}" alt="${project.coverImage.alt || project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />
              ` : ''}
              <h2 style="color: #333; margin-top: 0; margin-bottom: 15px;">${project.title}</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">${project.tagline}</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${projectUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 5px;">View Project →</a>
                ${project.projectUrl ? `
                  <a href="${project.projectUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 5px;">Live Demo →</a>
                ` : ''}
                ${project.githubUrl && project.githubUrl !== 'https://github.com/' ? `
                  <a href="${project.githubUrl}" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 5px;">View Code →</a>
                ` : ''}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Stay connected:</p>
              <div style="margin: 20px 0;">
                <a href="https://christianonoh.com" style="color: #007bff; text-decoration: none; margin: 0 10px;">🌐 Website</a>
                <a href="https://github.com/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💻 GitHub</a>
                <a href="https://linkedin.com/in/christianonoh" style="color: #007bff; text-decoration: none; margin: 0 10px;">💼 LinkedIn</a>
              </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
              <p>You're receiving this because you subscribed to my newsletter.</p>
              <p>Don't want these emails? <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error(`Failed to send project notification to ${subscriber.email}:`, error);
      } else {
        console.log(`Project notification sent to ${subscriber.email}`);
      }
    }

    console.log(`Project notification sent to ${subscribers.length} subscribers`);
  } catch (error) {
    console.error('Error sending project notifications:', error);
  }
}