/**
 * Url of the server. Ending with slash.
 */
const SERVER_URL = `${process.env.REACT_APP_SERVER_URL}${process.env.REACT_APP_SERVER_URL.endsWith("/") ? "" : "/"}`;

/**
 * Fetches data from a server.
 *
 * @param {string} url relative url to be called
 * @param {Object.<string, string>} params GET params of the request - will be appended to the url
 * @param {string} method request method
 * @param {string} mimeType what type of response to accept - sets Accept header
 * @param {Object.<string, any>} json JSON content of the request
 */
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

/**
 * Fetches JSON data from the server.
 *
 * @param {string} url relative url to be called
 * @param {Object.<string, string>} params GET params of the request - will be appended to the url
 * @param {string} method request method
 * @param {Object.<string, any>} json JSON content of the request
 */
export function fetchJson<T>(
  url: string,
  params: { [key: string]: string } = {},
  method = "GET",
  json?: { [key: string]: any },
) {
  return fetchFromServer(url, params, method, "application/json", json).then((response) => response.json() as T);
}

/**
 * Fetches JSON data from the server via POST method.
 *
 * @param {string} url relative url to be called
 * @param {Object.<string, any>} data JSON content of the request
 * @param {Object.<string, string>} params GET params of the request - will be appended to the url
 */
export function fetchPostJson<T>(url: string, data: { [key: string]: any }, params: { [key: string]: string }) {
  return fetchJson<T>(url, params, "POST", data);
}
