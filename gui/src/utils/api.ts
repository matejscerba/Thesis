const SERVER_URL = "http://localhost:8086/";

export function fetchFromServer(
  url: string,
  params: { [key: string]: string } = {},
  method = "GET",
  mimeType: string,
  json?: { [key: string]: any },
) {
  const headers = new Headers({
    Accept: mimeType,
  });
  const paramsPath = `${Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
  let body: string = undefined;
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }
  return fetch(`${SERVER_URL}${url}${paramsPath ? "?" : ""}${paramsPath}`, {
    method,
    headers: headers,
    body,
  });
}

export function fetchString(
  url: string,
  params: { [key: string]: string } = {},
  method = "GET",
  json?: { [key: string]: any },
) {
  return fetchFromServer(url, params, method, "text", json).then((response) => response.text());
}

export function fetchPostString(url: string, params: { [key: string]: string } = {}, json?: { [key: string]: any }) {
  return fetchString(url, params, "POST", json);
}

export function fetchJson<T>(
  url: string,
  params: { [key: string]: string } = {},
  method = "GET",
  json?: { [key: string]: any },
) {
  return fetchFromServer(url, params, method, "application/json", json).then((response) => response.json() as T);
}

export function fetchPostJson<T>(url: string, data: { [key: string]: any }, params: { [key: string]: string }) {
  return fetchJson<T>(url, params, "POST", data);
}
