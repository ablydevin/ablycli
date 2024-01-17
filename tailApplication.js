import columnify from "columnify";
import EventSource from "eventsource";
import { DEFAULT_COLUMN_SPLITTER } from "./utility.js";

const columnDefaults = {
  timestamp: { minWidth: 13 },
  name: { minWidth: 17, maxWidth: 17 },
  data: { maxWidth: 80 },
};

const columnDisplayOrder = ["timestamp", "name", "data"];

const colmnifyOptions = {
  config: columnDefaults,
  showHeaders: true,
  columnSplitter: DEFAULT_COLUMN_SPLITTER,
  columns: columnDisplayOrder,
};

export const tailApplication = async (appid) => {
  console.log(columnify({}, colmnifyOptions));

  var connections = new EventSource(
    `https://realtime.ably.io/sse?v=1.2&channels=[app:${appid}:meta]connection.lifecycle&key=${process.env.ABLY_API_KEY}`
  );
  connections.addEventListener("message", outputApplicationLog);
  connections.onerror = outputApplicationError;

  var channels = new EventSource(
    `https://realtime.ably.io/sse?v=1.2&channels=[app:${appid}:meta]channel.lifecycle&key=${process.env.ABLY_API_KEY}`
  );
  channels.addEventListener("message", outputApplicationLog);
  channels.onerror = outputApplicationError;
};

const outputApplicationLog = (e) => {
  const colmnifyOptions = {
    config: columnDefaults,
    showHeaders: false,
    preserveNewLines: true,
    columnSplitter: DEFAULT_COLUMN_SPLITTER,
    columns: columnDisplayOrder,
  };

  let env = JSON.parse(e.data);
  let msg = JSON.parse(env.data);

  let mapped = {
    timestamp: new Date(env.timestamp).toLocaleTimeString(),
    name: env.name,
    data: env.data,
  };

  console.log(columnify([mapped], colmnifyOptions));
};

const outputApplicationError = (err) => {
  console.log(err);
  if (err) {
    if (err.status === 401 || err.status === 403) {
      console.log("not authorized");
    } else {
      if (err.data) {
        const data = JSON.parse(err.data);
        console.log(data.message);
      }
    }
  }
};

//exports.tailApplication = tailApplication;
