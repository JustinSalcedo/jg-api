export interface IApplication {
    _id?: string
    title: string
    companyName: string
    position: string
    website: string
    jobDescription: string
    skillKeywords?: {
        n: number
        keyword: string
    }[]
    responsibilities?: string[]
    resume?: string
    createdAt?: Date
    updatedAt?: Date
}