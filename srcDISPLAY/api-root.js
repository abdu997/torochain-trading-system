/**
 * Concatenates the api root and api route to be polled
 *
 * @param       {string} server  server to be polled
 * @param       {string} version version of the API to be polled
 * @constructor
 */
export function Root(server, version) {
  return "https://www.torochainfinancial.io/" + server + "/";
}
