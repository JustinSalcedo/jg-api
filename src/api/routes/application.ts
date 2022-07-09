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
                jobDescription: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling %s', req.url)

            try {
                const { jobDescription } = req.body
                const applicationServiceInstance = Container.get(ApplicationService)
                return res.json(applicationServiceInstance.CreateApplication({ jobDescription })).status(201)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}