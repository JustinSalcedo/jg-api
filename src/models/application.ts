import { IApplication } from "../interfaces/IApplication";
import mongoose from "mongoose";

const Application = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        website: {
            type: String,
            required: true
        },
        jobDescription: {
            type: String,
            required: true
        },
        skillKeywords: [{
            n: {
                type: Number,
                default: 1
            },
            keyword: {
                type: String,
                required: true
            }
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