import { NextRequest, NextResponse } from 'next/server';
import { graveyardDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12;

    const recent = graveyardDb.getRecentlyBuried(limit);
    return NextResponse.json({
      count: recent.length,
      entities: recent
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch recently buried entities' }, { status: 500 });
  }
}
