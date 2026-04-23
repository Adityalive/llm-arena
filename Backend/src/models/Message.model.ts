import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'streaming', 'complete', 'error', 'stopped'],
        default: 'pending',
    },
    model: {
        type: String,
        default: null,
    },
    runId: {
        type: String,
        default: null,
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
}, { timestamps: true });
    
const Message = mongoose.model("Message", messageSchema);

export default Message;
