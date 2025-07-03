import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';

const TaskList = ({ tasks, column }) => {
  return (
    <Droppable droppableId={column}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;