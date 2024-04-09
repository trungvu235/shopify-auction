import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TemplateSchema = new Schema({
    id: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    data: {
        type: Object,
        require: true,
    },
    status: {
        type: Boolean,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    store_id: {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
})


export const templateModel = mongoose.model('templates', TemplateSchema);