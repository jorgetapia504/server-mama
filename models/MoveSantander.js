import mongoose from 'mongoose'

const MoveSantanderSchema = new mongoose.Schema({
  code: { type: String, required: true },
  rut: { type: String },
  name: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
})

const MoveSantander = mongoose.models.MoveSantander || mongoose.model('MoveSantander', MoveSantanderSchema)

export default MoveSantander