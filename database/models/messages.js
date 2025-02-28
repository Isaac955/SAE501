// filepath: /c:/Users/taoem/Documents/SAE501/server/models/messages.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
