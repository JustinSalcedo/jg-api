import { Document, Model } from "mongoose";
import { IApplication } from "../interfaces/IApplication";
import { IResume } from "../interfaces/IResume";
import { IUser } from "../interfaces/IUser";

declare global {
    namespace Models {
        export type UserModel = Model<IUser & Document>
        export type ApplicationModel = Model<IApplication & Document>
        export type ResumeModel = Model<IResume & Document>
    }
}