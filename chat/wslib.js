const WebSocket = require("ws");
//const fs = require("fs").promises;
const fs = require("fs");
var obj = [];
//obj.table.push({ mensaje: "Bienvenido al chat" });
var obj = JSON.stringify(obj);
fs.writeFile("myjsonfile.json", obj, "utf8", function (err) {
  if (err) throw err;
  console.log("created");
});
const clients = [];
//const messages = [];
const messages = readJson();
//console.log(json);
const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", async (message) => {
      updateJson(message);
      sendMessages();
    });
  });
};

function sendMessages() {
  clients.forEach((client) => client.send(JSON.stringify(readJson())));
}

function readJson() {
  let a = "";
  fs.readFile("myjsonfile.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      a = data;
    }
  });
  return a;
}
function updateJson(message) {
  fs.readFile("myjsonfile.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data);
      var myObj = {
        mensaje: message,
      };
      obj.push(myObj);
      var json = JSON.stringify(obj);
      fs.writeFile("myjsonfile.json", json, "utf8", function (err) {
        if (err) throw err;
        console.log("updated");
      });
      //fs.writeFile("./myjsonfile.json", json);
      clients.forEach((client) => client.send(JSON.stringify(readJson())));
    }
  });
}

function load(message) {
  fs.readFile("myjsonfile.json");
  obj = JSON.parse(data);
  var myObj = {
    mensaje: message,
  };
  obj.push(myObj);
  var json = JSON.stringify(obj);
  fs.writeFile("myjsonfile.json", json);
}

exports.wsConnection = wsConnection;
