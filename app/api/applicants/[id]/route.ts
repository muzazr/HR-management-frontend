import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicantId } = await context.params;

    // Ambil Token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
       return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    console.log('Proxying delete applicant to backend...', { applicantId });

    const backendUrl = `https://ai-recruitment-app-sigma.vercel.app/applicants/${applicantId}`;
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader, // Oper token
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ detail: errorText }, { status: response.status });
    }

    const data = response.status === 204 ? { success: true } : await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Delete applicant proxy error:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}