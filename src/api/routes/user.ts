import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import UserService from "../../services/user";

const route = Router()

export default (app: Router) => {
    app.use('/user', route)

    route.post(
        '/login',
        celebrate({
            body: Joi.object({
                sub: Joi.string().required(),
                name: Joi.string().required(),
                email: Joi.string().required(),
                email_verified: Joi.boolean().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger')
            logger.debug('Calling /login')

            try {
                const { sub, name, email, email_verified } = req.body
                const userServiceInstance = Container.get(UserService)
                const userRecord = await userServiceInstance.GetUserBySub(sub, { sub, name, email, email_verified })
                if (!userRecord) return next(new Error('Undefined response'))
                return res.status(200).json(userRecord)
            } catch (e) {
                logger.error('Error: %o', e)
                return next(e)
            }
        }
    )
}