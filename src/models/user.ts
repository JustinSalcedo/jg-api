import { IUser } from "../interfaces/IUser"
import mongoose from "mongoose"

const User = new mongoose.Schema(
    {
        sub: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        email_verified: {
            type: Boolean,
            required: true
        },
        masterResume: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Resume'
        },
        applications: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Application'
        }]
    },
    { timestamps: true }
)

export default mongoose.model<IUser & mongoose.Document>('User', User)