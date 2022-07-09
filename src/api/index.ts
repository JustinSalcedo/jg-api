import { Router } from 'express'
import application from './routes/application'

export default () => {
    const app = Router()
    application(app)
    return app
}