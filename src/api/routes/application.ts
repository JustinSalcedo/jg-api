import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from 'typedi'
import { Logger } from 'winston'
import ApplicationService from "../../services/application";

const route = Router()

export default (app: Router) => {
    app.use('/application', route)

    route.get(
        '/',
        celebrate({
            headers: Joi.object({
                userid: Joi.string().required()
            }).options({ allowUnknown: true })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application')

            try {
                const { userid: userId } = req.headers
                const applicationServiceInstance = Container.get(ApplicationService)
                const userApplications = await applicationServiceInstance.GetApplicationsByUserID(userId as string)
                if (!userApplications) return next(new Error('Undefined response'))
                return res.status(200).json(userApplications)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                title: Joi.string().required(),
                companyName: Joi.string().required(),
                position: Joi.string().required(),
                website: Joi.string().uri().required(),
                jobDescription: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application')

            try {
                const { userId, title, companyName, position, website, jobDescription } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const newApplication = await applicationServiceInstance.CreateApplication(userId, { title, companyName, position, website, jobDescription })
                if (!newApplication) return next(new Error('Undefined response'))
                return res.status(201).json(newApplication)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.get(
        '/:id',
        celebrate({
            headers: Joi.object({
                userid: Joi.string().required()
            }).options({ allowUnknown: true }),
            params: Joi.object({
                id: Joi.string()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application/:id')

            try {
                const { id: _id } = req.params
                const { userid: userId } = req.headers
                const applicationServiceInstance = Container.get(ApplicationService)
                const applicationRecord = await applicationServiceInstance.GetApplication(userId as string, _id)
                if (!applicationRecord) return next(new Error('Undefined response'))
                return res.status(200).json(applicationRecord)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.patch(
        '/:id',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                title: Joi.string(),
                companyName: Joi.string(),
                position: Joi.string(),
                website: Joi.string().uri(),
                jobDescription: Joi.string()
            }),
            params: Joi.object({
                id: Joi.string()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application/:id')

            try {
                const { id: _id } = req.params
                const { userId, title, companyName, position, website, jobDescription } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const updatedApplication = await applicationServiceInstance.EditApplication(userId, { _id, applicationUpdate: { title, companyName, position, website, jobDescription } })
                if (!updatedApplication) return next(new Error('Undefined response'))
                return res.status(200).json(updatedApplication)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.post(
        '/:id/keywords',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                skills: Joi.array().items(Joi.object({
                    n: Joi.number().integer(),
                    keyword: Joi.string().required()
                })),
                duties: Joi.array().items(Joi.string())
            }).min(2),
            params: Joi.object({
                id: Joi.string()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application/:id/keywords')

            try {
                const { id: _id } = req.params
                const { userId, skills: skillKeywords, duties: responsibilities } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const updatedApplication = await applicationServiceInstance.AddLists(userId, { _id, skillKeywords, responsibilities })
                if (!updatedApplication) return next(new Error('Undefined response'))
                return res.status(201).json(updatedApplication)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}