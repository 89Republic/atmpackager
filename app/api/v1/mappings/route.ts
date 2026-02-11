const API_BASE_URL = 'http://10.203.14.33:8182/mapper1/api/v1'

type MappingCreatePayload = {
  clientId: number
  isoRecId: number
  clientFieldNo: number
  direction: string
  transformation?: string
  defaultValue?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MappingCreatePayload

    const res = await fetch(`${API_BASE_URL}/mappings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
