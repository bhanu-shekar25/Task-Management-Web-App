import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] },
  category: String,
  position: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);