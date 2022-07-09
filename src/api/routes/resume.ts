import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from 'typedi'
import { Logger } from 'winston'
import ResumeService from "../../services/resume";

const route = Router()

export default (app: Router) => {
    app.use('/application', route)

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                applicationId: Joi.string().required(),
                resume: Joi.object().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling %s', req.url)

            try {
                const { applicationId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                return res.json(ResumeServiceInstance.CreateResume({ applicationId, resume })).status(201)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}