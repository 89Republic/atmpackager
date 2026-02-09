const API_BASE_URL = 'http://192.168.1.78:8080'

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/standards`, {
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