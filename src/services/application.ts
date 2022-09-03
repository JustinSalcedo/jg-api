import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IApplication } from "../interfaces/IApplication";
import { IUser } from "../interfaces/IUser";
import { verifyPayload } from "../utils";

@Service()
export default class ApplicationService {
    private userRecord: IUser = null

    constructor(
        @Inject('applicationModel') private applicationModel: Models.ApplicationModel,
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async GetApplication(userId: string, _id: string) {
        try {
            const validUser = await this.isValidUser(userId, _id)
            if (!validUser) return

            const applicationRecord = await this.applicationModel.findById(_id)
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public async GetApplicationsByUserID(userId: string) {
        try {
            const validUser = await this.isValidUser(userId)
            if (!validUser) return

            /* We MUST use _id to query and filter records, and id to parse the ObjectID to string */
            const allApplications = await this.applicationModel.find({ _id: { $in: this.userRecord.applications } })
            return allApplications
        } catch (error) {
            throw error
        }
    }

    public async CreateApplication(userId: string, { title, companyName, position, website, jobDescription }: IApplication): Promise<IApplication> {
        try {
            const validUser = await this.isValidUser(userId)
            if (!validUser) return

            const applicationRecord = await this.applicationModel.create({
                title, companyName, position, website, jobDescription
            })
            this.logger.silly('Application created')
            const userApplications = this.userRecord.applications || []
            await this.userModel.findByIdAndUpdate(userId, { applications: [ ...userApplications, applicationRecord.id ] }, { new: true })
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public async EditApplication(userId: string, { _id, applicationUpdate }: { _id: string, applicationUpdate: Partial<IApplication>}): Promise<IApplication> {
        try {
            const validUser = await this.isValidUser(userId, _id)
            if (!validUser) return

            const payload = verifyPayload(applicationUpdate)
            const applicationRecord = await this.applicationModel.findByIdAndUpdate(_id, payload, { new: true })
            this.logger.silly('Application updated')
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public async AddLists(userId: string, { _id, skillKeywords, responsibilities }: Partial<IApplication>): Promise<IApplication> {
        try {
            const validUser = await this.isValidUser(userId, _id)
            if (!validUser) return
            
            const payload = {}
            if (skillKeywords) payload["skillKeywords"] = skillKeywords
            if (responsibilities) payload["responsibilities"] = responsibilities
            const updatedApplication = await this.applicationModel.findByIdAndUpdate(_id, payload, { new: true })
            this.logger.silly('Lists added')
            return updatedApplication
        } catch (error) {
            throw error
        }
    }

    private async isValidUser(userId: string, applicationId?: string) {
        try {
            const userRecord = await this.userModel.findById(userId)
            if (!userRecord) throw new Error('User not found')
            this.userRecord = userRecord

            if (applicationId) {
                return userRecord.applications && userRecord.applications.includes(applicationId)
            }
            return true
        } catch (error) {
            throw error
        }
    }
}