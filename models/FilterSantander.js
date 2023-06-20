import mongoose from 'mongoose'

const FilterSantanderSchema = new mongoose.Schema({
  code: { type: String, required: true },
  rut: { type: String },
  name: { type: String }
}, {
  timestamps: true
})

const FilterSantander = mongoose.models.FilterSantander || mongoose.model('FilterSantander', FilterSantanderSchema)

export default FilterSantander