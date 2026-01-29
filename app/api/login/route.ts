import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.formData();
    
    // Convert to URLSearchParams (format yang backend expect)
    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      body.append(key, value.toString());
    });

    console.log('Proxying login request to backend...');
    console.log('Body:', Object.fromEntries(body));

    // Forward request to backend
    const backendUrl = 'https://ai-recruitment-app-sigma.vercel.app/login';
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();

    console.log('📡 Backend response:', {
      status: response.status,
      ok: response.ok,
    });

    // Return backend response to frontend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}