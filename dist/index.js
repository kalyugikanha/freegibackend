"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./startup/db"));
const error_1 = __importDefault(require("./startup/error"));
const models_1 = __importDefault(require("./startup/models"));
const router_1 = __importDefault(require("./startup/router"));
const http_1 = __importDefault(require("http"));
const messages_1 = require("./models/messages");
const mongoose_1 = require("mongoose");
const Message = (0, mongoose_1.model)("Message", messages_1.messageSchema);
const app = (0, express_1.default)();
(0, db_1.default)();
(0, models_1.default)();
(0, router_1.default)(app);
(0, error_1.default)();
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100mb" }));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        // allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    maxHttpBufferSize: 1e8,
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join a room based on the chat ID (e.g., order ID)
    socket.on("joinRoom", ({ chatId }) => {
        socket.join(chatId);
        console.log(`User joined room: ${chatId}`);
    });
    // Handle incoming messages
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("chatData", data);
        const newMessage = new Message({
            chatId: data.chatId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            flag: data.flag,
            timestamp: new Date().toISOString(),
        });
        yield newMessage.save();
        // Emit the message to the room
        io.to(data.chatId).emit("receiveMessage", newMessage);
    }));
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
const port = process.env.PORT || config_1.default.get("port");
server.listen(port, () => console.log(`connnected on port ${port}`));
//# sourceMappingURL=index.js.map