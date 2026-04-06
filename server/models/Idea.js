const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  differentiation: { type: String, required: true }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  problem: { type: String },
  customer: { type: String },
  market: { type: String },
  competitor: [competitorSchema],
  tech_stack: [{ type: String }],
  risk_level: { type: String, enum: ['Low', 'Medium', 'High'] },
  profitability_score: { type: Number, min: 0, max: 100 },
  justification: { type: String }
}, { _id: false });

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  report: {
    type: reportSchema,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Idea', ideaSchema);
