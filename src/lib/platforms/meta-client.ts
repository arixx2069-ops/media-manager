const GRAPH_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export type MetaGraphError = {
  message: string;
  type?: string;
  code?: number;
};

export async function metaGraphGet<T>(
  path: string,
  accessToken: string,
  params: Record<string, string> = {}
): Promise<T> {
  if (!accessToken) {
    throw new Error("Meta access token is not set");
  }

  const url = new URL(`${GRAPH_BASE}/${path.replace(/^\//, "")}`);
  url.searchParams.set("access_token", accessToken);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  const data = (await res.json()) as T & { error?: MetaGraphError };

  if (!res.ok || data.error) {
    const msg = data.error?.message ?? `Meta API error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
