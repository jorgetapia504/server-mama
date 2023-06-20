import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import bodyParser from 'body-parser'

import santanderRoutes from './routes/santander.routes.js'

const app = express()

connectDB()

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(santanderRoutes)

app.listen(process.env.PORT || 3000)
console.log('Server on port', process.env.PORT || 3000)