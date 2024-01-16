const { program } = require("commander");
const columnify = require('columnify')
const EventSource = require("eventsource");
require('dotenv').config()
//console.log(process.env)

defaultColumnOptions = {
  columnSplitter: ' | '
}

const STREAMING_DELAY_IN_SECONDS = 1;
const ABLY_API_KEY = process.env.ABLY_API_KEY;

const sleep = (ms) => {
  //console.log(`sleeping`)
  return new Promise((resolve) => setTimeout(resolve, ms));
};

program
  .name("ablycli")
  .version("1.0.0")
  .description("A simple CLI application built with Node.js");

program
  .command("greet <name>")
  .description("Greets the user with their name")
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program
  //how do I add optional parameters like channel
  .command("tail")
  .argument("<appid>")
  .option("-c, --channel <name>", "name of the channel to watch")
  .description("Watch application events in real time")
  .action(async (app) => {

    defaultColumnOptions.columns = ['name','data','transport']
    console.log(columnify([], defaultColumnOptions))

    //app connection events
    var connections = new EventSource(
      `https://realtime.ably.io/sse?v=1.2&channels=[app:${app}:meta]connection.lifecycle&key=${ABLY_API_KEY}`
    );
    connections.addEventListener("message", function (e) {
      let data = JSON.parse(e.data);
      defaultColumnOptions.showHeaders = false;
      defaultColumnOptions.truncate = true;
      console.log(columnify([data], defaultColumnOptions))
      //console.log(e.data);
      //console.log(table.toString())
    });
    connections.onerror = function (err) {
      if (err) {
        if (err.status === 401 || err.status === 403) {
          console.log("not authorized");
        }
      }
    };


    //channel
    var channels = new EventSource(`https://realtime.ably.io/sse?v=1.2&channels=[app:${app}:meta]channel.lifecycle&key=${ABLY_API_KEY}`)
    channels.addEventListener('message', function (e) {
     console.log(e.data)
    })
    channels.onerror = function (err) {
      if (err) {
        if (err.status === 401 || err.status === 403) {
          console.log('not authorized');
        }
      }
    };

    while (true) {
      await sleep(STREAMING_DELAY_IN_SECONDS * 1000);
    }
  });

program.parse(process.argv);
