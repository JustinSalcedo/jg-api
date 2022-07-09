import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IApplication } from "../interfaces/IApplication";

@Service()
export default class ApplicationService {
    constructor(
        @Inject('applicationModel') private applicationModel: Models.ApplicationModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async CreateApplication({ jobDescription }: Partial<IApplication>): Promise<IApplication> {
        try {
            const applicationRecord = await this.applicationModel.create({
                jobDescription
            })
            this.logger.silly('Application created')
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
            return this.applicationModel.findByIdAndUpdate(_id, payload)

        } catch (error) {
            throw error
        }
    }
}