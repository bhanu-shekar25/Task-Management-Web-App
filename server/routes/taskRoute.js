import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask); // ✅ Add this line
router.patch('/reorder', protect, reorderTasks);

export default router;