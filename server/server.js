// server.js
import express from "express";
import osc from "osc";
import { WebSocketServer } from "ws";

const app = express();
const wss = new WebSocketServer({ port: 8080 });

// OSC over UDP受信
const oscPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 3333
});

oscPort.on("message", (oscMsg) => {
  // WebSocketクライアントに転送
  if (oscMsg.address.includes("deviceinfo")) {
    return;
  }
  // デバッグ用: 受信したOSCメッセージをコンソールに出力
  // console.log("Received OSC message:", oscMsg);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          address: oscMsg.address,
          args: oscMsg.args
        })
      );
    }
  });
});

oscPort.on("ready", () => {
  console.log("OSC Server listening on port 3333");
});

oscPort.open();

app.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});
