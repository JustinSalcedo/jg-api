import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IApplication } from "../interfaces/IApplication";
import { IResume } from "../interfaces/IResume";
import { IUser } from "../interfaces/IUser";

@Service()
export default class ResumeService {
    private userRecord: IUser = null
    private applicationRecord: IApplication = null

    constructor(
        @Inject('applicationModel') private applicationModel: Models.ApplicationModel,
        @Inject('resumeModel') private resumeModel: Models.ResumeModel,
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async CreateResume(userId: string, { applicationId, resume }: { applicationId: string, resume: IResume }): Promise<IResume> {
        try {
            const validUser = await this.isValidUser({userId, applicationId})
            if (!validUser) return

            const resumeRecord = await this.resumeModel.create(resume)
            await this.applicationModel.findByIdAndUpdate(applicationId, { resume: resumeRecord.id }, { new: true })
            this.logger.silly('Resume created')
            return resumeRecord
        } catch (error) {
            throw error
        }
    }

    public async GetResume(userId: string, { applicationId, _id }: { applicationId: string, _id: string }): Promise<IResume> {
        try {
            const validUser = await this.isValidUser({userId, applicationId, resumeId: _id})
            if (!validUser) return

            return this.resumeModel.findById(_id)
        } catch (error) {
            throw error
        }
    }

    public async EditResume(userId: string, { applicationId, _id, resume }: { applicationId: string, _id: string, resume: Partial<IResume> }): Promise<IResume> {
        try {
            const validUser = await this.isValidUser({userId, applicationId, resumeId: _id})
            if (!validUser) return

            delete resume._id
            const updatedResume = await this.resumeModel.findByIdAndUpdate(_id, resume, { new: true })
            this.logger.silly('Resume edited')
            return updatedResume
        } catch (error) {
            throw error
        }
    }

    public async CreateMasterResume(userId: string, resume: IResume) {
        try {
            const validUser = await this.isValidUser({userId})
            if (!validUser) return

            const resumeRecord = await this.resumeModel.create(resume)
            await this.userModel.findByIdAndUpdate(userId, { masterResume: resumeRecord.id }, { new: true })
            this.logger.silly('Master resume added')
            return resumeRecord
        } catch (error) {
            throw error
        }
    }

    public async GetMasterResume(userId: string): Promise<IResume> {
        try {
            const validUser = await this.isValidUser({userId, isMasterResume: true})
            if (!validUser) return

            return this.resumeModel.findById(this.userRecord.masterResume)
        } catch (error) {
            throw error
        }
    }

    public async EditMasterResume(userId: string, resume: Partial<IResume> ) {
        try {
            const validUser = await this.isValidUser({userId, isMasterResume: true})
            if (!validUser) return

            delete resume._id
            const updatedResume = await this.resumeModel.findByIdAndUpdate(this.userRecord.masterResume, resume, { new: true })
            this.logger.silly('Master resume edited')
            return updatedResume
        } catch (error) {
            throw error
        }
    }

    private async isValidUser({ userId, applicationId, resumeId, isMasterResume }: {
        userId: string, applicationId?: string, resumeId?: string, isMasterResume?: boolean
    }) {
        try {
            const userRecord = await this.userModel.findById(userId)
            if (!userRecord) throw new Error('User not found')
            this.userRecord = userRecord
            let validUser = true

            if (applicationId) {
                validUser = validUser && (userRecord.applications && userRecord.applications.includes(applicationId))
                if (resumeId) {
                    const applicationRecord = await this.applicationModel.findById(applicationId)
                    if (!applicationRecord) throw new Error('Application not found')
                    this.applicationRecord = applicationRecord

                    /* weak == comparator between applicationRecord and resumeId
                    since ObjectId() doesn't parse exact string */
                    validUser = validUser && (applicationRecord.resume && applicationRecord.resume == resumeId)
                }
            }
            if (isMasterResume) {
                validUser = validUser && !!userRecord.masterResume
            }
            return validUser
        } catch (error) {
            throw error
        }
    }
}