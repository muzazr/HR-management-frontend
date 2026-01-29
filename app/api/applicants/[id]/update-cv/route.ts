import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicantId } = await context.params;
    const formData = await request.formData();
    
    // Ambil Token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
       return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    console.log('Proxying update CV to backend...', { applicantId });

    const backendUrl = `https://ai-recruitment-app-sigma.vercel.app/applicants/${applicantId}`;
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader, 
      },
      body: formData,
    });

    const data = await response.json();

    console.log('Backend response:', {
      status: response.status,
      ok: response.ok,
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Update CV proxy error:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}