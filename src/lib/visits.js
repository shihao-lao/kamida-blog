import { createClient } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.visits.json');

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function getLocalData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to read local data:', error);
  }
  return { total_visits: 0 };
}

function saveLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save local data:', error);
    return false;
  }
}

export async function getVisitCount() {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const count = await kv.get('total_visits');
      return count || 0;
    }
    
    const data = getLocalData();
    return data.total_visits || 0;
  } catch (error) {
    console.error('Failed to get visit count:', error);
    const data = getLocalData();
    return data.total_visits || 0;
  }
}

export async function incrementVisitCount() {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const newCount = await kv.incr('total_visits');
      return newCount;
    }
    
    const data = getLocalData();
    data.total_visits = (data.total_visits || 0) + 1;
    saveLocalData(data);
    return data.total_visits;
  } catch (error) {
    console.error('Failed to increment visit count:', error);
    return null;
  }
}
