import MoveSantander from '../models/MoveSantander.js'
import FilterSantander from '../models/FilterSantander.js'
import { extractNumbers } from '../utils/extractNumbers.js'

export const createFilter = async (req, res) => {
  try {
    const newFilter = new FilterSantander(req.body)
    await newFilter.save()
    return res.send(newFilter)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const uploadExcel = async (req, res) => {
  try {
    const excel = req.body
    const data = excel.filter(item => {
      const data1 = item['Cartolas históricas de Cuentas Corrientes']
      const data2 = item['Cartolas históricas de Cuentas Corrientes_1']
      const data3 = item['Cartolas históricas de Cuentas Corrientes_3']
      const data4 = item['Cartolas históricas de Cuentas Corrientes_4']
      const formatoFechaRegex = /^\d{2}\/\d{2}\/\d{4}$/
      if (typeof data1 === 'number') {
        if (typeof data2 === 'string') {
          if (formatoFechaRegex.test(data3)) {
            if (typeof data4 === 'number') {
              return true
            }
          }
        }
      } else {
        return false
      }
    })
    const filter = await FilterSantander.find().lean()
    data.map(async (item) => {
      filter.map(async (fil) => {
        const compare = item['Cartolas históricas de Cuentas Corrientes_1'].toLowerCase()
        const name = fil.name.length > 0 ? fil.name.toLowerCase() : undefined
        const rut = fil.rut.length > 0 ? fil.rut.toLowerCase() : undefined
        if (compare.includes(name) || compare.includes(rut)) {
          const [day, month, year] = item['Cartolas históricas de Cuentas Corrientes_3'].split("/")
          const formattedDateString = `${month}/${day}/${year}`
          const date = new Date(formattedDateString)
          if (compare.includes('servipag 0076481178k') && fil.code === '3') {
            return
          }
          const newMove = new MoveSantander({
            code: fil.code,
            rut: extractNumbers(item['Cartolas históricas de Cuentas Corrientes_1']),
            name: item['Cartolas históricas de Cuentas Corrientes_1'],
            amount: Number(item['Cartolas históricas de Cuentas Corrientes']),
            date: date
          })
          await newMove.save()
        }
      })
    })
    return res.sendStatus(200)
  } catch (error) {
    
  }
}

export const getData = async (req, res) => {
  try {
    const fechaActual = new Date()
    const primerDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1)
    const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0, 23, 59, 59, 999)
    const data = await MoveSantander.find({
      date: {
        $gte: primerDiaMesAnterior,
        $lt: ultimoDiaMesAnterior
      }
    }).sort({ date: 1 }).lean()
    return res.send(data)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getDataFilters = async (req, res) => {
  try {
    const { search, code, initialDate, lastDate } = req.body
    const filters = {}
    if (search) {
      filters.$or = [
        { code: new RegExp(search, 'i') },
        { rut: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') }
      ]
    }
    if (code) {
      filters.code = new RegExp(`^${code}`)
    }
    if (initialDate && lastDate) {
      filters.date = {
        $gte: new Date(initialDate),
        $lte: new Date(lastDate)
      }
    }
    const result = await MoveSantander.find(filters).sort({ date: 1 })
    return res.send(result)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}