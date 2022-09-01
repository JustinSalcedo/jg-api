import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from 'typedi'
import { Logger } from 'winston'
import ResumeService from "../../services/resume";

const route = Router()

export default (app: Router) => {
    app.use('/resume', route)

    // Master resumes
    route.post(
        '/master',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                resume: Joi.object().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/master')

            try {
                const { userId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const newResume = await ResumeServiceInstance.CreateMasterResume(userId, resume)
                if (!newResume) return next(new Error('Undefined response'))
                return res.status(201).json(newResume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.get(
        '/master',
        celebrate({
            headers: Joi.object({
                userid: Joi.string().required()
            }).options({ allowUnknown: true })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/master')

            try {
                const { userid: userId } = req.headers
                const ResumeServiceInstance = Container.get(ResumeService)
                const resume = await ResumeServiceInstance.GetMasterResume(userId as string)
                if (!resume) return next(new Error('Undefined response'))
                return res.status(200).json(resume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    route.patch(
        '/master',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                resume: Joi.object().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/master')

            try {
                const { userId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const updatedResume = await ResumeServiceInstance.EditMasterResume(userId, resume)
                if (!updatedResume) return next(new Error('Undefined response'))
                return res.status(200).json(updatedResume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )

    // Regular resumes
    route.post(
        '/',
        celebrate({
            body: Joi.object({
                userId: Joi.string().required(),
                applicationId: Joi.string().required(),
                resume: Joi.object().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume')

            try {
                const { userId, applicationId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const newResume = await ResumeServiceInstance.CreateResume(userId, { applicationId, resume })
                if (!newResume) return next(new Error('Undefined response'))
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
            headers: Joi.object({
                userid: Joi.string().required(),
                applicationid: Joi.string().required()
            }).options({ allowUnknown: true }),
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /resume/:id')

            try {
                const { userid: userId, applicationid } = req.headers
                const { id: _id } = req.params
                const ResumeServiceInstance = Container.get(ResumeService)
                const resume = await ResumeServiceInstance.GetResume(userId as string, { applicationId: applicationid as string, _id })
                if (!resume) return next(new Error('Undefined response'))
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
                userId: Joi.string().required(),
                applicationId: Joi.string().required(),
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
                const { userId, applicationId, resume } = req.body
                const ResumeServiceInstance = Container.get(ResumeService)
                const updatedResume = await ResumeServiceInstance.EditResume(userId, { applicationId,  _id, resume })
                if (!updatedResume) return next(new Error('Undefined response'))
                return res.status(200).json(updatedResume)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}