//     *** IMPORTANT ***
//  In order for env vars to be picked up in build
//  process, make sure to name it beginning with REACT_APP_.....

const dotenv = require("dotenv");

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  // Pulls in REACT_APP_ variables from local system
  const systemEnv = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});

  const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development", // define default if none provided
    ...dotenv.config().parsed, // Pulls in variables defined in .env file
    ...systemEnv, // system env vars will override what's in .env
  };

  console.debug(env);

  return JSON.stringify(env);
}

module.exports = getClientEnvironment;
