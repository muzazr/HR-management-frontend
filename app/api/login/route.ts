import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // get form data dari request
    const formData = await request.formData();
    
    // Convert ke URLSearchParams 
    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      body.append(key, value.toString());
    });

    console.log('Proxying login request to backend...');
    console.log('Body:', Object.fromEntries(body));

    const backendUrl = 'https://ai-recruitment-app-sigma.vercel.app/login';
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();

    console.log('Backend response:', {
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