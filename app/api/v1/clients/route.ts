export async function GET() {
  try {
    const res = await fetch('http://192.168.1.53:8080/api/v1/clients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Avoid caching; always proxy fresh data
      cache: 'no-store',
    })

    const data = await res.json()

    // Pass through status from upstream
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