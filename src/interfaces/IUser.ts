export interface IUser {
    _id?: string
    sub: string
    name: string
    email: string
    email_verified: boolean
    masterResume?: string
    applications?: string[]
    createdAt?: Date
    updatedAt?: Date
}