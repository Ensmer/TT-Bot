import mongoose from 'mongoose'

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: false
    }
});

export default mongoose.model('Guild', guildSchema)