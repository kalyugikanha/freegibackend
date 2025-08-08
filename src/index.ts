import express, { Application } from "express";
import cors from "cors";
import config from '../config/config'
import { Server } from "socket.io";
import db from "./startup/db";
import errorHandler from "./startup/error";
import models from "./startup/models";
import routes from "./startup/router";
import http from "http";
import { messageSchema } from "./models/messages";
import { model } from "mongoose";
const Message = model("Message", messageSchema);

const app: Application = express();

app.use(cors({
 origin: "*",
 methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
 allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

db();
models();
routes(app);
errorHandler();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({extended:true,limit: "100mb"}));

const server = http.createServer(app);
const io = new Server(server, {
 cors: {
   origin: "*",
   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
 },
 transports: ["websocket", "polling"],
 allowEIO3: true,
 maxHttpBufferSize: 1e8,
});

io.on("connection", (socket) => {
 console.log(`User connected: ${socket.id}`);

 socket.on("joinRoom", ({ chatId }) => {
   socket.join(chatId);
   console.log(`User joined room: ${chatId}`);
 });

 socket.on("sendMessage", async (data: any) => {
   const newMessage = new Message({
     chatId: data.chatId,
     senderId: data.senderId,
     receiverId: data.receiverId,
     message: data.message,
     flag: data.flag,
     timestamp: new Date().toISOString(),
   });

   await newMessage.save();

   io.to(data.chatId).emit("receiveMessage", newMessage);
 });

 socket.on("disconnect", () => {
   console.log(`User disconnected: ${socket.id}`);
 });
});

const port = process.env.PORT || config.get("port");
server.listen(port, () => console.log(`connnected on port ${port}`));