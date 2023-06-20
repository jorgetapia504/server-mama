import Router from 'express'
import { createFilter, uploadExcel, getData, getDataFilters } from '../controllers/santander.controllers.js'

const router = Router()

router.post('/santander/create-filter', createFilter)

router.post('/santander/upload-excel', uploadExcel)

router.get('/santander/get-data', getData)

router.post('/santander/get-data', getDataFilters)

export default router