/**
 * Concatenates the api root and api route to be polled
 *
 * @param       {string} server  server to be polled
 * @param       {string} group  api group
 * @param       {string} version version of the API to be polled
 * @param       {string} name  route name
 * @constructor
 */
export function Api(server, version, name) {
  return "http://torochainfinancial.io/" + server.toUpperCase() + "/api/v" + version + "/" + name;
}
