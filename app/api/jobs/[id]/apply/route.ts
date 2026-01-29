import { NextRequest, NextResponse } from "next/server";

export async function POST (
    request: NextRequest,
    context : {params : Promise<{id: string}>}
) {
    try {
        const {id: jobId} = await context.params;
        const formData = await request.formData();
        
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ detail: 'No authorization token' }, { status: 401 });
        }

        console.log('Upload CVs to Backend');

        const backendUrl = `https://ai-recruitment-app-sigma.vercel.app/jobs/${jobId}/apply`
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
            },
            body: formData
        })

        const data = await response.json()

        console.log('backend response: ', {
            status: response.status,
            ok: response.ok
        })

        return NextResponse.json(data, {status: response.status})
    } catch (error: any) {
        console.error('Upload CVs error: ', error)
        return NextResponse.json(
            {detail: error.message || 'Internal server Error'},
            {status: 500}
        )
    }
}