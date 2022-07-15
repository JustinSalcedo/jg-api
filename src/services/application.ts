import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IApplication } from "../interfaces/IApplication";
import { verifyPayload } from "../utils";

@Service()
export default class ApplicationService {
    constructor(
        @Inject('applicationModel') private applicationModel: Models.ApplicationModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async CreateApplication({ title, companyName, position, website, jobDescription }: IApplication): Promise<IApplication> {
        try {
            const applicationRecord = await this.applicationModel.create({
                title, companyName, position, website, jobDescription
            })
            this.logger.silly('Application created')
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public async EditApplication({ _id, applicationUpdate }: { _id: string, applicationUpdate: Partial<IApplication>}): Promise<IApplication> {
        try {
            const payload = verifyPayload(applicationUpdate)
            const applicationRecord = await this.applicationModel.findByIdAndUpdate(_id, payload, { new: true })
            this.logger.silly('Application updated')
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public async AddLists({ _id, skillKeywords, responsibilities }: Partial<IApplication>): Promise<IApplication> {
        try {
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
}