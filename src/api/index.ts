import { Router } from 'express'
import application from './routes/application'
import resume from './routes/resume'
import user from './routes/user'

export default () => {
    const app = Router()
    user(app)
    application(app)
    resume(app)
    return app
}