import { IApplication } from "../interfaces/IApplication";
import mongoose from "mongoose";

const Application = new mongoose.Schema(
    {
        jobDescription: {
            type: String,
            required: true
        },
        skillKeywords: [{
            n: Number,
            keyword: String
        }],
        responsibilities: [String],
        resume: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Resume'
        }
    },
    { timestamps: true }
)

export default mongoose.model<IApplication & mongoose.Document>('Application', Application)