import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bidSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model('Bids', bidSchema);
