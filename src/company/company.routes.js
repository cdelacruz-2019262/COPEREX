'use strict'

import {Router} from 'express'
import { test, register, update, sortAZ, sortZA, sortAntiquity, sortNovelty, excelTable } from './company.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router();

api.get('/test', test)

api.post('/register', [validateJwt], register)
api.put('/update/:id', [validateJwt], update)
api.get('/sortAZ', [validateJwt], sortAZ)
api.get('/sortZA', [validateJwt], sortZA)
api.get('/sortAntiquity', [validateJwt], sortAntiquity)
api.get('/sortNovelty', [validateJwt], sortNovelty)
api.get('/excel', [validateJwt], excelTable)

export default api