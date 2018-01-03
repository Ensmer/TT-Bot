import mongoose from 'mongoose'

let Schema = mongoose.Schema;

const steamGroupSchema = new mongoose.Schema({
    guild: {
        type: Schema.ObjectId,
        ref: 'Guild',
        required: true
    },
    groupIdentifier: {
        type: String,
        required: true
    },
    groupIdentifierType: {
        type: String,
        required: true
    }
});

export default mongoose.model('SteamGroup', steamGroupSchema)