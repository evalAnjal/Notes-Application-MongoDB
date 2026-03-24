
import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note',NotesSchema)