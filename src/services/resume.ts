import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IApplication } from "../interfaces/IApplication";
import { IResume } from "../interfaces/IResume";

@Service()
export default class ApplicationService {
    constructor(
        @Inject('applicationModel') private applicationModel: Models.ApplicationModel,
        @Inject('resumeModel') private resumeModel: Models.ResumeModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async CreateResume({ applicationId, resume }: { applicationId: string, resume: IResume }): Promise<IResume> {
        try {
            const resumeRecord = await this.resumeModel.create(resume)
            await this.applicationModel.findByIdAndUpdate(applicationId, { resume: resumeRecord.id })
            this.logger.silly('Resume created')
            return resumeRecord
        } catch (error) {
            throw error
        }
    }

    public async GetResume({ _id }: { _id: string }): Promise<IResume> {
        try {
            return this.resumeModel.findById(_id)
        } catch (error) {
            throw error
        }
    }

    public async EditResume({ _id, resume }: { _id: string, resume: Partial<IResume> }): Promise<IResume> {
        try {
            delete resume._id
            const updatedResume = await this.resumeModel.findByIdAndUpdate(_id, resume, { new: true })
            this.logger.silly('Resume edited')
            return updatedResume
        } catch (error) {
            throw error
        }
    }
}