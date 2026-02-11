const API_BASE_URL = 'http://10.203.14.33:8182/mapper1/api/v1'

export async function GET(
  _request: Request,
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

    const res = await fetch(`${API_BASE_URL}/mappings/client/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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