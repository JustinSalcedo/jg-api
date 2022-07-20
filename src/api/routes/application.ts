import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from 'typedi'
import { Logger } from 'winston'
import ApplicationService from "../../services/application";

const route = Router()

export default (app: Router) => {
    app.use('/application', route)

    route.post(
        '/',
        celebrate({
            body: Joi.object({
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
                const { title, companyName, position, website, jobDescription } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const newApplication = await applicationServiceInstance.CreateApplication({ title, companyName, position, website, jobDescription })
                return res.status(201).json(newApplication)
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
                const { title, companyName, position, website, jobDescription } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const updatedApplication = await applicationServiceInstance.EditApplication({ _id, applicationUpdate: { title, companyName, position, website, jobDescription } })
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
                skills: Joi.array().items(Joi.object({
                    n: Joi.number().integer(),
                    keyword: Joi.string().required()
                })),
                duties: Joi.array().items(Joi.string())
            }).min(1),
            params: Joi.object({
                id: Joi.string()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /application/:id/keywords')

            try {
                const { id: _id } = req.params
                const { skills: skillKeywords, duties: responsibilities } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                const updatedApplication = await applicationServiceInstance.AddLists({ _id, skillKeywords, responsibilities })
                return res.status(201).json(updatedApplication)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}