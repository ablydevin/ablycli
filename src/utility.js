//const STREAMING_DELAY_IN_SECONDS = 1;
//   while (true) {
//     await sleep(STREAMING_DELAY_IN_SECONDS * 1000);
//   }

export const DEFAULT_COLUMN_SPLITTER = " | ";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//exports.sleep = sleep;
//exports.DEFAULT_COLUMN_SPLITTER = DEFAULT_COLUMN_SPLITTER;
//exports.STREAMING_DELAY_IN_SECONDS = STREAMING_DELAY_IN_SECONDS;