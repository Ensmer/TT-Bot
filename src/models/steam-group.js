import mongoose from 'mongoose'

const steamGroupSchema = new mongoose.Schema({
    guild: {
        type: mongoose.Schema.ObjectId,
        ref: 'Guild',
        required: true
    },
    groupIdentifier: {
        type: String,
        required: true
    },
    groupIdentifierType: {
        type: Number,
        required: true
    }
});

export default mongoose.model('SteamGroup', steamGroupSchema)