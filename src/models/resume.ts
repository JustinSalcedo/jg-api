import mongoose from "mongoose";
import { IResume } from "../interfaces/IResume";

const Resume = new mongoose.Schema({
    // $schema: {
    //     type: String,
    //     default: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json"
    // },
    basics: {
        name: String,
        label: String,
        image: String,
        email: String,
        phone: String,
        url: String,
        summary: String,
        location: {
            address: String,
            postalCode: String,
            city: String,
            countryCode: String,
            region: String
        },
        profiles: [mongoose.SchemaTypes.Mixed]
    },
    work: [mongoose.SchemaTypes.Mixed],
    education: [mongoose.SchemaTypes.Mixed],
    awards: [mongoose.SchemaTypes.Mixed],
    certificates: [mongoose.SchemaTypes.Mixed],
    skills: [mongoose.SchemaTypes.Mixed],
    languages: [mongoose.SchemaTypes.Mixed],
    projects: [mongoose.SchemaTypes.Mixed],
    meta: {
        canonical: String,
        version: String,
        lastModified: Date
    }
}, 
{ timestamps: true })

export default mongoose.model<IResume & mongoose.Document>('Resume', Resume)