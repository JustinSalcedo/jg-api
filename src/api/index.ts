import { Router } from 'express'
import application from './routes/application'
import resume from './routes/resume'

export default () => {
    const app = Router()
    application(app)
    resume(app)
    return app
}