import mongoose from 'mongoose'

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    }
});

export default mongoose.model('Guild', guildSchema)