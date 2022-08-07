import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IUser } from "../interfaces/IUser";

@Service()
export default class UserService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async GetUserBySub(sub: string, user: IUser) {
        try {
            const userRecord = await this.userModel.findOne({ sub })
            if (userRecord) return userRecord
            const newUser = await this.createUser(user)
            return newUser
        } catch (error) {
            throw error
        }
    }

    private async createUser({ sub, name, email, email_verified }: IUser) {
        try {
            const userRecord = await this.userModel.create({
                sub, name, email, email_verified
            })
            this.logger.silly('User created')
            return userRecord
        } catch (error) {
            throw error
        }
    }
}