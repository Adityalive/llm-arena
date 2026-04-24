import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        default: '',
        validate: {
            validator(value: string) {
                if (this.role === 'assistant') {
                    return typeof value === 'string';
                }

                return typeof value === 'string' && value.trim().length > 0;
            },
            message: 'content is required',
        },
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
    intro: {
        type: String,
        default: null,
    },
    winner: {
        type: String,
        default: null,
    },
    reasoning: mongoose.Schema.Types.Mixed,
    solutions: [mongoose.Schema.Types.Mixed],
}, { timestamps: true, strict: false });
    
const Message = mongoose.model("Message", messageSchema);

export default Message;
