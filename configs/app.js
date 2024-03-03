'use strict'

import express from "express"
import { config } from "dotenv"
import morgan from "morgan"
import helmet from 'helmet'
import cors from 'cors'
import userRoutes from '../src/user/user.routes.js'
import companyRoutes from '../src/company/company.routes.js'

//configs
const app = express()
config()
const port = process.env.PORT || 3056

//configuraciones del servidor
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) 
app.use(helmet()) 
app.use(morgan('dev')) 

//declaracion de rutas
app.use('/user', userRoutes)
app.use('/company', companyRoutes)

//levantar el server(revisar que si prende)
export const initServer = ()=>{
    app.listen(port)
    console.log(`server is running in port ${port}`)
}