import mongoose from "mongoose";

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
    winner_id: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    },
    start_price: {
        type: Number,
        required: true,
    },
    bid_increment: {
        type: Number,
        require: true,
    },
    end_price: {
        type: Number,
        required: false,
    },
    is_reverse_price: {
        type: Boolean,
        required: true,
    },
    is_reverse_price_display: {
        type: Boolean,
        required: true,
    },
    reserve_price: {
        type: Number,
        require: false,
    },
    is_buyout_price: {
        type: Boolean,
        required: true,
    },
    is_buyout_price_display: {
        type: Boolean,
        required: true,
    },
    buyout_price: {
        type: Number,
        require: false,
    },
}, {
    timestamps: true
});

export default mongoose.model('Auctions', auctionSchema);
