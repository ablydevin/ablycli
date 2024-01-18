import { program } from "commander";
import 'dotenv/config'
import { tailApplication } from "./commands/tail/application.js";
import { tailChannels } from "./commands/tail/channels.js";
import { statsApplication } from "./commands/stats/application.js";

program
  .name("ablycli")
  .version("1.0.0")
  .description("A simple CLI application built with Node.js");

program
  //how do I add optional parameters like channel
  .command("tail")
  .argument("<appid>")
  .option("-s, --scope <scope>", "the scope to tail", "application", "channels")
  .option("-c, --channel <channel>", "the channel to tail")
  .option("-r, --raw", "display logs in raw json")
  .description("Tail Ably events in real time")
  .action(async (appid, options, command) => {
    switch (options.scope) {
      case "application":
        tailApplication(appid);
        break;
      case "channels":
        tailChannels(appid, options.channel);
        break;
      default:
        console.log("No scope provided");
    }
  });

program
  //how do I add optional parameters like channel
  .command("stats")
  .argument("<appid>")
  .action(async (appid, options, command) => {
    statsApplication(appid);
  });

//TODO:

//add Ably key storage - using keytar?
//switch between app keys

//other commands
// publish
// - single messages
// - 

//presence

//templates
// - pull from starter kits



program.parse(process.argv);
