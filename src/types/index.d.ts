import { Document, Model } from "mongoose";
import { IApplication } from "../interfaces/IApplication";
import { IResume } from "../interfaces/IResume";

declare global {
    namespace Models {
        export type ApplicationModel = Model<IApplication & Document>
        export type ResumeModel = Model<IResume & Document>
    }
}