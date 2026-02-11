const API_BASE_URL = 'http://10.203.14.33:8182/mapper1/api/v1'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ mappingId: string }> }
) {
  try {
    const resolvedParams = await params
    const mappingId = resolvedParams.mappingId?.trim()
    if (!mappingId || !/^\d+$/.test(mappingId)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid mappingId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const res = await fetch(`${API_BASE_URL}/mappings/${mappingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const text = await res.text()
    let data: unknown = null
    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = { success: res.ok, message: text }
      }
    }

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
