const API_BASE_URL = 'http://192.168.1.78:8080'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const resolvedParams = await params
    const clientId = resolvedParams.clientId?.trim()

    if (!clientId || !/^\d+$/.test(clientId)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid clientId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await request.json()

    const res = await fetch(`${API_BASE_URL}/api/v1/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Proxy fetch failed'
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
