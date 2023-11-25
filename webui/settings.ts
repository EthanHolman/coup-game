const apiHostname = process.env.REACT_APP_API_HOST ?? window.location.host;

const apiWsUrl = `ws://${apiHostname}`;
const apiBaseUrl = `http://${apiHostname}`;

export default {
  apiHostname,
  apiWsUrl,
  apiBaseUrl,
};
