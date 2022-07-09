import expressLoader from './express'
import dependencyInjector from './dependencyInjector'
import mongooseLoader from './mongoose'
import Logger from './logger'

export default async ({ expressApp }) => {
    await mongooseLoader()
    Logger.info('DB Loaded and connected')

    const applicationModel = {
        name: 'applicationModel',
        model: require('../models/application').default
    }

    const resumeModel = {
        name: 'resumeModel',
        model: require('../models/resume').default
    }

    dependencyInjector({
        models: [
            applicationModel,
            resumeModel
        ]
    })

    Logger.info('Dependency Injector loaded')

    expressLoader({ app: expressApp })
    Logger.info('Express loaded')
}