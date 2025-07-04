import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "../utils/api.js";
import TaskList from "./TaskList.jsx";
import TaskFormModal from "./TaskFormModal.jsx";
import { toast, Toaster } from "react-hot-toast";
import { Button, Typography, Box, IconButton, Chip } from "@mui/material";
import { Add, FilterList, Search, MoreVert } from "@mui/icons-material";
import "./TaskBoard.css";

const statuses = ["Pending", "In Progress", "Completed"];

const statusConfig = {
  Pending: {
    color: "#f59e0b",
    bgColor: "#fef3c7",
    icon: "⏳",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  },
  "In Progress": {
    color: "#3b82f6",
    bgColor: "#dbeafe",
    icon: "🚀",
    gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
  },
  Completed: {
    color: "#10b981",
    bgColor: "#d1fae5",
    icon: "✅",
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
  },
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      const grouped = statuses.reduce((acc, status) => {
        acc[status] = res.data.filter((t) => t.status === status);
        return acc;
      }, {});
      setTasks(grouped);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = [...tasks[source.droppableId]];
    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status = destination.droppableId;

    const destList = [...tasks[destination.droppableId]];
    destList.splice(destination.index, 0, movedTask);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    };

    setTasks(updatedTasks);

    try {
      await axios.patch(
        "/tasks/reorder",
        Object.values(updatedTasks)
          .flat()
          .map((task, i) => ({
            _id: task._id,
            position: i,
          }))
      );
    } catch (err) {
      toast.error("Failed to reorder tasks");
    }
  };

  const handleSave = async (taskData) => {
    try {
      await axios.post("/tasks", taskData);
      toast.success("Task created");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const getTotalTasks = () => {
    return Object.values(tasks).flat().length;
  };

  const getTaskCount = (status) => {
    return tasks[status]?.length || 0;
  };
  const onDelete = async (task) => {
    try {
      await axios.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      fetchTasks(); // reload task list
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="taskboard-container">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      />

      <div className="taskboard-header">
        <div className="header-left">
          <Typography variant="h4" component="h1" className="board-title">
            My Tasks
          </Typography>
          <Chip
            label={`${getTotalTasks()} total tasks`}
            size="small"
            className="task-counter"
          />
        </div>

        <div className="header-actions">
          <IconButton className="action-btn">
            <Search />
          </IconButton>
          <IconButton className="action-btn">
            <FilterList />
          </IconButton>
          <IconButton className="action-btn">
            <MoreVert />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            className="add-task-btn"
          >
            Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {statuses.map((status) => (
            <div key={status} className="task-column">
              <div className="column-header">
                <div className="column-title-wrapper">
                  <span className="column-icon">
                    {statusConfig[status].icon}
                  </span>
                  <Typography variant="h6" className="column-title">
                    {status}
                  </Typography>
                </div>
                <div className="column-actions">
                  <Chip
                    label={getTaskCount(status)}
                    size="small"
                    style={{
                      backgroundColor: statusConfig[status].bgColor,
                      color: statusConfig[status].color,
                      fontWeight: "bold",
                      minWidth: "28px",
                    }}
                  />
                  <IconButton size="small" className="column-menu">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </div>
              </div>

              <div
                className="column-divider"
                style={{
                  background: statusConfig[status].gradient,
                }}
              />

              <TaskList
                tasks={tasks[status] || []}
                column={status}
                onDelete={onDelete}
                onEdit={(task) => setOpen(true)} // or your edit handler
                onToggleComplete={(task) => {
                  const updated = {
                    ...task,
                    status:
                      task.status === "Completed" ? "Pending" : "Completed",
                  };
                  axios
                    .put(`/tasks/${task._id}`, updated)
                    .then(() => fetchTasks())
                    .catch(() => toast.error("Failed to update status"));
                }}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TaskBoard;
