// server.js
import express from "express";
import osc from "osc";
import { WebSocketServer } from "ws";

const WEB_SOCKET_PORT = 8080;
const SENSOR_PORT = 3333;

const app = express();
const wss = new WebSocketServer({ port: WEB_SOCKET_PORT });

// OSC over UDP受信
const oscPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: SENSOR_PORT
});

oscPort.on("message", (oscMsg) => {
  // デバイス情報も飛んでくるけど使わない
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
