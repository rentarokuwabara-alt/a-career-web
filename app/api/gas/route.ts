/**
 * API route to proxy GAS calls
 * This bypasses CORS issues by making the request server-side
 */

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || '';

export async function POST(request: Request) {
  if (!GAS_URL) {
    return Response.json(
      { error: 'GAS_URL not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error('GAS API Error:', error);
    return Response.json(
      { error: 'Failed to call GAS API', message: String(error) },
      { status: 500 }
    );
  }
}
