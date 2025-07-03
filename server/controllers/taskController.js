import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).sort({ position: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, category } = req.body;

  try {
    const count = await Task.countDocuments({ userId: req.user });
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      category,
      position: count,
      userId: req.user
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reorderTasks = async (req, res) => {
  const updates = req.body.map((task, index) => ({
    updateOne: {
      filter: { _id: task._id },
      update: { $set: { position: index } }
    }
  }));

  try {
    await Task.bulkWrite(updates);
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};