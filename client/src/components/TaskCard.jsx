import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  IconButton, 
  Tooltip,
  CardActions 
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  CheckCircle, 
  Schedule, 
  Flag 
} from '@mui/icons-material';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  showActions = true 
}) => {
  // Priority color mapping
  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch (priorityLower) {
      case 'high':
      case 'urgent':
        return 'error';
      case 'medium':
      case 'normal':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'done':
        return 'success';
      case 'in-progress':
      case 'in progress':
        return 'info';
      case 'pending':
      case 'todo':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Format date if provided
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  const isCompleted = task.status?.toLowerCase() === 'completed';

  return (
    <Card 
      sx={{ 
        mb: 2, 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        opacity: isCompleted ? 0.7 : 1,
        border: isOverdue(task.dueDate) ? '1px solid' : 'none',
        borderColor: isOverdue(task.dueDate) ? 'error.main' : 'transparent'
      }}
    >
      <CardContent sx={{ pb: showActions ? 1 : 2 }}>
        {/* Header with title and priority */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.secondary' : 'text.primary'
            }}
          >
            {task.title}
          </Typography>
          {task.priority && (
            <Chip 
              icon={<Flag size="small" />}
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {/* Description */}
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Tags/Chips row */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status chip */}
          {task.status && (
            <Chip 
              icon={task.status.toLowerCase() === 'completed' ? <CheckCircle /> : <Schedule />}
              label={task.status}
              color={getStatusColor(task.status)}
              size="small"
              variant="filled"
            />
          )}

          {/* Due date chip */}
          {task.dueDate && (
            <Chip 
              icon={<Schedule />}
              label={`Due: ${formatDate(task.dueDate)}`}
              color={isOverdue(task.dueDate) ? 'error' : 'default'}
              size="small"
              variant="outlined"
            />
          )}

          {/* Category/Project chip */}
          {task.category && (
            <Chip 
              label={task.category}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}

          {/* Assignee chip */}
          {task.assignee && (
            <Chip 
              label={`@${task.assignee}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      {/* Action buttons */}
      {showActions && (
        <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
          {onToggleComplete && (
            <Tooltip title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}>
              <IconButton 
                size="small" 
                onClick={() => onToggleComplete(task)}
                color={isCompleted ? 'success' : 'default'}
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
          
          {onEdit && (
            <Tooltip title="Edit task">
              <IconButton size="small" onClick={() => onEdit(task)}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          
          {onDelete && (
            <Tooltip title="Delete task">
              <IconButton size="small" onClick={() => onDelete(task)} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default TaskCard;