import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null,
    },
    sessionId: {
        type: String,
        default: null,
    },
    messages: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
        default: [],
    },
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
