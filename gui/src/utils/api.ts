const SERVER_URL = "http://localhost:8086/";

export function fetchJsonFromServer(
  url: string,
  params: { [key: string]: string } = {},
  method = "GET",
  json?: { [key: string]: any },
) {
  const headers = new Headers({
    Accept: "application/json",
  });
  let body: string = undefined;
  const paramsPath = `${Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
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

export function fetchPost(url: string, data: { [key: string]: any }, params: { [key: string]: string }) {
  return fetchJsonFromServer(url, params, "POST", data);
}
