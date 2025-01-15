import { Event } from "../types/event";

/**
 * Url of the server. Ending with slash.
 */
const SERVER_URL = process.env.REACT_APP_SERVER_URL ?? "http://localhost:8086/";

/**
 * Fetches data from a server.
 *
 * @param {string} url relative url to be called
 * @param {{ [key: string]: string }} params GET params of the request - will be appended to the url
 * @param {string} method request method
 * @param {string} mimeType what type of response to accept - sets Accept header
 * @param {{ [key: string]: any }} json JSON content of the request
 * @return {Promise<Response>} the response of the server
 */
export function fetchFromServer(
  url: string,
  params: { [key: string]: string } = {},
  method: string = "GET",
  mimeType: string,
  json?: { [key: string]: any },
): Promise<Response> {
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
    credentials: "include",
    headers: headers,
    body,
  });
}

/**
 * Fetches JSON data from the server.
 *
 * @param {string} url relative url to be called
 * @param {{ [key: string]: string }} params GET params of the request - will be appended to the url
 * @param {string} method request method
 * @param {{ [key: string]: any }} json JSON content of the request
 * @return {Promise<T>} the response of the server
 * @template T
 */
export function fetchJson<T>(
  url: string,
  params: { [key: string]: string } = {},
  method: string = "GET",
  json?: { [key: string]: any },
): Promise<T> {
  return fetchFromServer(url, params, method, "application/json", json).then((response) => response.json() as T);
}

/**
 * Fetches JSON data from the server via POST method.
 *
 * @param {string} url relative url to be called
 * @param {{ [key: string]: any }} data JSON content of the request
 * @param {{ [key: string]: string }} params GET params of the request - will be appended to the url
 * @return {Promise<T>} the response of the server
 * @template T
 */
export function fetchPostJson<T>(
  url: string,
  data: { [key: string]: any },
  params: { [key: string]: string } = {},
): Promise<T> {
  return fetchJson<T>(url, params, "POST", data);
}

/**
 * Logs event in the server via POST HTTP request.
 *
 * @param {Event} event event to be logged
 * @param {{ [key: string]: any }} data data of the event to be logged
 */
export function logEvent(event: Event, data: { [key: string]: any }) {
  fetchPostJson<{ success: boolean }>("log_event", data, { event: event.valueOf() })
    .then((response) => {
      console.log(`Logging event ${event.valueOf()} finished with success: ${response.success}`);
    })
    .catch((e) => {
      console.error(e);
    });
}

/**
 * Updates the state of the important attributes in the server via POST HTTP request.
 *
 * @param {string} categoryName name of the category
 * @param {string[]} attributes names of the current important attributes
 */
export function updateAttributesState(categoryName: string, attributes: string[]) {
  fetchPostJson<{ success: boolean }>("update_attributes_state", { attributes }, { category_name: categoryName })
    .then((response) => {
      console.log(
        `Updating attributes state to ${JSON.stringify(attributes)} finished with success: ${response.success}`,
      );
    })
    .catch((e) => {
      console.error(e);
    });
}
