import Task from '../models/Task.js';

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).sort({ position: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// POST /api/tasks
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
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete Task Error:', err.message);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

// PATCH /api/tasks/reorder
export const reorderTasks = async (req, res) => {
  const updates = req.body.map((task, index) => ({
    updateOne: {
      filter: { _id: task._id, userId: req.user },
      update: { $set: { position: index } }
    }
  }));

  try {
    await Task.bulkWrite(updates);
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reorder tasks' });
  }
};
