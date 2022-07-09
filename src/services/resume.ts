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

    public async CreateResume({ applicationId, resume }: { applicationId: string, resume: Partial<IResume> }): Promise<IResume> {
        try {
            const resumeRecord = await this.resumeModel.create(resume)
            await this.applicationModel.findByIdAndUpdate(applicationId, { resume: resumeRecord.id })
            return resumeRecord
        } catch (error) {
            throw error
        }
    }

    // public async EditResume({  })
}