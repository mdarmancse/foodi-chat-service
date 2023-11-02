import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { connectMongoDB, initRedis } from "storage";
import { initRest } from "./rest";
import { initSocketIO } from "./socketio";

export function runServer() {
  // let user know of runtime mode
  console.log(`Running application in ${process.env.NODE_ENV} mode`);

  // connect to mongo db
  connectMongoDB();

  // initialize redis client
  initRedis();

  // prepare express instance
  const app = express();

  // initialize rest controllers
  initRest(app);

  const server = http.createServer(app);

  // initialize socketio
  initSocketIO(server);

  // run server
  const port = process.env.PORT || 3333;
  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
}
