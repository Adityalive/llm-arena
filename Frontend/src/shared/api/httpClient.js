const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

function toAbsolute(path) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      (typeof payload === "object" && payload && (payload.error || payload.message)) ||
      `Request failed (${response.status})`;

    throw new Error(errorMessage);
  }

  return payload;
}

export async function get(path) {
  const response = await fetch(toAbsolute(path), {
    method: "GET",
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  });

  return parseResponse(response);
}

export async function post(path, body) {
  const response = await fetch(toAbsolute(path), {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}
