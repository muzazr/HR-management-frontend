import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    
    const authHeader = request.headers.get('authorization');
    
    // Kalau gak ada token, tolak langsung
    if (!authHeader) {
        return NextResponse.json({ detail: 'No authorization token' }, { status: 401 });
    }

    console.log('Proxying get applicants to backend...', { jobId });

    const backendUrl = `https://ai-recruitment-app-sigma.vercel.app/jobs/${jobId}/applicants`;
    
    // TEMPEL TOKEN KE REQUEST BACKEND
    const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Content-Type' : 'application/json'
        }
    });

    if (!response.ok) {
      console.error('Backend error:', response.status);
      return NextResponse.json(
        { detail: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error: any) {
    console.error('Get applicants proxy error:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}