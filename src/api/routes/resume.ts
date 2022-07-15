import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from 'typedi'
import { Logger } from 'winston'
import ResumeService from "../../services/resume";

const route = Router()

export default (app: Router) => {
    app.use('/resume', route)

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
            logger.debug('Calling /resume')

            try {
                const { applicationId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const newResume = await ResumeServiceInstance.CreateResume({ applicationId, resume })
                return res.status(201).json(newResume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.get(
        '/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/:id')

            try {
                const { id: _id } = req.params
                const ResumeServiceInstance = Container.get(ResumeService)
                const resume = await ResumeServiceInstance.GetResume({ _id })
                return res.status(200).json(resume)
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
                resume: Joi.object().required()
            }),
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/:id')

            try {
                const { id: _id } = req.params
                const { resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const updatedResume = await ResumeServiceInstance.EditResume({ _id, resume })
                return res.status(200).json(updatedResume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}