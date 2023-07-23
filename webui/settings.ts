import { SERVER_PORT } from "../shared/globals";

const apiHostname = process.env.REACT_APP_API_HOST ?? window.location.hostname;
const apiServerPort = SERVER_PORT;

const apiBaseUrl = `ws://${apiHostname}:${apiServerPort}`;

export default {
  apiHostname,
  apiServerPort,
  apiBaseUrl,
};
