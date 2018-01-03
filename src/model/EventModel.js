import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    guild: {
        type: Schema.ObjectId,
        ref: 'Guild',
        required: true
    },
    trackId: {
        type: String,
        required: false
    },
    vehicleId: {
        type: String,
        required: false
    }
});

export default mongoose.model('Event', eventSchema)