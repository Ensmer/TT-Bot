import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    guild: {
        type: mongoose.Schema.ObjectId,
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
    },
    eventMessage: {
        type: String,
        required: false
    }
});

export default mongoose.model('Event', eventSchema)