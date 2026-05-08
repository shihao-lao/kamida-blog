import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function getVisitCount() {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('Vercel KV not configured, returning mock data');
      return Math.floor(Math.random() * 1000) + 500;
    }
    
    const count = await kv.get('total_visits');
    return count || 0;
  } catch (error) {
    console.error('Failed to get visit count:', error);
    return Math.floor(Math.random() * 1000) + 500;
  }
}

export async function incrementVisitCount() {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('Vercel KV not configured, skipping increment');
      return null;
    }
    
    const newCount = await kv.incr('total_visits');
    return newCount;
  } catch (error) {
    console.error('Failed to increment visit count:', error);
    return null;
  }
}
