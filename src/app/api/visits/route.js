import { NextResponse } from 'next/server';
import { getVisitCount, incrementVisitCount } from '@/lib/visits';

export async function GET() {
  try {
    const count = await getVisitCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting visit count:', error);
    return NextResponse.json({ error: 'Failed to get visit count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await incrementVisitCount();
    if (count === null) {
      return NextResponse.json({ count: await getVisitCount() });
    }
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    return NextResponse.json({ error: 'Failed to increment visit count' }, { status: 500 });
  }
}
