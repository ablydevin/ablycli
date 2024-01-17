import columnify from "columnify";
import EventSource from "eventsource";
import logUpdate from "log-update";
import Table from "cli-table3";

export const statsApplication = async (appid) => {
  printTable();

  var connections = new EventSource(
    `https://realtime.ably.io/sse?v=1.2&channels=[meta]stats:minute&key=${process.env.ABLY_API_KEY}`
  );
  connections.addEventListener("message", outputApplicationLog);
  connections.onerror = outputApplicationError;
};

const statsDataStructure = {
  messages: {
    all: {
      all: {
        count: 0,
        data: 0,
        uncompressedData: 0,
      },
      messages: {
        count: 0,
        data: 0,
        uncompressedData: 0,
      },
      presence: {
        count: 0,
        data: 0,
        uncompressedData: 0,
      },
    },
    inbound: {
      all: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      realtime: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      rest: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
    },
    outbound: {
      all: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      realtime: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      rest: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      webhook: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      sharedQueue: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      externalQueue: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      httpEvent: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
      push: {
        all: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        messages: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
        presence: {
          count: 0,
          data: 0,
          uncompressedData: 0,
        },
      },
    },
  },
  persisted: {
    all: {
      count: 0,
      data: 0,
      uncompressedData: 0,
    },
    messages: {
      count: 0,
      data: 0,
      uncompressedData: 0,
    },
    presence: {
      count: 0,
      data: 0,
      uncompressedData: 0,
    },
  },
  connections: {
    all: {
      peak: 0,
      min: 0,
      mean: 0.0,
      opened: 0,
      refused: 0,
    },
    plain: {
      peak: 0,
      min: 0,
      mean: 0.0,
      opened: 0,
      refused: 0,
    },
    tls: {
      peak: 0,
      min: 0,
      mean: 0.0,
      opened: 0,
      refused: 0,
    },
  },
  channels: {
    peak: 0,
    min: 0,
    mean: 0.0,
    opened: 0,
    refused: 0
  },
  apiRequests: {
    all: {
      succeeded: 0,
    },
    tokenRequests: {
      succeeded: 0,
    },
  },
};

// const updteIfExists = (current, next) => {
//   if (next === undefined) {
//     return;
//   } else {
//     current = next;
//   }
// }

const outputApplicationLog = (e) => {
  let msg = JSON.parse(e.data);
  let stats = JSON.parse(msg.data);

  //logUpdate(JSON.stringify(stats,null,2));

  //Connections
  statsDataStructure.connections.all.peak =
    stats.entries["connections.all.peak"] ??
    statsDataStructure.connections.all.peak;
  statsDataStructure.connections.all.min =
    stats.entries["connections.all.min"] ??
    statsDataStructure.connections.all.min;
  statsDataStructure.connections.all.mean =
    stats.entries["connections.all.mean"] ??
    statsDataStructure.connections.all.mean;
  statsDataStructure.connections.all.opened =
    stats.entries["connections.all.opened"] ??
    statsDataStructure.connections.all.opened;

  //Channels
  statsDataStructure.channels.peak =
    stats.entries["channels.peak"] ?? statsDataStructure.channels.peak;
  statsDataStructure.channels.min =
    stats.entries["channels.min"] ?? statsDataStructure.channels.peak;
  statsDataStructure.channels.mean =
    stats.entries["channels.mean"] ?? statsDataStructure.channels.peak;

  //Messages/All/All
  statsDataStructure.messages.all.all.count =
    stats.entries["messages.all.all.count"] ??
    statsDataStructure.messages.all.all.count;
  statsDataStructure.messages.all.all.data =
    stats.entries["messages.all.all.data"] ??
    statsDataStructure.messages.all.all.data;
  statsDataStructure.messages.all.all.uncompressedData =
    stats.entries["messages.all.all.uncompressedData"] ??
    statsDataStructure.messages.all.all.uncompressedData;

  //Messages/All/Messages
  statsDataStructure.messages.all.messages.count =
    stats.entries["messages.all.messages.count"] ??
    statsDataStructure.messages.all.messages.count;
  statsDataStructure.messages.all.messages.data =
    stats.entries["messages.all.messages.data"] ??
    statsDataStructure.messages.all.messages.data;
  statsDataStructure.messages.all.messages.uncompressedData =
    stats.entries["messages.all.messages.uncompressedData"] ??
    statsDataStructure.messages.all.messages.uncompressedData;

  //Messages/Inbound/Realtime/All
  statsDataStructure.messages.inbound.realtime.all.count =
    stats.entries["messages.inbound.realtime.all.count"] ??
    statsDataStructure.messages.inbound.realtime.all.count;
  statsDataStructure.messages.inbound.realtime.all.data =
    stats.entries["messages.inbound.realtime.all.data"] ??
    statsDataStructure.messages.inbound.realtime.all.data;
  statsDataStructure.messages.inbound.realtime.all.uncompressedData =
    stats.entries["messages.inbound.realtime.all.uncompressedData"] ??
    statsDataStructure.messages.inbound.realtime.all.uncompressedData;

  //Messages/Inbound/Realtime/Messages
  statsDataStructure.messages.inbound.realtime.messages.count =
    stats.entries["messages.inbound.realtime.messages.count"] ??
    statsDataStructure.messages.inbound.realtime.messages.count;
  statsDataStructure.messages.inbound.realtime.messages.data =
    stats.entries["messages.inbound.realtime.messages.data"] ??
    statsDataStructure.messages.inbound.realtime.messages.data;
  statsDataStructure.messages.inbound.realtime.messages.uncompressedData =
    stats.entries["messages.inbound.realtime.messages.uncompressedData"] ??
    statsDataStructure.messages.inbound.realtime.messages.uncompressedData;

  //Messages/Inbound/All/All
  statsDataStructure.messages.inbound.all.all.count =
    stats.entries["messages.inbound.all.all.count"] ??
    statsDataStructure.messages.inbound.all.all.count;
  statsDataStructure.messages.inbound.all.all.data =
    stats.entries["messages.inbound.all.all.data"] ??
    statsDataStructure.messages.inbound.all.all.data;
  statsDataStructure.messages.inbound.all.all.uncompressedData =
    stats.entries["messages.inbound.all.all.uncompressedData"] ??
    statsDataStructure.messages.inbound.all.all.uncompressedData;

  //Messages/Inbound/All/Messages
  statsDataStructure.messages.inbound.all.messages.count =
    stats.entries["messages.inbound.all.messages.count"] ??
    statsDataStructure.messages.inbound.all.messages.count;
  statsDataStructure.messages.inbound.all.messages.data =
    stats.entries["messages.inbound.all.messages.data"] ??
    statsDataStructure.messages.inbound.all.messages.data;
  statsDataStructure.messages.inbound.all.messages.uncompressedData =
    stats.entries["messages.inbound.all.messages.uncompressedData"] ??
    statsDataStructure.messages.inbound.all.messages.uncompressedData;

  //Messages/Outbound/Realtime/All
  statsDataStructure.messages.outbound.realtime.all.count =
    stats.entries["messages.outbound.realtime.all.count"] ??
    statsDataStructure.messages.outbound.realtime.all.count;
  statsDataStructure.messages.outbound.realtime.all.data =
    stats.entries["messages.outbound.realtime.all.data"] ??
    statsDataStructure.messages.outbound.realtime.all.data;
  statsDataStructure.messages.outbound.realtime.all.uncompressedData =
    stats.entries["messages.outbound.realtime.all.uncompressedData"] ??
    statsDataStructure.messages.outbound.realtime.all.uncompressedData;

  //Messages/Outbound/Realtime/Messages
  statsDataStructure.messages.outbound.realtime.messages.count =
    stats.entries["messages.outbound.realtime.messages.count"] ??
    statsDataStructure.messages.outbound.realtime.messages.count;
  statsDataStructure.messages.outbound.realtime.messages.data =
    stats.entries["messages.outbound.realtime.messages.data"] ??
    statsDataStructure.messages.outbound.realtime.messages.data;
  statsDataStructure.messages.outbound.realtime.messages.uncompressedData =
    stats.entries["messages.outbound.realtime.messages.uncompressedData"] ??
    statsDataStructure.messages.outbound.realtime.messages.uncompressedData;

  //Messages/Outbound/All/All
  statsDataStructure.messages.outbound.all.all.count =
    stats.entries["messages.outbound.all.all.count"] ??
    statsDataStructure.messages.outbound.all.all.count;
  statsDataStructure.messages.outbound.all.all.data =
    stats.entries["messages.outbound.all.all.data"] ??
    statsDataStructure.messages.outbound.all.all.data;
  statsDataStructure.messages.outbound.all.all.uncompressedData =
    stats.entries["messages.outbound.all.all.uncompressedData"] ??
    statsDataStructure.messages.outbound.all.all.uncompressedData;

  //Messages/Outbound/All/Messages
  statsDataStructure.messages.outbound.all.messages.count =
    stats.entries["messages.outbound.all.messages.count"] ??
    statsDataStructure.messages.outbound.all.messages.count;
  statsDataStructure.messages.outbound.all.messages.data =
    stats.entries["messages.outbound.all.messages.data"] ??
    statsDataStructure.messages.outbound.all.messages.data;
  statsDataStructure.messages.outbound.all.messages.uncompressedData =
    stats.entries["messages.outbound.all.messages.uncompressedData"] ??
    statsDataStructure.messages.outbound.all.messages.uncompressedData;

  printTable();
};

const printTable = () => {
  const table = new Table({});
  table.push(
    [{ colSpan: 6, content: "Messages" }],
    //{ content: "Connections" }, { content: 'Channels' }
    [
      { colSpan: 2, content: "Inbound" },
      { colSpan: 2, content: "Outbound" },
      { colSpan: 2, content: "All" },
      // { rowSpan: 6, content: `Peak: ${statsDataStructure.connections.all.peak}\nMin: ${statsDataStructure.connections.all.min}\nMean: ${statsDataStructure.connections.all.mean}\nOpened: ${statsDataStructure.connections.all.opened}` },
      // { rowSpan: 6, content: `Peak: ${statsDataStructure.channels.peak}\nMin: ${statsDataStructure.channels.min}\nMean: ${statsDataStructure.channels.mean}`  }
    ],
    [
      { colSpan: 2, content: "All" },
      { colSpan: 2, content: "All" },
      { colSpan: 2, content: "All" },
    ],
    [
      { content: "All" },
      { content: "Messages" },
      { content: "All" },
      { content: "Messages" },
      { content: "All" },
      { content: "Messages" },
    ],
    [
      {
        content: `Count: ${statsDataStructure.messages.inbound.all.all.count}\nData: ${statsDataStructure.messages.inbound.all.all.data}\nUncompressed: ${statsDataStructure.messages.inbound.all.all.uncompressedData}`,
      },
      {
        content: `Count: ${statsDataStructure.messages.inbound.all.messages.count}\nData: ${statsDataStructure.messages.inbound.all.messages.data}\nUncompressed: ${statsDataStructure.messages.inbound.all.messages.uncompressedData}`,
      },
      {
        content: `Count: ${statsDataStructure.messages.outbound.all.all.count}\nData: ${statsDataStructure.messages.outbound.all.all.data}\nUncompressed: ${statsDataStructure.messages.outbound.all.all.uncompressedData}`,
      },
      {
        content: `Count: ${statsDataStructure.messages.outbound.all.messages.count}\nData: ${statsDataStructure.messages.outbound.all.messages.data}\nUncompressed: ${statsDataStructure.messages.outbound.all.messages.uncompressedData}`,
      },
      {
        content: `Count: ${statsDataStructure.messages.all.all.count}\nData: ${statsDataStructure.messages.all.all.data}\nUncompressed: ${statsDataStructure.messages.all.all.uncompressedData}`,
      },
      {
        content: `Count: ${statsDataStructure.messages.all.messages.count}\nData: ${statsDataStructure.messages.all.messages.data}\nUncompressed: ${statsDataStructure.messages.all.messages.uncompressedData}`,
      },
    ],
    [
      { colSpan: 2, content: "Realtime" },
      { colSpan: 2, content: "Realtime" },
      { colSpan: 2, content: "Realtime" },
    ],

    [
      { content: "All" },
      { content: "Messages" },
      { content: "All" },
      { content: "Messages" },
      { content: "All" },
      { content: "Messages" },
    ],
    [
      { content: "M/In/Realtime/All" },
      { content: "M/In/Realtime/Messages" },
      { content: "M/Out/Realtime/All" },
      { content: "M/Out/Realtime/Messages" },
      { content: "M/All/Realtime/All" },
      { content: "M/All/Realtime/Messages" },
    ]

    // [
    //   {
    //     ,
    //   },
    //   {
    //     content: `Count: ${statsDataStructure.messages.outbound.all.all.count}\nData: ${statsDataStructure.messages.inbound.all.all.data}\nUncompressed Data: ${statsDataStructure.messages.inbound.all.all.uncompressedData}`,
    //   },
    //   { content: `Count: ${statsDataStructure.messages.all.all.count}\nData: ${statsDataStructure.messages.inbound.all.all.data}\nUncompressed Data: ${statsDataStructure.messages.inbound.all.all.uncompressedData}` },

    // ]
  );

  logUpdate(table.toString());
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

//exports.statsApplication = statsApplication;
